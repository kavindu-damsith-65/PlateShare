import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const handleLogin = async (role) => {
    try {
      console.log("Setting user role to:", role);
      await AsyncStorage.setItem('userRole', role);
      navigation.replace(role === 'buyer' ? 'Main' : 'OrganizationDashboard');
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center p-5">
      <StatusBar style="dark" />
      
      <Animatable.View animation="fadeIn" duration={1000} className="items-center mb-16">
        {/* Uncomment when you have the logo */}
        {/* <Image 
          source={require('../assets/logo.png')} 
          className="w-30 h-30 mb-5"
          resizeMode="contain"
        /> */}
        <Text className="text-3xl font-bold text-[#00CCBB] mb-2">FoodShare</Text>
        <Text className="text-base text-gray-600 text-center">Reducing waste, feeding communities</Text>
      </Animatable.View>
      
      <Animatable.View animation="fadeInUp" duration={1000} className="w-full">
        <TouchableOpacity 
          className="py-4 rounded-lg bg-[#00CCBB] items-center mb-4"
          onPress={() => handleLogin('buyer')}
        >
          <Text className="text-white text-lg font-bold">Continue as Buyer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="py-4 rounded-lg bg-[#FF8C00] items-center mb-4"
          onPress={() => handleLogin('org')}
        >
          <Text className="text-white text-lg font-bold">Continue as Organization</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
