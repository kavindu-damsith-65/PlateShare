import { View, Text, TouchableOpacity, Image } from "react-native";

import React from "react";
import { StarIcon, MapPinIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";

export default function RestaurantCard({
  id,
  imgUrl,
  title,
  rating,
  genre,
  short_description,
  dishes,
  long,
  lat,
}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Restaurant", {
          id,
          imgUrl,
          title,
          rating,
          genre,
          short_description,
          dishes,
          long,
          lat,
        });
      }}
      className="w-64 mr-4 overflow-hidden bg-white rounded-lg shadow"
   >
      <Image
        source={{
          uri: imgUrl,
        }}
        className="w-full h-36"
      />
      <View className="px-3 pb-4 space-y-1">
        <Text className="pt-2 text-xl font-bold">{title}</Text>
        <View className="flex-row items-center space-x-1">
          <StarIcon color="green" opacity={0.5} size={22} />
          <Text className="text-xs text-gray-500">
            <Text className="text-green-500">{rating}</Text>
          </Text>
        </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="font-bold text-green-600">{genre}</Text>
                <View className="px-2 py-1 bg-green-100 rounded-full">
                  <Text className="text-xs text-green-700">1.2 km away</Text>
                </View>
          </View>
      </View>
    </TouchableOpacity>
  );
}
