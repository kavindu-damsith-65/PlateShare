import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function DeliveryOrders() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">My Deliveries</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg p-4 shadow items-center justify-center py-20">
          <Text className="text-lg text-gray-400">Your active deliveries will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}