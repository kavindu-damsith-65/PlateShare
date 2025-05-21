// SignupBasicInfo.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SignupBasicInfo = ({ formData, setFormData, prevStep, nextStep }) => (
    <View className="space-y-6">
        <Text className="text-2xl font-bold text-gray-800">Basic Information</Text>

        <TextInput
            className="border border-gray-200 bg-white rounded-lg p-4"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
            className="border border-gray-200 bg-white rounded-lg p-4"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
        />

        <TextInput
            className="border border-gray-200 bg-white rounded-lg p-4"
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
        />

        <View className="flex-row justify-between mt-8">
            <TouchableOpacity
                className="bg-gray-100 px-12 py-3 rounded-lg"
                onPress={prevStep}
            >
                <Text className="text-gray-700">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-[#00CCBB] px-12 py-3 rounded-lg"
                onPress={nextStep}
            >
                <Text className="text-white font-bold">Next</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default SignupBasicInfo;
