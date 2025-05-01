import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function OrganizationRequests() {
  // Sample data for requests
  const requests = [
    { id: '1', name: 'Food Bank #1', items: 'Bread, Vegetables', status: 'pending', time: '2 hours ago' },
    { id: '2', name: 'Shelter #42', items: 'Canned goods, Fruits', status: 'pending', time: '3 hours ago' },
    { id: '3', name: 'Community Center', items: 'Rice, Pasta', status: 'pending', time: '5 hours ago' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 shadow">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">{item.name}</Text>
        <View className="bg-yellow-100 px-2 py-1 rounded-full">
          <Text className="text-xs text-yellow-800 font-medium">Pending</Text>
        </View>
      </View>
      
      <Text className="text-sm text-gray-600 mb-2">{item.items}</Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">{item.time}</Text>
        
        <View className="flex-row">
          <TouchableOpacity className="bg-[#00CCBB] px-3 py-1.5 rounded mr-2">
            <Text className="text-xs text-white font-medium">Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-[#FF6B6B] px-3 py-1.5 rounded">
            <Text className="text-xs text-white font-medium">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Donation Requests</Text>
      </View>
      
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="notifications-off-outline" size={50} color="#DDD" />
          <Text className="mt-2 text-base text-gray-500">No pending requests</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
