import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

export default function SellerProfile() {
    const axios = useAxios();
    const navigation = useNavigation();
    
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userRole');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Sample seller data
    const seller = {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        image: 'https://www.mealpro.net/wp-content/uploads/2022/11/5-Fine-Dining-Steak-Cuts.jpg',
        bio: 'Passionate home chef specializing in authentic Italian cuisine. Committed to sharing quality homemade meals.',
        joinedDate: 'March 2023',
        rating: '4.8',
        totalSales: '156',
        specialties: ['Italian Cuisine', 'Homemade Pasta', 'Vegetarian Options']
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            
            <View className="px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800">Seller Profile</Text>
            </View>
            
            <ScrollView className="flex-1 p-4">
                <View className="items-center mb-5">
                    <Image 
                        source={{ uri: seller.image }} 
                        className="w-24 h-24 rounded-full mb-2"
                    />
                    <Text className="text-2xl font-bold text-gray-800 mb-1">{seller.name}</Text>
                    <Text className="text-sm text-gray-500">Member since {seller.joinedDate}</Text>
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="text-sm ml-1">{seller.rating} • {seller.totalSales} Sales</Text>
                    </View>
                </View>
                
                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">About Me</Text>
                    <Text className="text-sm text-gray-600 leading-5">{seller.bio}</Text>
                </View>

                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Specialties</Text>
                    <View className="flex-row flex-wrap">
                        {seller.specialties.map((specialty, index) => (
                            <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-sm text-gray-600">{specialty}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Contact Information</Text>
                    
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">{seller.email}</Text>
                    </View>
                    
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">{seller.phone}</Text>
                    </View>
                    
                    <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">{seller.location}</Text>
                    </View>
                </View>
                
                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Account Settings</Text>
                    
                    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                        <Ionicons name="restaurant-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">Manage Menu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                        <Ionicons name="notifications-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">Notification Settings</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                        <Ionicons name="wallet-outline" size={20} color="#666" />
                        <Text className="text-sm text-gray-600 ml-2">Payment Settings</Text>
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