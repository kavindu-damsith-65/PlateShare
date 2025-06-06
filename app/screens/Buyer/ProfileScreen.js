import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

// TODO: Replace with actual buyer ID from authentication
const uid = "user_1"; // Buyer user ID

export default function ProfileScreen() {
  const navigation = useNavigation();
  const axios = useAxios();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBuyerData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/user/buyer/${uid}`);
        setBuyer(response.data.buyer);
      } catch (error) {
        console.error('Failed to fetch buyer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-5">
        <StatusBar style="dark" />

        <View className="px-5 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">My Profile</Text>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Profile header skeleton */}
          <View className="items-center mb-5">
            <View className="w-24 h-24 rounded-full bg-gray-200 mb-2" />
            <View className="h-7 bg-gray-200 rounded w-40 mb-2" />
            <View className="flex-row items-center">
              <View className="h-4 bg-gray-200 rounded w-32" />
            </View>
          </View>

          {/* Account Information skeleton */}
          <View className="bg-white rounded-lg p-4 mb-5 shadow">
            <View className="h-6 bg-gray-200 rounded w-48 mb-3" />

            <View className="flex-row items-center mb-3">
              <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
              <View className="h-4 bg-gray-200 rounded w-3/4" />
            </View>

            <View className="flex-row items-center mb-3">
              <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
              <View className="h-4 bg-gray-200 rounded w-1/2" />
            </View>

            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
              <View className="h-4 bg-gray-200 rounded w-2/3" />
            </View>
          </View>

          {/* Order History skeleton */}
          <View className="bg-white rounded-lg p-4 mb-5 shadow">
            <View className="h-6 bg-gray-200 rounded w-36 mb-3" />

            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                <View className="h-4 bg-gray-200 rounded w-28" />
              </View>
              <View className="w-4 h-4 rounded-full bg-gray-200" />
            </View>

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                <View className="h-4 bg-gray-200 rounded w-40" />
              </View>
              <View className="w-4 h-4 rounded-full bg-gray-200" />
            </View>
          </View>

          {/* Settings skeleton */}
          <View className="bg-white rounded-lg p-4 mb-5 shadow">
            <View className="h-6 bg-gray-200 rounded w-24 mb-3" />

            {[1, 2, 3, 4].map((_, index) => (
              <View key={`setting-${index}`} className={`flex-row items-center justify-between py-3 ${index < 3 ? 'border-b border-gray-100' : ''}`}>
                <View className="flex-row items-center">
                  <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                  <View className="h-4 bg-gray-200 rounded w-48" />
                </View>
                <View className="w-4 h-4 rounded-full bg-gray-200" />
              </View>
            ))}
          </View>

          {/* Logout button skeleton */}
          <View className="rounded-lg p-4 mb-8 bg-gray-200 h-12" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!buyer) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500">Failed to load profile data.</Text>
        <TouchableOpacity 
          className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-lg"
          onPress={handleClose}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800">My Profile</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-5">
          <Image 
            source={{ uri: buyer.user.profile_picture || "https://picsum.photos/200" }} 
            className="w-24 h-24 rounded-full mb-2"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-1">{buyer.user.name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="text-sm text-gray-500 ml-1">{buyer.location || "No location set"}</Text>
          </View>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Account Information</Text>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{buyer.email}</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{buyer.phone || "No phone number"}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text className="text-sm text-gray-600 ml-2">{buyer.address || "No address set"}</Text>
          </View>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Order History</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="receipt-outline" size={20} color="#00CCBB" />
              <Text className="text-sm text-gray-600 ml-2">Recent Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#00CCBB" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={20} color="#00CCBB" />
              <Text className="text-sm text-gray-600 ml-2">Favorite Restaurants</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#00CCBB" />
          </TouchableOpacity>
        </View>
        
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={20} color="#666" />
              <Text className="text-sm text-gray-600 ml-2">Notification Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text className="text-sm text-gray-600 ml-2">Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text className="text-sm text-gray-600 ml-2">Delivery Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="pencil-outline" size={20} color="#666" />
              <Text className="text-sm text-gray-600 ml-2">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
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
