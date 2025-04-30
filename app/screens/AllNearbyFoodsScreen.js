import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from "react-native";
import React from "react";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { MapPinIcon } from "react-native-heroicons/solid";

const AllNearbyFoodsScreen = ({ route, navigation }) => {
  const { dishes } = route.params;

  const renderVerticalItem = ({ item: dish }) => (
    <TouchableOpacity 
      className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: dish.image }} 
        className="w-32 h-32"
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>
          {dish.name}
        </Text>

        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {dish.description || dish.short_description}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-bold text-green-600">
            {dish.price === 0 ? "Free" : `Rs. ${dish.price}`}
          </Text>
          <View className="flex-row items-center space-x-1">
            <MapPinIcon color="gray" opacity={0.4} size={18} />
            <Text className="text-xs text-gray-500">Nearby • 1.2 km</Text>
          </View>
        </View>
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
        <Text className="text-center text-xl font-bold">Foods Near You</Text>
      </View>

      <FlatList
        data={dishes}
        renderItem={renderVerticalItem}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20
        }}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center py-10">
            <Text className="text-gray-500">No foods available nearby</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AllNearbyFoodsScreen;