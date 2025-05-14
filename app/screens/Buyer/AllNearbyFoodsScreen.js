import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from "react-native";
import React from "react";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { MapPinIcon } from "react-native-heroicons/outline"; // Import MapPinIcon
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const AllNearbyFoodsScreen = ({ route, navigation }) => {
  const { dishes } = route.params;

  const renderVerticalItem = ({ item: dish }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 mb-4 bg-white rounded-lg shadow"
      style={{
        width: SCREEN_WIDTH - 30,
        marginHorizontal: 5,
        borderWidth: 15,
        borderColor: "#e0e0e0",
      }}
      activeOpacity={0.7}
    >
      {/* Food Details */}
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold" numberOfLines={1}>
          {dish.name}
        </Text>
        <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
          {dish.description || dish.short_description}
        </Text>
        <Text className="mt-2 font-bold text-green-600">
          {dish.price === 0 ? "Free" : `Rs. ${dish.price}`}
        </Text>
        {/* Location Information */}
        <View className="flex-row items-center mt-2 space-x-1">
          <MapPinIcon color="gray" opacity={0.4} size={18} />
          <Text className="text-xs text-gray-500">Nearby • 1.2 km</Text>
        </View>
      </View>

      {/* Image */}
      <Image
        source={{ uri: dish.image }}
        className="w-20 h-20 "
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-7">
      <View className="relative py-4 bg-white shadow-sm">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center">Foods Near You</Text>
      </View>

      <FlatList
        data={dishes}
        renderItem={renderVerticalItem}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20,
          paddingHorizontal: 10,
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