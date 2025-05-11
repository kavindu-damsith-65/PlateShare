import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const NearbyFoods = () => {
  const navigation = useNavigation();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace with actual user location
  const location = "Buyer Location 1";
  
  useEffect(() => {
    const fetchNearbyFoods = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/nearby/${location}`);
        setDishes(response.data.products || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching nearby foods:", error);
        setError("Failed to load nearby foods");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyFoods();
  }, []);

  // Render horizontal item
  const renderHorizontalItem = ({ item: dish }) => (
    <TouchableOpacity 
      className="w-64 mr-4 overflow-hidden bg-white rounded-lg shadow"
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: dish.image }} 
        className="w-full h-36"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>{dish.name}</Text>
        <Text className="text-sm text-gray-500" numberOfLines={2}>{dish.description || dish.short_description}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-bold text-green-600">{dish.price === 0 ? "Free" : `Rs. ${dish.price}`}</Text>
          <View className="px-2 py-1 bg-green-100 rounded-full">
            <Text className="text-xs text-green-700">1.2 km away</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View className="py-8">
        <Text className="text-center text-gray-500">Loading nearby foods...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-8">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  const EmptyListComponent = () => (
    <View className="flex items-center justify-center py-10">
      <Text className="text-gray-500">No foods available nearby at the moment</Text>
    </View>
  );

  const handleSeeAllPress = () => {
    navigation.navigate("AllNearbyFoodsScreen", { dishes });
  };

  return (
    <View className="pb-4">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <Text className="text-lg font-bold">Foods Near You</Text>
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={handleSeeAllPress}
        >
          <Text className="mr-1 font-medium text-green-600">See All</Text>
          <Icon name="chevron-right" size={16} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dishes.slice(0, 5)}
        renderItem={renderHorizontalItem}
        keyExtractor={(item) => item._id || item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 10,
        }}
        ListEmptyComponent={EmptyListComponent}
      />
    </View>
  );
};

export default NearbyFoods;
