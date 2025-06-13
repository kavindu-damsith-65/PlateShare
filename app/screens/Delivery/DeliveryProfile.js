import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DeliveryProfile() {
  const navigation = useNavigation();
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Hardcoded volunteer profile data
  const [volunteer, setVolunteer] = useState({
    name: "I am John",
    email: "john.delivery@example.com",
    phone: "+91 91234 56789",
    profilePicture: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    joinDate: "2023-01-15",
    deliveriesCompleted: 47,
    totalHoursVolunteered: 38,
    preferredAreas: ["Downtown", "Westside", "University District"]
  });
  
  // Toggle availability status
  const toggleAvailability = (value) => {
    setLoading(true);
    
    // Simulate API call to update availability status
    setTimeout(() => {
      setIsAvailable(value);
      setLoading(false);
      
      // Show confirmation message
      Alert.alert(
        "Status Updated",
        value 
          ? "You are now available for deliveries" 
          : "You are now marked as unavailable for deliveries",
        [{ text: "OK" }]
      );
    }, 500);
  };
  
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
        {/* Profile Header */}
        <View className="items-center mb-5">
          <Image 
            source={{ uri: volunteer.profilePicture }} 
            className="w-24 h-24 rounded-full mb-2"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">{volunteer.name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="bicycle-outline" size={16} color="#666" />
            <Text className="text-sm text-gray-500 ml-1">Delivery Volunteer</Text>
          </View>
        </View>
        
        {/* Availability Toggle */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Availability</Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons 
                name={isAvailable ? "checkmark-circle-outline" : "close-circle-outline"} 
                size={24} 
                color={isAvailable ? "#00CCBB" : "#FF6B6B"} 
              />
              <Text className="text-base text-gray-800 ml-2">Available for Delivery</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: "#E5E5EA", true: "#AEDFD9" }}
              thumbColor={isAvailable ? "#00CCBB" : "#F4F3F4"}
              disabled={loading}
            />
          </View>
          
          <Text className="text-sm text-gray-500 mt-2 ml-8">
            {isAvailable 
              ? "You will receive delivery requests" 
              : "You won't receive any delivery requests"}
          </Text>
        </View>
        
        {/* Contact Information */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Contact Information</Text>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{volunteer.email}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{volunteer.phone}</Text>
          </View>
        </View>
        
        {/* Volunteer Stats */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Your Impact</Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#00CCBB]">{volunteer.deliveriesCompleted}</Text>
              <Text className="text-xs text-gray-500">Deliveries</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#00CCBB]">{volunteer.totalHoursVolunteered}</Text>
              <Text className="text-xs text-gray-500">Hours</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#00CCBB]">{volunteer.preferredAreas.length}</Text>
              <Text className="text-xs text-gray-500">Areas</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text className="text-xs text-gray-500 ml-1">
              Volunteer since {new Date(volunteer.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>
        
        {/* Account Settings */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Account Settings</Text>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Notification Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="map-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Preferred Delivery Areas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">Privacy Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
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