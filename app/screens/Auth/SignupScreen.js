// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import useAxios from '../../hooks/useAxios';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profileImage: null,
    additionalImages: [],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const axios = useAxios();

  const handleImagePick = async (isProfile = true) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (isProfile) {
        setFormData({ ...formData, profileImage: result.assets[0].uri });
      } else {
        setFormData({
          ...formData,
          additionalImages: [...formData.additionalImages, result.assets[0].uri]
        });
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        role,
      };

      await axios.post('/api/auth/signup', payload);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
            <View className="space-y-4">
              <Text className="text-xl font-bold text-center mb-6">Join as</Text>

              <View className="flex-row justify-center space-x-4">
                <TouchableOpacity
                    className={`p-6 rounded-xl ${role === 'buyer' ? 'bg-[#00CCBB]' : 'bg-gray-100'}`}
                    onPress={() => setRole('buyer')}
                >
                  <Text className={`font-semibold ${role === 'buyer' ? 'text-white' : 'text-gray-600'}`}>
                    Individual Buyer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`p-6 rounded-xl ${role === 'org' ? 'bg-[#00CCBB]' : 'bg-gray-100'}`}
                    onPress={() => setRole('org')}
                >
                  <Text className={`font-semibold ${role === 'org' ? 'text-white' : 'text-gray-600'}`}>
                    Organization
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        );

      case 2:
        return (
            <View className="space-y-4">
              <TextInput
                  className="border border-gray-300 rounded-lg p-4"
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <TextInput
                  className="border border-gray-300 rounded-lg p-4"
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
              />

              <TextInput
                  className="border border-gray-300 rounded-lg p-4"
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
              />

              <TextInput
                  className="border border-gray-300 rounded-lg p-4"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
              />
            </View>
        );

      case 3:
        return (
            <View className="space-y-4">
              {role === 'org' && (
                  <TextInput
                      className="border border-gray-300 rounded-lg p-4"
                      placeholder="Organization Description"
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      multiline
                      numberOfLines={4}
                  />
              )}

              <TextInput
                  className="border border-gray-300 rounded-lg p-4"
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
              />

              <TouchableOpacity
                  className="border border-dashed border-gray-400 rounded-lg p-8 items-center"
                  onPress={() => handleImagePick(true)}
              >
                {formData.profileImage ? (
                    <Image
                        source={{ uri: formData.profileImage }}
                        className="w-24 h-24 rounded-full"
                    />
                ) : (
                    <Text className="text-gray-500">
                      Upload {role === 'org' ? 'Organization Logo' : 'Profile Photo'}
                    </Text>
                )}
              </TouchableOpacity>

              {role === 'org' && (
                  <View className="space-y-4">
                    <Text className="text-gray-600 mt-4">Additional Images (Max 4)</Text>
                    <View className="flex-row flex-wrap justify-between">
                      {[...Array(4)].map((_, index) => (
                          <TouchableOpacity
                              key={index}
                              className="w-[48%] h-24 mb-2 border border-dashed border-gray-400 rounded-lg items-center justify-center"
                              onPress={() => handleImagePick(false)}
                          >
                            {formData.additionalImages[index] ? (
                                <Image
                                    source={{ uri: formData.additionalImages[index] }}
                                    className="w-full h-full rounded-lg"
                                />
                            ) : (
                                <Text className="text-gray-500">+ Add Image</Text>
                            )}
                          </TouchableOpacity>
                      ))}
                    </View>
                  </View>
              )}
            </View>
        );
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-white px-6">
        <StatusBar style="dark" />

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View className="mb-8">
            <LinearGradient
                colors={['#00CCBB', '#00CCBB33']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-2 rounded-full"
            >
              <View
                  className="bg-white h-2 rounded-full absolute top-0"
                  style={{ width: `${(step/3)*100}%` }}
              />
            </LinearGradient>

            <Text className="text-center mt-2 text-gray-600">
              Step {step} of 3
            </Text>
          </View>

          {renderStepContent()}

          <View className="flex-row justify-between mt-8">
            {step > 1 && (
                <TouchableOpacity
                    className="bg-gray-200 px-6 py-3 rounded-lg"
                    onPress={() => setStep(step - 1)}
                >
                  <Text className="text-gray-700">Back</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                className={`${step < 3 ? 'bg-[#00CCBB]' : 'bg-green-600'} px-6 py-3 rounded-lg ml-auto`}
                onPress={step < 3 ? () => setStep(step + 1) : handleSubmit}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text className="text-white font-semibold">
                    {step < 3 ? 'Next' : 'Complete Signup'}
                  </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
              className="mt-6 self-center"
              onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-gray-600">
              Already have an account? <Text className="text-[#00CCBB] font-semibold">Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  );
};

export default SignupScreen;
