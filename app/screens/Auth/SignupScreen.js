// SignupScreen.js (Main File)
import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';import { StatusBar } from 'expo-status-bar';
import SignupRoleSelect from './SignupRoleSelect';
import SignupBasicInfo from './SignupBasicInfo';
// import SignupDetails from './SignupDetails';
import useAxios from '../../hooks/useAxios';
import EmailVerify from "./EmailVerify";
import PasswordSet from "./PasswordSet";
import SignupDetails from "./SignupDetails";

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({ /* ... */ });

  const  handleSubmit = async ()  => {

  }

  return (
      <SafeAreaView className="flex-1 bg-white px-6">
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {/* Progress Bar */}
          <ProgressBar step={step} />


          {step === 1 && (
              <SignupRoleSelect
                  role={role}
                  setRole={setRole}
                  nextStep={() => setStep(5)}
              />
          )}

            {step === 2 && (
                <EmailVerify
                    role={role}
                    setRole={setRole}
                    setFormData={setFormData}
                    formData={formData}
                    prevStep={() => setStep(1)}
                    nextStep={() => setStep(3)}
                />
            )}

          {step === 3 && (
              <SignupBasicInfo
                  role={role}
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={() => setStep(2)}
                  nextStep={() => setStep(4)}
              />
          )}

            {step === 4 && (
                <PasswordSet
                    role={role}
                    formData={formData}
                    setFormData={setFormData}
                    prevStep={() => setStep(3)}
                    nextStep={() => setStep(5)}
                />
            )}

          {step === 5 && (
              <SignupDetails
                  role={role}
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={() => setStep(4)}
                  handleSubmit={handleSubmit}
              />
          )}
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
