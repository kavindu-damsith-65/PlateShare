import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeftIcon,
  MapPinIcon,
  StarIcon,
} from "react-native-heroicons/solid";
import DishRow from "../../components/Buyer/DishRow";
import BasketContainer from "../../components/Buyer/BasketContainer";
import { useDispatch } from "react-redux";
import { setRestaurant, addToBasket } from "../../slices/restaurantSlice";
import useAxios from '../../hooks/useAxios';
import Reviews from "../../components/Buyer/Reviews";

const TABS = [
  { key: "menu", label: "Menu" },
  { key: "reviews", label: "Reviews" },
  { key: "info", label: "Info" },
];

const RestaurantScreen = ({ route, navigation }) => {
  const {
    id,
    imgUrl,
    title,
    rating,
    short_description,
    long,
    lat,
  } = route.params;
  const axios = useAxios();
  const [restaurantData, setRestaurantData] = useState({
    id,
    imgUrl,
    title,
    rating,
    short_description,
    dishes: [],
    long,
    lat,
    address: "Loading address...",
  });

  const [selectedTab, setSelectedTab] = useState("menu");

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
          `/api/restaurants/unique/${id}`
        );
        const data = response.data.restaurant;

        const restaurantData = {
          ...data,
          dishes: data.products,
          address: data.seller_detail.address || "Unknown Address",
        };

        setRestaurantData(restaurantData);

        dispatch(
            setRestaurant({
              id,
              imgUrl,
              title,
              rating,
              short_description,
              dishes: data.products,
              long,
              lat,
              address: data.seller_detail?.address || "Unknown Address",
            })
        );
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [dispatch, id]);


  if (!restaurantData) {
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
            source={{ uri: restaurantData.image || imgUrl }}
            className="w-full h-56 p-4 bg-gray-300"
          />
          <TouchableOpacity
            className="absolute p-2 bg-white rounded-full top-14 left-5"
            onPress={() => navigation.goBack(null)}
          >
            <ArrowLeftIcon size={20} color="#00ccbb" />
          </TouchableOpacity>
        </View>
        <View className="bg-gray-200">
          <View className="px-4 pt-4">
            <Text className="text-xl font-bold">{restaurantData.name || title}</Text>
            <View className="flex-row my-1 space-x-2">
              <View className="flex-row items-center space-x-1">
                <StarIcon color="green" opacity={0.5} size={22} />
                <Text className="text-xs text-gray-500">
                  <Text className="text-green-500">
                    {restaurantData.rating || rating}
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <MapPinIcon color="gray" opacity={0.5} size={22} />
                <Text className="text-xs text-gray-500">
                  Nearby . {restaurantData.address}
                </Text>
              </View>
            </View>
            <Text className="pb-4 mt-2 text-gray-500">
              {restaurantData.description || short_description}
            </Text>
          </View>
        </View>
         {/* Tabs */}
        <View className="bg-white shadow-sm">
          <View className="flex-row border-b border-gray-100">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 items-center py-4 ${
                  selectedTab === tab.key 
                    ? "border-b-2 border-[#00CCBB]" 
                    : "border-b-2 border-transparent"
                }`}
                onPress={() => setSelectedTab(tab.key)}
              >
                <Text 
                  className={`text-base font-medium ${
                    selectedTab === tab.key 
                      ? "text-[#00CCBB] font-semibold" 
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View className="bg-gray-50">
          {selectedTab === "menu" && (
            <View className="pb-24 mt-3">
              {restaurantData?.dishes?.length > 0 ? (
                restaurantData.dishes.map((dish) => (
                  <View key={dish.id} className="mb-2">
                    <DishRow
                      id={dish.id}
                      name={dish.name}
                      description={dish.description}
                      price={dish.price}
                      image={dish.image}
                      sub_products={dish.sub_products}
                    />
                  </View>
                ))
              ) : (
                // Skeleton loaders for dishes
                Array(3).fill().map((_, index) => (
                  <View key={`skeleton-${index}`} className="self-center w-full max-w-[360px] mb-2">
                    <View className="p-6 bg-white shadow-sm rounded-2xl">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 pr-4">
                          <View className="w-3/4 h-5 mb-2 bg-gray-200 rounded" />
                          <View className="w-full h-4 mb-2 bg-gray-200 rounded" />
                          <View className="w-1/2 h-4 bg-gray-200 rounded" />
                        </View>
                        <View
                          className="w-24 h-24 bg-gray-200 rounded-lg"
                          style={{ borderWidth: 1, borderColor: "#f3f3f4" }}
                        />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {selectedTab === "reviews" && (
            <View className="px-4 pt-6">
              <Reviews restaurantId={id} />
            </View>
          )}

          {selectedTab === "info" && (
            <View className="px-4 pt-6">
              <Text className="mb-2 text-lg font-bold">About</Text>
              <Text className="mb-2 text-gray-700">{restaurantData.short_description}</Text>
              <Text className="text-gray-500">Address: {restaurantData.address}</Text>
              {/* Add more info fields as needed */}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};


export default RestaurantScreen;
