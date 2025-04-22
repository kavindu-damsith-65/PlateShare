import { View, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";
import { BACKEND_URL } from "@env"; 

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const location = "Buyer Location 1";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/restaurants/${location}`); 
        const data = response.data.restaurants;

        // Hardcode ratings and descriptions for now
        const updatedRestaurants = data.map((restaurant) => ({
          ...restaurant,
          rating: 4.5,
          genre: "Italian",
          short_description: "A cozy place for delicious Italian cuisine.",
        }));

        setRestaurants(updatedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <View>
      <Text className="px-4 pt-3 text-lg font-bold">Restaurants Near You</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        horizontal
        className="pt-4"
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            imgUrl={restaurant.image || "https://picsum.photos/400/300"}
            title={restaurant.name}
            rating={restaurant.rating}
            genre={restaurant.genre}
            short_description={restaurant.short_description}
            dishes={restaurant.products || []}
            long={restaurant.long || 0}
            lat={restaurant.lat || 0}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Restaurants;
