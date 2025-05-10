import {View, Text, TouchableOpacity, FlatList} from "react-native";
import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  // TODO: Replace with actual user location
  const location = "Buyer Location 1";
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/restaurants/${location}`);
        const data = response.data.restaurants;
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
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

  return (
    <View className="pb-4 pt-4">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <Text className="text-lg font-bold">Restaurants Near You</Text>
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
