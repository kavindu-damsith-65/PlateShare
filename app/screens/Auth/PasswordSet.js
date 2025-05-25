import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const PasswordSet = ({ role = '', formData, setFormData, prevStep, nextStep }) => {


    return (
        <View className="space-y-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Secure Your Account</Text>


            {/*Password Fields */}
            <View>
                <Text className="text-gray-600 mb-1">Password <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 bg-white rounded-lg p-3"
                    placeholder="••••••••"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                />
            </View>

            <View>
                <Text className="text-gray-600 mb-1">Confirm Password <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 bg-white rounded-lg p-3"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    secureTextEntry
                />
            </View>

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

export default PasswordSet;
