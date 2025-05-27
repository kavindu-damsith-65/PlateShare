import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAxiosModified from "../../hooks/useAxiosModified";
import {useNavigation} from "@react-navigation/native";

const NewPasswordSet = ({ formData, setFormData, prevStep }) => {
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const request = useAxiosModified();
    const navigation = useNavigation();


    const validatePassword = () => {
        const newErrors = {
            password: '',
            confirmPassword: ''
        };
        let isValid = true;

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Must include uppercase, lowercase, number, and special character';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const resetPassword = async  () => {
        if (validatePassword()) {
            const token=await AsyncStorage.getItem('verifyToken');

            const response= await  request('post', '/auth/reset-password',   formData,token)
                .then(async  data => {
                    await AsyncStorage.removeItem('verifyToken');
                    Alert.alert("Success", data?.data?.message || "Success");
                    navigation.navigate('Login');
                })
                .catch(err => Alert.alert("Failed", "Error Occurred, Please Try Again!"+err));
        }
    };

    return (
        <View className="space-y-4 p-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Enter New Password</Text>

            {/* Password Requirements */}
            <View className="bg-blue-50 p-3 rounded-lg mb-4">
                <Text className="font-semibold text-blue-800 mb-1">Password Requirements:</Text>
                <View className="space-y-1">
                    <Text className={`text-sm ${formData.password?.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                        • At least 8 characters long
                    </Text>
                    <Text className={`text-sm ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                        • At least one uppercase letter
                    </Text>
                    <Text className={`text-sm ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                        • At least one lowercase letter
                    </Text>
                    <Text className={`text-sm ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                        • At least one number
                    </Text>
                    <Text className={`text-sm ${/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                        • At least one special character (@$!%*?&)
                    </Text>
                </View>
            </View>

            {/* Password Field */}
            <View>
                <Text className="text-gray-600 mb-1">New Password <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center border border-gray-300 bg-white rounded-lg pr-3">
                    <TextInput
                        className="flex-1 p-3"
                        placeholder=""
                        value={formData.password || ''}
                        onChangeText={(text) => {
                            setFormData({ ...formData, password: text });
                            if (errors.password) setErrors({...errors, password: ''});
                        }}
                        secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons
                            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#00CCBB"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                ) : null}
            </View>

            {/* Confirm Password Field */}
            <View>
                <Text className="text-gray-600 mb-1">Confirm Password <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center border border-gray-300 bg-white rounded-lg pr-3">
                    <TextInput
                        className="flex-1 p-3"
                        placeholder=""
                        value={formData.confirmPassword || ''}
                        onChangeText={(text) => {
                            setFormData({ ...formData, confirmPassword: text });
                            if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                        }}
                        secureTextEntry={!confirmPasswordVisible}
                    />
                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                        <Ionicons
                            name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#00CCBB"
                        />
                    </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                ) : null}
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
                    onPress={resetPassword}
                >
                    <Text className="text-center text-white font-bold">Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NewPasswordSet;
