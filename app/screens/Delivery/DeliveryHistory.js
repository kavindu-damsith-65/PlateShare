import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// History Item Component
const HistoryItem = ({ delivery }) => {
  const navigation = useNavigation();
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg shadow-sm mb-4 p-4"
      activeOpacity={0.7}
      onPress={() => console.log('View delivery details:', delivery.id)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-gray-500 text-sm">{formatDate(delivery.completedAt)}</Text>
        <View className="bg-gray-100 px-2 py-1 rounded-full">
          <Text className="text-xs font-medium text-gray-600">Delivered</Text>
        </View>
      </View>
      
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <Ionicons name="restaurant-outline" size={16} color="#00CCBB" />
          <Text className="text-base font-bold ml-2">{delivery.from}</Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#FF4500" />
          <Text className="text-base font-bold ml-2">{delivery.to}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center">
        <Ionicons name="fast-food-outline" size={16} color="#542de4" />
        <Text className="text-sm text-gray-600 ml-2" numberOfLines={2}>{delivery.items}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function DeliveryHistory() {
  const [loading, setLoading] = useState(true);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  
  // Simulate loading data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Hardcoded delivery history data
      setDeliveryHistory([
        {
          id: 'hist_1',
          from: 'Green Bowl Café',
          to: 'Hope Elders Home',
          items: '10 rice bowls, 5 curries, 8 drinks',
          completedAt: '2023-06-15T17:30:00Z',
        },
        {
          id: 'hist_2',
          from: 'Fresh Bites',
          to: 'Sunshine Orphanage',
          items: '8 sandwiches, 12 fruit cups, 10 juice boxes',
          completedAt: '2023-06-12T14:45:00Z',
        },
        {
          id: 'hist_3',
          from: 'Spice Garden',
          to: 'Community Center',
          items: '15 meal boxes, 10 desserts, 20 water bottles',
          completedAt: '2023-06-10T12:15:00Z',
        },
        {
          id: 'hist_4',
          from: 'Daily Bread Bakery',
          to: 'Senior Living Facility',
          items: '20 bread loaves, 15 pastries, 5 cakes',
          completedAt: '2023-06-05T09:30:00Z',
        },
        {
          id: 'hist_5',
          from: 'Healthy Harvest',
          to: 'Youth Shelter',
          items: '12 salad boxes, 8 soup containers, 15 fruit baskets',
          completedAt: '2023-06-01T16:00:00Z',
        }
      ]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const renderItem = ({ item }) => <HistoryItem delivery={item} />;
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Delivery History</Text>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00CCBB" />
          <Text className="mt-2 text-gray-500">Loading delivery history...</Text>
        </View>
      ) : deliveryHistory.length > 0 ? (
        <FlatList
          className="flex-1 p-4"
          data={deliveryHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="time-outline" size={70} color="#cccccc" />
          <Text className="text-lg text-gray-400 text-center mt-4">No delivery history yet</Text>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Your completed deliveries will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}