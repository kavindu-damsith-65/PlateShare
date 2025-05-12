import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import React from "react";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import RestaurantCard from "../../components/Buyer/RestaurantCard";

const AllRestaurantsScreen = ({ route, navigation }) => {
  const { restaurants } = route.params;

  const renderVerticalItem = ({ item: restaurant }) => (
    <RestaurantCard
      id={restaurant.id}
      imgUrl={restaurant.image || "https://picsum.photos/400/300"}
      title={restaurant.name}
      rating={restaurant.averageRating}
      short_description={restaurant.description}
      long={restaurant.long || 0}
      lat={restaurant.lat || 0}
    />
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
        <Text className="text-xl font-bold text-center">All Restaurants</Text>
      </View>

      <FlatList
        data={restaurants}
        renderItem={renderVerticalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20,
          paddingHorizontal: 10,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
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
