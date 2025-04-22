import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from "react-native-heroicons/solid";
import DishRow from "../components/DishRow";
import BasketContainer from "../components/BasketContainer";
import { useDispatch } from "react-redux";
import { setRestaurant } from "../slices/restaurantSlice";
import axios from "axios";
import { BACKEND_URL } from "@env";
import Icon from "react-native-vector-icons/MaterialIcons";

const RestaurantScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [restaurant, setRestaurantData] = useState(null);
  const [showSubProducts, setShowSubProducts] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/restaurants/unique/${id}`
        );
        const data = response.data.restaurant;

        // Hardcode ratings and descriptions for now
        const restaurantData = {
          ...data,
          rating: 4.5,
          genre: "Italian",
          short_description: "A cozy place for delicious Italian cuisine.",
          dishes: data.products || [],
          imgUrl: "https://picsum.photos/400/300",
          address: data.seller_detail.location || "Unknown Address",
        };

        setRestaurantData(restaurantData);

        dispatch(
          setRestaurant({
            id: restaurantData.id,
            imgUrl: restaurantData.imgUrl,
            title: restaurantData.name,
            rating: restaurantData.rating,
            genre: restaurantData.genre,
            address: restaurantData.location,
            short_description: restaurantData.short_description,
            dishes: restaurantData.dishes,
            long: restaurantData.long || 0,
            lat: restaurantData.lat || 0,
          })
        );
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [dispatch, id]);

  if (!restaurant) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <BasketContainer />
      <ScrollView>
        <View className="relative">
          <Image
            source={{ uri: restaurant.imgUrl }}
            className="w-full h-56 p-4 bg-gray-300"
          />
          <TouchableOpacity
            className="absolute p-2 bg-white rounded-full top-14 left-5"
            onPress={() => navigation.goBack(null)}
          >
            <ArrowLeftIcon size={20} color="#00ccbb" />
          </TouchableOpacity>
        </View>
        <View className="bg-white">
          <View className="px-4 pt-4">
            <Text className="text-3xl font-bold ">{restaurant.title}</Text>
            <View className="flex-row my-1 space-x-2">
              <View className="flex-row items-center space-x-1">
                <StarIcon color="green" opacity={0.5} size={22} />
                <Text className="text-xs text-gray-500">
                  <Text className="text-green-500">
                    {restaurant.rating} . {restaurant.genre}
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <MapPinIcon color="gray" opacity={0.5} size={22} />
                <Text className="text-xs text-gray-500">
                  Nearby . {restaurant.address}
                </Text>
              </View>
            </View>
            <Text className="pb-4 mt-2 text-gray-500">
              {restaurant.short_description}
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center p-4 space-x-2 border-gray-100 border-y-2 ">
            <QuestionMarkCircleIcon color="gray" opacity={0.5} size={20} />
            <Text className="flex-1 pl-2 text-sm font-bold">
              Have a food allergy?
            </Text>
            <ChevronRightIcon color="#00ccbb" />
          </TouchableOpacity>
        </View>
        <View className="pb-36">
          <Text className="px-4 pt-6 mb-3 text-xl font-bold">Menu</Text>

          {restaurant?.dishes?.length > 0 ? (
            restaurant.dishes.map((dish) => (
              <View key={dish.id}>
                <DishRow
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  image={dish.image || "https://picsum.photos/400/300"}
                />
                {/* Render sub-products */}
                {dish.has_subs && dish.sub_products?.length > 0 && (
                  <View className="pb-5 pl-6">
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => setShowSubProducts(!showSubProducts)}
                    >
                      <Text className="mr-1 font-medium text-green-600">
                        {showSubProducts ? "Show Less" : "See Menu"}
                      </Text>
                      <Icon name="chevron-right" size={16} color="#16a34a" />
                    </TouchableOpacity>
                    {showSubProducts && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-2"
                      >
                        {dish.sub_products.map((subProduct) => (
                          <View
                            key={subProduct.id}
                            style={{ width: 300, marginRight: 10 }}
                          >
                            <DishRow
                              id={subProduct.id}
                              name={subProduct.name}
                              description={subProduct.description}
                              price={subProduct.price}
                              image={
                                subProduct.image
                              }
                            />
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text className="px-4 text-gray-500">No dishes available.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default RestaurantScreen;
