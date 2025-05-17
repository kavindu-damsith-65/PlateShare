import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

// TODO: Replace with actual organization ID from authentication
const uid = "user_3"; // Organization user ID

export default function OrganizationProfile() {
  const navigation = useNavigation();
  const axios = useAxios();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [additionalImages, setAdditionalImages] = useState([]);
  
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const response = await axios.get(`/api/user/organization/${uid}`);
        setOrganization(response.data.organization);
        
        // Parse additional images if they exist
        if (response.data.organization.additional_images) {
          try {
            const images = JSON.parse(response.data.organization.additional_images);
            setAdditionalImages(Array.isArray(images) ? images : []);
          } catch (e) {
            console.error('Error parsing additional images:', e);
            setAdditionalImages([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text className="text-gray-500 mt-2">Loading organization profile...</Text>
      </SafeAreaView>
    );
  }

  if (!organization) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500">Failed to load organization data.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Organization Profile</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-5">
          <Image 
            source={{ uri: organization.user.profile_picture }} 
            className="w-24 h-24 rounded-full mb-2"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">{organization.user.name}</Text>
          <Text className="text-sm text-gray-500">Member since {new Date().getFullYear()}</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">About</Text>
          <Text className="text-sm text-gray-600 leading-5">{organization.description}</Text>
        </View>

        {additionalImages.length > 0 && (
          <View className="bg-white rounded-lg p-4 mb-5 shadow">
            <Text className="text-lg font-bold mb-3 text-gray-800">Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {additionalImages.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  className="w-32 h-24 rounded-lg mr-2"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
        
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


