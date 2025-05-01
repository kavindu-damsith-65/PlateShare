import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function OrganizationHistory() {
  // Sample data for history
  const history = [
    { id: '1', name: 'Food Bank #1', items: 'Bread, Vegetables', status: 'completed', date: 'May 15, 2023' },
    { id: '2', name: 'Shelter #42', items: 'Canned goods, Fruits', status: 'completed', date: 'May 10, 2023' },
    { id: '3', name: 'Community Center', items: 'Rice, Pasta', status: 'cancelled', date: 'May 5, 2023' },
    { id: '4', name: 'Local Charity', items: 'Dairy products', status: 'completed', date: 'April 28, 2023' },
    { id: '5', name: 'School Program', items: 'Snacks, Juice', status: 'completed', date: 'April 20, 2023' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 shadow">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">{item.name}</Text>
        <View className={`px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-xs font-medium ${item.status === 'completed' ? 'text-green-800' : 'text-red-800'}`}>
            {item.status === 'completed' ? 'Completed' : 'Cancelled'}
          </Text>
        </View>
      </View>
      
      <Text className="text-sm text-gray-600 mb-2">{item.items}</Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">{item.date}</Text>
        
        <TouchableOpacity className="px-3 py-1.5 rounded bg-gray-100">
          <Text className="text-xs text-gray-600 font-medium">View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Donation History</Text>
      </View>
      
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerClassName="p-4"
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="time-outline" size={50} color="#DDD" />
          <Text className="mt-2 text-base text-gray-500">No donation history</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
