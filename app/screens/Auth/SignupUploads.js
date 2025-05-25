import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';




const SignupUploads = ({ role, formData, setFormData, prevStep, handleSubmit }) => {
    const [uploading, setUploading] = useState(false);

    const handleImagePick = async (fieldName) => {
        try {
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


    return (
        <View className="space-y-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4"> {role === 'org' ? 'Organization Details' : 'Complete Your Profile'}</Text>


            <View>

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
                    {uploading && (
                        <View className="mt-2">
                            <ActivityIndicator size="small" color="#00CCBB" />
                        </View>
                    )}
                </View>
                <Text className="text-gray-600 mb-2 text-center" >
                    {role === 'org' ? 'This will be your Organization Logo.You can change it later' : 'This will be your Profile Photo.You can change it later.'}
                </Text>
            </View>


            {/* Additional Images for Organizations */}
            {role === 'org' ? (
                <View>


                    <View className="flex-row justify-between">
                        {[1, 2, 3].map((num) => (
                            <View key={num} className="w-[30%] aspect-square">
                                <TouchableOpacity
                                    className="w-full h-full border border-gray-200 rounded-lg overflow-hidden"
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
                    <Text className="text-gray-500 text-sm mb-3 text-center mt-4">
                        Additional images to showcase your organization (3 photos)
                    </Text>
                </View>
            ):(<></>)}


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
                    onPress={handleSubmit}
                >
                    <Text className="text-center text-white font-bold">Finish</Text>
                </TouchableOpacity>
            </View>



        </View>
    );
};

export default SignupUploads;



