import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

export default function DeliveryOrders() {
  const navigation = useNavigation();
  // State to track if there's an active delivery
  const [activeDelivery, setActiveDelivery] = useState({
    id: 'del_123',
    restaurant: {
      name: 'Green Bowl Café',
      address: '123 Healthy St, Downtown',
      phone: '+1234567890'
    },
    destination: {
      name: 'Hope Elders Home',
      address: '456 Care Ave, Uptown',
      phone: '+1987654321'
    },
    items: '10 rice bowls, 5 curries, 8 drinks',
    status: 'accepted', // can be 'accepted' or 'picked_up'
    createdAt: '2023-06-15T10:30:00Z'
  });

  // Function to update delivery status
  const updateDeliveryStatus = (newStatus) => {
    // In a real app, this would make an API call to update the status
    if (newStatus === 'picked_up') {
      Alert.alert(
        "Confirm Pickup",
        "Have you picked up the food from the restaurant?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Picked Up",
            onPress: () => {
              setActiveDelivery({...activeDelivery, status: 'picked_up'});
              Alert.alert("Success", "Status updated to Picked Up");
            }
          }
        ]
      );
    } else if (newStatus === 'delivered') {
      Alert.alert(
        "Confirm Delivery",
        "Has the food been delivered to the destination?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Delivered",
            onPress: () => {
              // Clear the active delivery when delivered
              setActiveDelivery(null);
              Alert.alert("Success", "Delivery completed successfully!");
            }
          }
        ]
      );
    }
  };

  // Function to navigate to available deliveries
  const goToAvailableDeliveries = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">My Deliveries</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {activeDelivery ? (
          // Active delivery view
          <View className="bg-white rounded-lg shadow p-4">
            {/* Status indicator */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Current Delivery</Text>
              <View className={`px-3 py-1 rounded-full ${activeDelivery.status === 'accepted' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                <Text 
                  className={`text-xs font-medium ${activeDelivery.status === 'accepted' ? 'text-yellow-800' : 'text-blue-800'}`}
                >
                  {activeDelivery.status === 'accepted' ? 'Accepted' : 'Picked Up'}
                </Text>
              </View>
            </View>
            
            {/* Restaurant info */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="restaurant-outline" size={20} color="#00CCBB" />
                <Text className="text-lg font-bold ml-2 text-gray-800">{activeDelivery.restaurant.name}</Text>
              </View>
              <Text className="text-gray-600 ml-7">{activeDelivery.restaurant.address}</Text>
              <TouchableOpacity className="flex-row items-center mt-2 ml-7">
                <Ionicons name="call-outline" size={16} color="#00CCBB" />
                <Text className="text-[#00CCBB] ml-1">Call Restaurant</Text>
              </TouchableOpacity>
            </View>
            
            {/* Destination info */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={20} color="#FF4500" />
                <Text className="text-lg font-bold ml-2 text-gray-800">{activeDelivery.destination.name}</Text>
              </View>
              <Text className="text-gray-600 ml-7">{activeDelivery.destination.address}</Text>
              <TouchableOpacity className="flex-row items-center mt-2 ml-7">
                <Ionicons name="call-outline" size={16} color="#00CCBB" />
                <Text className="text-[#00CCBB] ml-1">Call Recipient</Text>
              </TouchableOpacity>
            </View>
            
            {/* Items info */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex-row items-start mb-2">
                <Ionicons name="fast-food-outline" size={20} color="#542de4" />
                <Text className="text-lg font-bold ml-2 text-gray-800">Items</Text>
              </View>
              <Text className="text-gray-600 ml-7">{activeDelivery.items}</Text>
            </View>
            
            {/* Action buttons */}
            {activeDelivery.status === 'accepted' ? (
              <TouchableOpacity 
                className="bg-[#FFBB00] py-3 rounded-lg items-center"
                onPress={() => updateDeliveryStatus('picked_up')}
              >
                <Text className="text-white font-bold">Mark as Picked Up</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-[#00CCBB] py-3 rounded-lg items-center"
                onPress={() => updateDeliveryStatus('delivered')}
              >
                <Text className="text-white font-bold">Mark as Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // No active delivery view
          <View className="bg-white rounded-lg p-6 shadow items-center justify-center py-20">
            <Ionicons name="bicycle-outline" size={70} color="#cccccc" />
            <Text className="text-lg text-gray-400 text-center mt-4">You currently have no active deliveries</Text>
            <Text className="text-sm text-gray-400 text-center mt-2 mb-6">Thank you for supporting the community ❤️</Text>
            
            <TouchableOpacity 
              className="bg-[#00CCBB] py-3 px-6 rounded-lg items-center"
              onPress={goToAvailableDeliveries}
            >
              <Text className="text-white font-bold">Find Available Deliveries</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}