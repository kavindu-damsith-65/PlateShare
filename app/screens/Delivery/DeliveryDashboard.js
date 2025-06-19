import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

// Delivery Request Card Component
const DeliveryRequestCard = ({ request, onAccept }) => {
  return (
      <View className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={18} color="#00CCBB" />
              <Text className="text-lg font-bold ml-2">{request.restaurant}</Text>
            </View>
            <View className="bg-gray-100 px-2 py-1 rounded-full">
              <Text className="text-xs text-gray-600">{request.distance} away</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={18} color="#FF4500" />
            <Text className="text-base ml-2">{request.dropLocation}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="fast-food-outline" size={18} color="#542de4" />
            <Text className="text-sm text-gray-700 ml-2">{request.itemsSummary}</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text className="text-xs text-gray-500 ml-2">{request.timeRequested}</Text>
          </View>

          <TouchableOpacity
              className="bg-[#00CCBB] py-3 rounded-lg items-center"
              onPress={() => onAccept(request.id)}
          >
            <Text className="text-white font-bold">Accept Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default function DeliveryDashboard() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Hardcoded delivery requests
  const [deliveryRequests, setDeliveryRequests] = useState([
    {
      id: '1',
      restaurant: 'Green Bowl Café',
      dropLocation: 'Hope Elders Home',
      itemsSummary: '10 rice bowls, 5 curries',
      distance: '3.4 km',
      timeRequested: 'Requested 12 mins ago'
    },
    {
      id: '2',
      restaurant: 'Fresh Bites',
      dropLocation: 'Sunshine Orphanage',
      itemsSummary: '8 sandwiches, 12 fruit cups',
      distance: '2.1 km',
      timeRequested: 'Requested 25 mins ago'
    },
    {
      id: '3',
      restaurant: 'Spice Garden',
      dropLocation: 'Community Center',
      itemsSummary: '15 meal boxes, 10 desserts',
      distance: '4.7 km',
      timeRequested: 'Requested 35 mins ago'
    },
    {
      id: '4',
      restaurant: 'Daily Bread Bakery',
      dropLocation: 'Senior Living Facility',
      itemsSummary: '20 bread loaves, 15 pastries',
      distance: '1.8 km',
      timeRequested: 'Requested 45 mins ago'
    },
    {
      id: '5',
      restaurant: 'Healthy Harvest',
      dropLocation: 'Youth Shelter',
      itemsSummary: '12 salad boxes, 8 soup containers',
      distance: '3.9 km',
      timeRequested: 'Requested 1 hour ago'
    }
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAcceptDelivery = (requestId) => {
    // In a real app, this would make an API call to accept the delivery
    console.log(`Accepted delivery request ${requestId}`);

    // Remove the accepted request from the list
    setDeliveryRequests(deliveryRequests.filter(req => req.id !== requestId));

    // Navigate to the delivery details or update the UI
    // navigation.navigate('DeliveryDetails', { requestId });
  };

  const renderItem = ({ item }) => (
      <DeliveryRequestCard
          request={item}
          onAccept={handleAcceptDelivery}
      />
  );

  return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-5">
        <StatusBar style="dark" />

        <View className="px-5 py-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Available Deliveries</Text>
        </View>

        <FlatList
            className="flex-1 px-4 pt-4"
            data={deliveryRequests}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#00CCBB"
              />
            }
            ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-20">
                  <Ionicons name="bicycle-outline" size={80} color="#cccccc" />
                  <Text className="text-lg text-gray-400 text-center mt-4">No deliveries available right now</Text>
                  <Text className="text-sm text-gray-400 text-center mt-1">Pull down to refresh</Text>
                </View>
            )}
            ListHeaderComponent={() => (
                <View className="mb-4">
                  <Text className="text-2xl font-semibold text-gray-800">Welcome, Delivery Partner 👋</Text>
                  <Text className="text-sm text-gray-500 mt-1">Here are your available delivery opportunities</Text>
                </View>
            )}
        />
      </SafeAreaView>
  );
}