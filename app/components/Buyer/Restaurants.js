import {View, Text, TouchableOpacity, FlatList, Dimensions} from "react-native";
import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import useAxios from '../../hooks/useAxios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual user location
  const location = "Buyer Location 1";
  const navigation = useNavigation();

  useEffect(() => {
    const axios = useAxios();
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/restaurants/${location}`);
        const data = response.data.restaurants;
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const renderHorizontalItem = ({ item: restaurant }) => (
      <RestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          imgUrl={restaurant.image}
          title={restaurant.name}
          rating={restaurant.averageRating}
          short_description={restaurant.description}
          long={restaurant.long || 0}
          lat={restaurant.lat || 0}
      />
  );

  const EmptyListComponent = () => (
    <View className="flex items-center justify-center py-10">
      <Text className="text-gray-500">No restaurants available nearby at the moment</Text>
    </View>
  );

  if (loading) {
    const screenWidth = Dimensions.get("window").width;
    
    return (
      <View className="pt-4 pb-4">
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Text className="text-lg font-bold">Near By Restaurants</Text>
          <View className="flex-row items-center">
            <Text className="mr-1 font-medium text-gray-300">See All</Text>
            <Icon name="chevron-right" size={16} color="#d1d5db" />
          </View>
        </View>

        <FlatList
          data={[1, 2, 3]} // Dummy data for skeleton loaders
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 10,
          }}
          renderItem={() => (
            <View
              className="overflow-hidden rounded-lg bg-gray-200"
              style={{
                width: screenWidth - 30,
                marginHorizontal: 5,
                borderWidth: 1,
                borderColor: "#e0e0e0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
                padding: 8,
              }}
            >
              <View className="overflow-hidden rounded-lg">
                <View className="w-full h-40 bg-gray-300 rounded-lg" />
                <View className="px-3 pb-4 pt-2 space-y-1 rounded bg-gray-100">
                  <View className="h-6 bg-gray-300 rounded w-3/4 mt-1" />
                  <View className="h-4 bg-gray-300 rounded w-full" />
                  <View className="flex-row items-center justify-between">
                    <View className="h-4 bg-gray-300 rounded w-1/4" />
                    <View className="h-4 bg-gray-300 rounded w-1/3" />
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(_, index) => `skeleton-${index}`}
        />
      </View>
    );
  }

  return (
    <View className="pt-4 pb-4">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <Text className="text-lg font-bold">Near By Restaurants</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.navigate("AllRestaurantsScreen", { restaurants })}
        >
          <Text className="mr-1 font-medium text-green-600">See All</Text>
          <Icon name="chevron-right" size={16} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={restaurants.slice(0, 5)}
        renderItem={renderHorizontalItem}
        keyExtractor={(item) => item.id}
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

export default Restaurants;
