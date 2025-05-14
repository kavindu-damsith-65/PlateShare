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
import { setRestaurant } from "../../slices/restaurantSlice";
import useAxios from '../../hooks/useAxios';
import Reviews from "../../components/Buyer/Reviews";
import { Dimensions } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

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

  const [expandedDishes, setExpandedDishes] = useState({});
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

  const toggleSubProducts = (dishId) => {
    setExpandedDishes((prevState) => ({
      ...prevState,
      [dishId]: !prevState[dishId], // Toggle the state for the specific dish
    }));
  };

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
            source={{ uri: imgUrl }}
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
            <Text className="text-xl font-bold">{title}</Text>
            <View className="flex-row my-1 space-x-2">
              <View className="flex-row items-center space-x-1">
                <StarIcon color="green" opacity={0.5} size={22} />
                <Text className="text-xs text-gray-500">
                  <Text className="text-green-500">
                    {rating}
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
              {short_description}
            </Text>
          </View>
        </View>
         {/* Tabs */}
        <View className="flex-row px-4 pt-4 bg-white border-b border-gray-300">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`mr-6 pb-2 ${selectedTab === tab.key ? "border-b-2 border-[#00CCBB]" : ""}`}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text className={`text-base font-medium ${selectedTab === tab.key ? "text-[#00CCBB]" : "text-gray-500"}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View>
          {selectedTab === "menu" && (
            <View className="pb-2">
              <Text className="px-4 pt-6 mb-3 text-xl font-bold">Menu</Text>
              {restaurantData?.dishes?.length > 0 ? (
                restaurantData.dishes.map((dish) => (
                  <View key={dish.id}>
                    <DishRow
                      id={dish.id}
                      name={dish.name}
                      description={dish.description}
                      price={dish.price}
                      image={dish.image}
                    />
                    {/* Render sub-products */}
                    {dish.has_subs && dish.sub_products?.length > 0 && (
                      <View className="pb-5 pl-6">
                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => toggleSubProducts(dish.id)}
                        >
                          <Text className="mr-1 font-medium text-green-600">
                            {expandedDishes[dish.id] ? "Show Less" : "See Menu"}
                          </Text>
                        </TouchableOpacity>
                        {expandedDishes[dish.id] && (
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
                                  image={subProduct.image}
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
