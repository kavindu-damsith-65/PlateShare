import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DeliveryProfile() {
  const navigation = useNavigation();
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Profile</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-5">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" }} 
            className="w-24 h-24 rounded-full mb-2"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">John Delivery</Text>
          <View className="flex-row items-center">
            <Ionicons name="bicycle-outline" size={16} color="#666" />
            <Text className="text-sm text-gray-500 ml-1">Delivery Partner</Text>
          </View>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Account</Text>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="person-outline" size={20} color="#00CCBB" className="mr-2" />
            <Text className="text-base text-gray-800 ml-2">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="notifications-outline" size={20} color="#00CCBB" className="mr-2" />
            <Text className="text-base text-gray-800 ml-2">Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="settings-outline" size={20} color="#00CCBB" className="mr-2" />
            <Text className="text-base text-gray-800 ml-2">Settings</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          className="bg-red-500 rounded-lg p-4 items-center mb-8"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}