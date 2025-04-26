import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from "react-native";
import React from "react";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { StarIcon, MapPinIcon } from "react-native-heroicons/solid";

const AllRestaurantsScreen = ({ route, navigation }) => {
  const { restaurants } = route.params;

  const renderVerticalItem = ({ item: restaurant }) => (
    <TouchableOpacity
      className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("Restaurant", {
          id: restaurant.id,
          imgUrl: restaurant.image,
          title: restaurant.name,
          rating: restaurant.averageRating,
          genre: restaurant.genre,
          short_description: restaurant.description,
          dishes: restaurant.products || [],
          long: restaurant.long || 0,
          lat: restaurant.lat || 0,
        });
      }}
    >
      <Image
        source={{ uri: restaurant.image || "https://picsum.photos/400/300" }}
        className="w-32 h-32"
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>
          {restaurant.name}
        </Text>

        <View className="flex-row items-center space-x-3 mt-1">
          <View className="flex-row items-center space-x-1">
            <StarIcon color="green" opacity={0.5} size={18} />
            <Text className="text-xs text-gray-500">
              <Text className="text-green-500">{restaurant.averageRating}</Text>
            </Text>
          </View>

          <View className="flex-row items-center space-x-1">
            <MapPinIcon color="gray" opacity={0.4} size={18} />
            <Text className="text-xs text-gray-500">Nearby • 1.2 km</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-500 mt-2" numberOfLines={2}>
          {restaurant.description}
        </Text>

        {/*<View className="flex-row items-center justify-between mt-2">*/}
        {/*  <View className="flex-row items-center">*/}
        {/*    <Text className="text-xs text-gray-500">*/}
        {/*      {(restaurant.products || []).length} items*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*  <View className="px-2 py-1 bg-green-100 rounded-full">*/}
        {/*    <Text className="text-xs text-green-700">Open</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-7">
      <View className="relative py-4 shadow-sm bg-white">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold">All Restaurants</Text>
      </View>

      <FlatList
        data={restaurants}
        renderItem={renderVerticalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20
        }}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center py-10">
            <Text className="text-gray-500">No restaurants available</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AllRestaurantsScreen;
