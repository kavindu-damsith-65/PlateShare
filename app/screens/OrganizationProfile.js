import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function OrganizationProfile() {
  const navigation = useNavigation();
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Sample organization data
  const organization = {
    name: 'Green Plate Restaurant',
    email: 'contact@greenplate.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    description: 'A sustainable restaurant focused on reducing food waste and helping the community.',
    joinedDate: 'January 2023',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Organization Profile</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-5">
          <Image 
            source={{ uri: organization.image }} 
            className="w-24 h-24 rounded-full mb-2"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">{organization.name}</Text>
          <Text className="text-sm text-gray-500">Member since {organization.joinedDate}</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">About</Text>
          <Text className="text-sm text-gray-600 leading-5">{organization.description}</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Contact Information</Text>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{organization.email}</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{organization.phone}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{organization.address}</Text>
          </View>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Settings</Text>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Notification Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Privacy Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="pencil-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          className="flex-row justify-center items-center bg-[#FF6B6B] rounded-lg p-4 mb-8"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text className="text-white text-base font-bold ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


