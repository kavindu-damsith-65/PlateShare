import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SellerDashboard() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            
            <View className="px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800">Seller Dashboard</Text>
            </View>
            
            <ScrollView className="flex-1 p-4">
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
                        <Text className="text-2xl font-bold text-[#00CCBB]">0</Text>
                        <Text className="text-xs text-gray-600 mt-1">Ratings</Text>
                    </View>
                </View>
                
                <View className="bg-white rounded-lg p-4 mb-5 shadow">
                    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                        <Ionicons name="restaurant-outline" size={24} color="#00CCBB" />
                        <Text className="text-base text-gray-800 ml-2">Add New Meal</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                        <Ionicons name="fast-food-outline" size={24} color="#00CCBB" />
                        <Text className="text-base text-gray-800 ml-2">Manage Menu</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="flex-row items-center py-3">
                        <Ionicons name="card-outline" size={24} color="#00CCBB" />
                        <Text className="text-base text-gray-800 ml-2">View Earnings</Text>
                    </TouchableOpacity>
                </View>
                
                <View className="bg-white rounded-lg p-4 mb-5 shadow">
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