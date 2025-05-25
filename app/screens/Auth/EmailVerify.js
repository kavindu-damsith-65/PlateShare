import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';

const EmailVerify = ({ formData, setFormData, prevStep, nextStep }) => {
    const [email, setEmail] = useState(formData.email || '');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');

    // Mock function to simulate API call to send verification code
    const sendVerificationCode = async () => {

        try {
            setIsCodeSent(false);
            setError('');

            // Validate email format
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Please enter a valid email address');
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, you would call your backend here:
            // const response = await api.sendVerificationCode(email);

            setIsCodeSent(true);
            setCountdown(120);
            setFormData({ ...formData, email });
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
            console.error(err);
        }
    };

    // Mock function to verify code
    const verifyCode = async () => {
        try {
            if (!verificationCode || verificationCode.length !== 6) {
                setError('Please enter a 6-digit verification code');
                return;
            }

            setIsVerifying(true);
            setError('');

            // Simulate API verification
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app:
            // const response = await api.verifyCode(email, verificationCode);
            // if (!response.valid) throw new Error('Invalid code');
            nextStep();
        } catch (err) {
            setError('Invalid verification code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        setError('');
        await sendVerificationCode();
        setIsResending(false);
    };

    // Countdown timer effect
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <View className="space-y-4 p-4">
            <View className="items-center pb-5">
                <Text className="text-2xl font-bold text-gray-800 mb-2">Verify It Is You</Text>

            </View>

            {!isCodeSent ? (
                <>
                    <View>
                        <Text className="text-gray-600">Email Address <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="border border-gray-300 bg-white rounded-lg p-3 mb-1"
                            placeholder="abc@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {error ? (
                        <Text className="text-red-500 text-left mb-2">{error}</Text>
                    ) : <></>
                    }
                    <TouchableOpacity
                        className="bg-[#00CCBB] px-6 py-3 rounded-lg mt-6"
                        onPress={sendVerificationCode}
                        // disabled={!email}
                    >
                        <Text className="text-center text-white font-bold">
                            Send Verification Code
                        </Text>
                    </TouchableOpacity>


                </>
            ) : (
                <>
                    <Text className="text-gray-600 text-center">
                        We've sent a 6-digit verification code to {email}
                    </Text>

                    <View className="mt-6">
                        <Text className="text-gray-600 mb-3">Verification Code <Text className="text-red-500">*</Text></Text>

                        <OTPTextInput
                            handleTextChange={setVerificationCode}
                            inputCount={6}
                            keyboardType="numeric"
                            tintColor="#00CCBB"
                            offTintColor="#DDD"
                        />
                    </View>

                    {error ? (
                        <Text className="text-red-500 text-left mb-2">{error}</Text>
                    ) : <></>
                    }

                    <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={countdown > 0 || isResending}
                        className="items-end mt-3 mb-5"
                    >
                        {isResending ? (
                            <ActivityIndicator color="#00CCBB" />
                        ) : (
                            <Text className="text-[#00CCBB]">
                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-[#00CCBB] px-6 py-3 rounded-lg items-center"
                        onPress={verifyCode}
                        disabled={isVerifying || !verificationCode}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-bold">
                                Verify Code
                            </Text>
                        )}
                    </TouchableOpacity>


                </>
            )}



            <TouchableOpacity
                className="bg-gray-100 px-6 py-3 rounded-lg mt-4"
                onPress={prevStep}
            >
                <Text className="text-center text-gray-700">Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmailVerify;
