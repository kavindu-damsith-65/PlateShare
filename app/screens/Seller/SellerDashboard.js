import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useAxios from '../../hooks/useAxios';

const uid = "user_2";

export default function SellerDashboard() {
    const axios = useAxios();
    const navigation = useNavigation();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState("?");

    useEffect(() => {
        const fetchSeller = async () => {
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

    useEffect(() => {
        const fetchRating = async () => {
            try {
                console.log(seller.restaurant.id);
                const response = await axios.get(`/api/reviews/restaurants/average-rating/${seller.restaurant.id}`);
                setRating(response.data.averageRating);
            } catch (error) {
                console.error('Failed to fetch average rating:', error);
                setRating("?");
            }
        };

        fetchRating();
    }, [seller]);


    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="text-gray-500 mt-2">Loading seller dashboard...</Text>
            </SafeAreaView>
        );
    }

    if (!seller) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">Failed to load seller details.</Text>
            </SafeAreaView>
        );
    }

    const handleAddFood = () => {
        navigation.navigate('AddFood');
    };

    const handleViewRestaurant = () => {
        navigation.navigate('Restaurant');
    };

    const handleViewOrders = () => {
        navigation.navigate('Orders');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            <ScrollView className="flex-1 p-5">
                {/* Header */}
                <Text className="text-2xl font-bold text-gray-800 mb-8">Seller Dashboard</Text>

                {/*statical cards */}
                <View className="flex-row justify-between mb-5">
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow">
                        <Text className="text-2xl font-bold text-[#00CCBB]">0</Text>
                        <Text className="text-xs text-gray-600 mt-1">Active Meals</Text>
                    </View>
                    
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow">
                        <Text className="text-2xl font-bold text-[#00CCBB]">$0</Text>
                        <Text className="text-xs text-gray-600 mt-1">Total Sales</Text>
                    </View>
                    
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow">
                        <Text className="text-2xl font-bold text-[#00CCBB]">{rating}</Text>
                        <Text className="text-xs text-gray-600 mt-1">Ratings</Text>
                    </View>
                </View>

            {/* Restaurant Info Card */}
            <View className="bg-white rounded-lg p-4 mb-5 shadow rounded-2xl">
                <View className="flex-row items-start">
                    <View className="flex-1 pr-4">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {seller.restaurant.name.replace(/\b\w/g, c => c.toUpperCase())}
                        </Text>
                        <Text className="text-sm text-gray-500 mb-2">
                            Serving spicy goodness since {new Date(seller.createdAt).getFullYear()}.
                        </Text>
                        <TouchableOpacity onPress={handleViewRestaurant} className="mt-3">
                            <Text className="text-sm font-semibold text-gray-700">View Restaurant</Text>
                        </TouchableOpacity>
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

            {/* Manage Menu */}
            <View className="bg-white p-4 rounded-2xl shadow mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">Manage Menu</Text>

            <TouchableOpacity
                onPress={handleAddFood}
                className="flex-row items-center justify-between p-3 bg-green-100 rounded-lg mb-3"
            >
                <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={22} color="#10B981" />
                <Text className="ml-2 text-green-700 font-medium">Add New Food</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#10B981" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-yellow-100 rounded-lg">
                <View className="flex-row items-center">
                <Ionicons name="create-outline" size={22} color="#CA8A04" />
                <Text className="ml-2 text-yellow-800 font-medium">Update Existing Foods</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CA8A04" />
            </TouchableOpacity>
            </View>
            
            {/* Orders & Analytics */}
            <View className="bg-white p-4 rounded-2xl shadow mb-5">
                <Text className="text-lg font-bold text-gray-800 mb-3">Orders & Analytics</Text>

                <TouchableOpacity
                    onPress={handleViewOrders}
                    className="flex-row items-center justify-between p-3 bg-indigo-100 rounded-lg mb-3"
                >
                    <View className="flex-row items-center">
                    <Ionicons name="receipt-outline" size={22} color="#6366F1" />
                    <Text className="ml-2 text-indigo-700 font-medium">View Orders</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#6366F1" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center justify-between p-3 bg-pink-100 rounded-lg">
                    <View className="flex-row items-center">
                    <Ionicons name="bar-chart-outline" size={22} color="#EC4899" />
                    <Text className="ml-2 text-pink-700 font-medium">Sales Analytics</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#EC4899" />
                </TouchableOpacity>
            </View>

            {/* Recent orders bloc */}
            <View className="bg-white p-4 rounded-2xl shadow mb-10">
                <Text className="text-lg font-bold mb-3 text-gray-800">Recent Orders</Text>
                <View className="items-center justify-center py-8">
                    <Ionicons name="receipt-outline" size={50} color="#DDD" />
                    <Text className="mt-2 text-base text-gray-500">No orders yet</Text>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}