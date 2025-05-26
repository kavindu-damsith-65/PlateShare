import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';

const SignupUploads = ({ role, formData, setFormData, prevStep, handleSubmit }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgressModal, setShowProgressModal] = useState(false);



    const handleImagePick = async (fieldName) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need access to your photos to upload images');
                return;
            }

            setUploading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setFormData({
                    ...formData,
                    [fieldName]: result.assets[0].uri
                });
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image");
        } finally {
            setUploading(false);
        }
    };

    const uploadFile = async (uri, fieldName) => {
        const newImageUri = "file:///" + uri.split("file:/").join("");
        const type = mime.getType(newImageUri);

        const formData = new FormData();
        formData.append(fieldName, {
            uri: newImageUri,
            type: type,
            name: newImageUri.split("/").pop()
        });

        try {
            const response = await FileSystem.uploadAsync(
                process.env.EXPO_PUBLIC_BACKEND_URL+'/api/upload',
                newImageUri,
                {
                    fieldName: fieldName,
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    onUploadProgress: ({ totalBytesSent, totalBytesExpectedToSend }) => {
                        const progress = totalBytesSent / totalBytesExpectedToSend;
                        setUploadProgress(Math.round(progress * 100));
                    }
                }
            );
            return JSON.parse(response.body).filePath; // Adjust based on your API response
        } catch (error) {
            Alert.alert('Upload error', error);
            throw error;
        }
    };

    const handleFinalSubmit = async () => {
        if (!formData.profileImage) {
            Alert.alert('Required', 'Please upload a profile image');
            return;
        }

        if (role === 'org' && (!formData.orgImage1 || !formData.orgImage2 || !formData.orgImage3)) {
            Alert.alert('Required', 'Please upload all organization images');
            return;
        }

        try {
            setShowProgressModal(true);
            setUploadProgress(0);

            // Upload profile image
            const profileImageUrl = await uploadFile(formData.profileImage, 'file');

            // Upload org images if applicable
            let orgImageUrls = {};
            if (role === 'org') {
                for (let i = 1; i <= 3; i++) {
                    const fieldName = `orgImage${i}`;
                    orgImageUrls[fieldName] = await uploadFile(formData[fieldName], 'file');
                }
            }

            // Prepare final data for registration
            const registrationData = {
                ...formData,
                profileImage: profileImageUrl,
                ...orgImageUrls
            };
            setShowProgressModal(false);
            await handleSubmit(registrationData);

        } catch (error) {
            Alert.alert('Error', 'Failed to upload images. Please try again.');
            setShowProgressModal(false);
        } finally {
            setShowProgressModal(false);
        }
    };

    return (
        <View className="space-y-4 p-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
                {role === 'org' ? 'Organization Details' : 'Complete Your Profile'}
            </Text>

            {/* Profile Image Upload */}
            <View className="items-center">
                <View className="relative">
                    <Image
                        source={formData.profileImage
                            ? { uri: formData.profileImage }
                            : require('../../assets/user.png')}
                        className="w-32 h-32 rounded-full border-2 border-gray-200"
                    />
                    <TouchableOpacity
                        className="absolute bottom-0 right-0 bg-[#00CCBB] p-2 rounded-full"
                        onPress={() => handleImagePick('profileImage')}
                        disabled={uploading}
                    >
                        <Ionicons name="pencil" size={16} color="white" />
                    </TouchableOpacity>
                </View>
                {uploading ? <ActivityIndicator size="small" color="#00CCBB" className="mt-2" />:<></>}
                <Text className="text-gray-600 mb-2 text-center">
                    {role === 'org'
                        ? 'This will be your Organization Logo. You can change it later'
                        : 'This will be your Profile Photo. You can change it later.'}
                </Text>
            </View>

            {/* Additional Images for Organizations */}
            {role === 'org' ? (
                <View>
                    <Text className="text-gray-600 mb-2">Organization Gallery (3 required images)</Text>
                    <View className="flex-row justify-between">
                        {[1, 2, 3].map((num) => (
                            <View key={num} className="w-[30%] aspect-square">
                                <TouchableOpacity
                                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                                    onPress={() => handleImagePick(`orgImage${num}`)}
                                    disabled={uploading}
                                >
                                    {formData[`orgImage${num}`] ? (
                                        <Image
                                            source={{ uri: formData[`orgImage${num}`] }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <View className="w-full h-full bg-gray-100 items-center justify-center">
                                            <Ionicons name="add" size={24} color="#6B7280" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            ):<></>}

            {/* Navigation Buttons */}
            <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                    className="bg-gray-100 px-6 py-3 rounded-lg flex-1 mr-2"
                    onPress={prevStep}
                >
                    <Text className="text-center text-gray-700">Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#00CCBB] px-6 py-3 rounded-lg flex-1 ml-2"
                    onPress={handleFinalSubmit}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-center text-white font-bold">Finish</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Upload Progress Modal */}
            <Modal
                transparent={true}
                visible={showProgressModal}
                onRequestClose={() => setShowProgressModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                        <Text className="text-lg font-bold mb-4">Uploading Images</Text>
                        <View className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <View
                                className="bg-[#00CCBB] h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </View>
                        <Text className="text-gray-600">{uploadProgress}% Complete</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SignupUploads;
