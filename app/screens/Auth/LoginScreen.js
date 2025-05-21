import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAxios from '../../hooks/useAxios';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const axios = useAxios();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userRole', response.data.role);

      navigation.replace(response.data.role === 'seller' ? 'SellerTabs' :
          response.data.role === 'org' ? 'OrgDashboard' : 'BuyerDashboard');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-white px-6">
        <StatusBar style="dark" />

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View className="items-center mb-12">
            <Image
                source={require('../../assets/logo.png')}
                className="w-32 h-32 mb-4"
            />
            <Text className="text-3xl font-bold text-[#00CCBB]">PlateShare</Text>
            <Text className="text-gray-600 mt-2 text-center">Reduce Waste, Feed Communities...</Text>
          </View>

          {error ? (
              <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}

          <View className="space-y-4">
            <TextInput
                className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                className="self-end mb-2"
                onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text className="text-[#00CCBB] text-sm font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className={`bg-[#00CCBB] p-4 rounded-lg items-center ${loading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>



          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-[#00CCBB] font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}
