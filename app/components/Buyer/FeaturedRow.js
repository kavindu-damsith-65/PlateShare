import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import RestaurantCard from "./RestaurantCard";

const FeaturedRow = ({ title, description }) => {
  const [restaurants, setRestaurants] = useState([]);
  const location = "Buyer Location 1";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${location}`
        );
        const data = response.data.restaurants;
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 mt-4">
        <Text className="text-lg font-bold">{title}</Text>
        <ArrowRightIcon color="#00ccbb" />
      </View>

      <Text className="px-4 text-xs text-gray-500 ">{description}</Text>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        horizontal
        className="pt-4"
      >
        {/* restaurant cards */}
        {restaurants.map((restaurant) => (
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
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
