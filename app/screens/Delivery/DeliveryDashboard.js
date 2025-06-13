import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function DeliveryDashboard() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Delivery Dashboard</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="mb-5">
          <Text className="text-2xl font-semibold text-gray-800">Welcome, Delivery Partner 👋</Text>
          <Text className="text-sm text-gray-500 mt-1">Here are your available delivery opportunities</Text>
        </View>
        
        {/* Content will be added here */}
        <View className="bg-white rounded-lg p-4 shadow items-center justify-center py-20">
          <Text className="text-lg text-gray-400">Available deliveries will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}