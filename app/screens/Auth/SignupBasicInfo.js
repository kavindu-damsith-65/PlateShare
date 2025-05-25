import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const SignupBasicInfo = ({ role = '', formData, setFormData, prevStep, nextStep }) => {
    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Please enable location services');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(location.coords);
        setFormData({
            ...formData,
            address: `${address[0]?.street || ''}, ${address[0]?.city || ''}`,
            location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        });
    };



    return (
        <View className="space-y-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Basic Information</Text>

            <View>
                <Text className="text-gray-600 mb-1">Full Name <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 bg-white rounded-lg p-3"
                    placeholder="John Doe"
                    value={formData?.name || ''}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
            </View>



            <View>
                <Text className="text-gray-600 mb-1">Phone Number <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 bg-white rounded-lg p-3"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Address Section */}
            <View>
                <Text className="text-gray-600 mb-1">Address <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center space-x-2">
                    <TextInput
                        className="flex-1 border border-gray-300 bg-white rounded-lg p-3"
                        placeholder="Street, City"
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                    />
                    <TouchableOpacity
                        className="p-3 bg-gray-100 rounded-lg"
                        onPress={handleGetLocation}
                    >
                        <Ionicons name="locate-outline" size={20} color="#00CCBB" />
                    </TouchableOpacity>
                </View>
            </View>


            {role === 'org' ? (
                <View>
                    <Text className="text-gray-600 mb-1">Description <Text className="text-red-500">*</Text></Text>
                    <TextInput
                        className="border border-gray-300 bg-white rounded-lg p-3 h-24"
                        placeholder="Organization mission and activities"
                        value={formData?.description || ''}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline
                    />
                </View>
            ):(
                <>
                </>
            )

            }



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
                    onPress={nextStep}
                >
                    <Text className="text-center text-white font-bold">Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignupBasicInfo;
