import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const SignupBasicInfo = ({ role = '', formData, setFormData, prevStep, nextStep }) => {
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        address: '',
        description: ''
    });

    const validateForm = () => {
        const newErrors = {
            name: '',
            phone: '',
            address: '',
            description: ''
        };

        let isValid = true;

        // Name validation
        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'Please enter a valid name (min 3 characters)';
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        // Address validation
        if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = 'Please enter a valid address';
            isValid = false;
        }

        // Organization description validation
        if (role === 'org' && (!formData.description || formData.description.trim().length < 20)) {
            newErrors.description = 'Description must be at least 20 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateForm()) {
            nextStep();
        }
    };

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Please enable location services');
            return;
        }

        try {
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
            // Clear address error if location was successfully fetched
            setErrors({...errors, address: ''});
        } catch (error) {
            Alert.alert('Error', 'Failed to get location. Please try again or enter manually.');
        }
    };

    return (
        <View className="space-y-4 p-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Basic Information</Text>

            {/* Full Name Field */}
            <View>
                <Text className="text-gray-600 mb-1">Full Name <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white rounded-lg p-3`}
                    placeholder="John Doe"
                    value={formData?.name || ''}
                    onChangeText={(text) => {
                        setFormData({ ...formData, name: text });
                        if (errors.name) setErrors({...errors, name: ''});
                    }}
                />
                {errors.name ? <Text className="text-red-500 text-sm mt-1">{errors.name}</Text> : <></>}
            </View>

            {/* Phone Number Field */}
            <View>
                <Text className="text-gray-600 mb-1">Phone Number <Text className="text-red-500">*</Text></Text>
                <TextInput
                    className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} bg-white rounded-lg p-3`}
                    placeholder="+1 234 567 890"
                    value={formData.phone || ''}
                    onChangeText={(text) => {
                        setFormData({ ...formData, phone: text });
                        if (errors.phone) setErrors({...errors, phone: ''});
                    }}
                    keyboardType="phone-pad"
                />
                {errors.phone ? <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text> : <></>}
            </View>

            {/* Address Section */}
            <View>
                <Text className="text-gray-600 mb-1">Address <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center space-x-2">
                    <TextInput
                        className={`flex-1 border ${errors.address ? 'border-red-500' : 'border-gray-300'} bg-white rounded-lg p-3`}
                        placeholder="Street, City"
                        value={formData.address || ''}
                        onChangeText={(text) => {
                            setFormData({ ...formData, address: text });
                            if (errors.address) setErrors({...errors, address: ''});
                        }}
                    />
                    <TouchableOpacity
                        className="p-3 bg-gray-100 rounded-lg"
                        onPress={handleGetLocation}
                    >
                        <Ionicons name="locate-outline" size={20} color="#00CCBB" />
                    </TouchableOpacity>
                </View>
                {errors.address ? <Text className="text-red-500 text-sm mt-1">{errors.address}</Text> : <></>}
            </View>

            {/* Organization Description (only for org role) */}
            {role === 'org' ? (
                <View>
                    <Text className="text-gray-600 mb-1">Description <Text className="text-red-500">*</Text></Text>
                    <TextInput
                        className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-white rounded-lg p-3 h-24`}
                        placeholder="Organization mission and activities"
                        value={formData?.description || ''}
                        onChangeText={(text) => {
                            setFormData({ ...formData, description: text });
                            if (errors.description) setErrors({...errors, description: ''});
                        }}
                        multiline
                    />
                    {errors.description ? <Text className="text-red-500 text-sm mt-1">{errors.description}</Text> : <></>}
                </View>
            ):<></>}


            <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                    className="bg-gray-100 px-6 py-3 rounded-lg flex-1 mr-2"
                    onPress={prevStep}
                >
                    <Text className="text-center text-gray-700">Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#00CCBB] px-6 py-3 rounded-lg flex-1 ml-2"
                    onPress={handleNext}
                >
                    <Text className="text-center text-white font-bold">Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignupBasicInfo;
