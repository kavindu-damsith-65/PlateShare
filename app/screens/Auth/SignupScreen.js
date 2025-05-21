// SignupScreen.js (Main File)
import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';import { StatusBar } from 'expo-status-bar';
import SignupRoleSelect from './SignupRoleSelect';
import SignupBasicInfo from './SignupBasicInfo';
// import SignupDetails from './SignupDetails';
import useAxios from '../../hooks/useAxios';

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({ /* ... */ });

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
                  nextStep={() => setStep(2)}
              />
          )}

          {step === 2 && (
              <SignupBasicInfo
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={() => setStep(1)}
                  nextStep={() => setStep(3)}
              />
          )}

          {/*{step === 3 && (*/}
          {/*    <SignupDetails*/}
          {/*        role={role}*/}
          {/*        formData={formData}*/}
          {/*        setFormData={setFormData}*/}
          {/*        prevStep={() => setStep(2)}*/}
          {/*        handleSubmit={handleSubmit}*/}
          {/*    />*/}
          {/*)}*/}
        </ScrollView>
      </SafeAreaView>
  );
};

const ProgressBar = ({ step }) => (
    <View className="mb-8">
      <View className="h-2 bg-gray-200 rounded-full">
        <View
            className="h-2 bg-[#00CCBB] rounded-full absolute top-0"
            style={{ width: `${(step/3)*100}%` }}
        />
      </View>
      <Text className="text-center mt-2 text-gray-600">Step {step} of 3</Text>
    </View>
);

export default SignupScreen;
