// SignupScreen.js (Main File)
import React, { useState } from 'react';
import {Text, View, SafeAreaView, ScrollView, ActivityIndicator, Alert, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SignupRoleSelect from './SignupRoleSelect';
import SignupBasicInfo from './SignupBasicInfo';
import EmailVerify from "./EmailVerify";
import PasswordSet from "./PasswordSet";
import SignupUploads from "./SignupUploads";
import useAxios from "../../hooks/useAxiosModified";
import {useNavigation} from "@react-navigation/native";

const SignupScreen = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({});
    const navigation = useNavigation();

    const request = useAxios();

    const handleSubmit = async (registrationData) => {
        const response= await request('post', '/auth/signup', registrationData)
            .then(response => {
                setTimeout(() => {
                    Alert.alert("Success", response?.data?.message || "Success");
                    navigation.navigate('Login');
                }, 2000);
            })
            .catch(err =>  Alert.alert("Error", err));


    };


    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <StatusBar style="dark" />


            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                {/* Progress Bar */}
                <ProgressBar step={step} />

                {step === 1 ? (
                    <SignupRoleSelect
                        role={role}
                        setRole={setRole}
                        nextStep={() => setStep(2)}
                    />
                ):<></>}

                {step === 2 ? (
                    <EmailVerify
                        role={role}
                        setRole={setRole}
                        setFormData={setFormData}
                        formData={formData}
                        prevStep={() => setStep(1)}
                        nextStep={() => setStep(3)}
                    />
                ):<></>}

                {step === 3 ? (
                    <SignupBasicInfo
                        role={role}
                        formData={formData}
                        setFormData={setFormData}
                        prevStep={() => setStep(2)}
                        nextStep={() => setStep(4)}
                    />
                ):<></>}

                {step === 4 ? (
                    <PasswordSet
                        role={role}
                        formData={formData}
                        setFormData={setFormData}
                        prevStep={() => setStep(3)}
                        nextStep={() => setStep(5)}
                    />
                ):<></>}

                {step === 5 ? (
                    <SignupUploads
                        role={role}
                        formData={formData}
                        setFormData={setFormData}
                        prevStep={() => setStep(4)}
                        handleSubmit={handleSubmit}
                    />
                ):<></>}

                {step===1?(
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-[#00CCBB] font-semibold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                ):<></>}
            </ScrollView>


        </SafeAreaView>
    );
};

const ProgressBar = ({ step }) => (
    <View className="mb-8">
        <View className="h-2 bg-gray-200 rounded-full">
            <View
                className="h-2 bg-[#00CCBB] rounded-full absolute top-0"
                style={{ width: `${(step/5)*100}%` }}
            />
        </View>
        <Text className="text-center mt-2 text-gray-600">Step {step} of 5</Text>
    </View>
);

export default SignupScreen;
