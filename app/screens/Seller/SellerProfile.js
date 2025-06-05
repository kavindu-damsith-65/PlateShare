import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

const uid = "user_2";

export default function SellerProfile() {
    const axios = useAxios();
    const navigation = useNavigation();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userRole');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const fetchSeller = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/user/seller/${uid}`);
                setSeller(response.data.seller);
            } catch (error) {
                console.error('Failed to fetch seller profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 pt-5">
                <StatusBar style="dark" />

                <View className="px-5 py-4 bg-white border-b border-gray-200">
                    <Text className="text-xl font-bold text-gray-800">Seller Profile</Text>
                </View>

                <ScrollView className="flex-1 p-4">
                    {/* Profile header skeleton */}
                    <View className="items-center mb-5">
                        <View className="w-24 h-24 rounded-full bg-gray-200 mb-2" />
                        <View className="h-7 bg-gray-200 rounded w-48 mb-2" />
                        <View className="h-4 bg-gray-200 rounded w-36" />
                    </View>

                    {/* Restaurant Information skeleton */}
                    <View className="bg-white rounded-lg p-4 mb-5 shadow">
                        <View className="h-6 bg-gray-200 rounded w-48 mb-3" />

                        <View className="flex-row items-start px-4">
                            <View className="flex-1 pr-4">
                                <View className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <View className="h-4 bg-gray-200 rounded w-full mb-1" />
                                <View className="h-4 bg-gray-200 rounded w-2/3" />
                            </View>

                            {/* Restaurant image skeleton */}
                            <View className="w-24 h-24 bg-gray-200 rounded-lg" />
                        </View>
                    </View>

                    {/* Contact Information skeleton */}
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

                    {/* Account Settings skeleton */}
                    <View className="bg-white rounded-lg p-4 mb-5 shadow">
                        <View className="h-6 bg-gray-200 rounded w-40 mb-3" />

                        {[1, 2, 3, 4].map((_, index) => (
                            <View
                                key={`setting-${index}`}
                                className={`flex-row items-center py-3 ${index < 3 ? 'border-b border-gray-100' : ''}`}
                            >
                                <View className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                                <View className="h-4 bg-gray-200 rounded w-48" />
                            </View>
                        ))}
                    </View>

                    {/* Logout button skeleton */}
                    <View className="flex-row justify-center items-center bg-gray-200 rounded-lg p-4 mb-8 h-12" />
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (!seller) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">Failed to load seller data.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            
            <View className="px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800">Seller Profile</Text>
            </View>
            
            <ScrollView className="flex-1 p-4">
                <View className="items-center mb-5">
                    <Image 
                        source={{ uri: seller.user.profile_picture }} 
                        className="w-24 h-24 rounded-full mb-2"
                    />
                    <Text className="text-2xl font-bold text-gray-800 mb-1">{seller.user.name}</Text>
                    <Text className="text-sm text-gray-500">Member since {new Date(seller.createdAt).toISOString().split('T')[0]}</Text>
                    {/* <View className="flex-row items-center mt-2">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="text-sm ml-1">{seller.rating} • {seller.totalSales} Sales</Text>
                    </View> */}
                </View>
                
                {/* <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">About Me</Text>
                    <Text className="text-sm text-gray-600 leading-5">{seller.bio}</Text>
                </View> */}

                {/* <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Specialties</Text>
                    <View className="flex-row flex-wrap">
                        {seller.specialties.map((specialty, index) => (
                            <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-sm text-gray-600">{specialty}</Text>
                            </View>
                        ))}
                    </View>
                </View> */}

                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <Text className="text-lg font-bold mb-3 text-gray-800"> Restaurant Information </Text>

                    <View className="flex-row items-start px-4">
                        <View className="flex-1 pr-4">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {seller.restaurant.name}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                            {seller.restaurant.description || "No description available."}
                        </Text>
                        </View>

                        {/* Image */}
                        {seller.restaurant.image ? (
                        <Image
                            source={{ uri: seller.restaurant.image }}
                            className="w-24 h-24 rounded-lg"
                            resizeMode="cover"
                        />
                        ) : (
                        <View className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center">
                            <Text className="text-xs text-gray-500">No Image</Text>
                        </View>
                        )}
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
                        <Text className="text-sm text-gray-600 ml-2">{seller.address}</Text>
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