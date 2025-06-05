import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "../../slices/restaurantSlice";
import {
  removeFromBasket,
  selectBasketItems,
  selectBasketTotal,
} from "../../slices/basketSlice";
import { XCircleIcon } from "react-native-heroicons/solid";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Currency from "react-currency-formatter";
import useAxios from "../../hooks/useAxios";
import { Alert } from "react-native";

const BasketScreen = ({ navigation }) => {
  const restaurant = useSelector(selectRestaurant);
  const items = useSelector(selectBasketItems);
  const [groupItemsBasket, setGroupItemsBasket] = useState({});
  const basketTotal = useSelector(selectBasketTotal);
  const dispatch = useDispatch();

  const axios = useAxios();

  const handlePlaceOrder = async () => {
    try {
      const user_id = "user_1";
      const itemMap = {};
      items.forEach((item) => {
        if (!itemMap[item.id]) {
          itemMap[item.id] = 1;
        } else {
          itemMap[item.id]++;
        }
      });

      for (const [product_id, amount] of Object.entries(itemMap)) {
        await axios.post("/api/foodbucket/add", {
          user_id,
          product_id,
          amount,
        });
      }
      navigation.navigate("Prepare");
    } catch (error) {
      Alert.alert("Error", "Could not place order.");
    }
  };

  useMemo(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupItemsBasket(groupedItems);
  }, [items]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-gray-100">
        <View className="p-5 border-b border-[#00ccbb] bg-white shadow-sm">
          <View>
            <Text className="text-lg font-bold text-center">Basket</Text>
            <Text className="text-center text-gray-400">
              {restaurant?.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack(null)}
            className="absolute bg-gray-100 rounded-full top-3 right-2"
          >
            <XCircleIcon color="#00ccbb" height={50} width={50} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center px-4 py-3 my-5 space-x-4 bg-white">
          <Ionicons name="fast-food" color="#2c9935" size={30} />
          <Text className="flex-1"> Deliver in 10-15 mins</Text>
          <TouchableOpacity>
            <Text className="text-[#00ccbb]">Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="divide-y divide-gray-200">
          {Object.entries(groupItemsBasket).map(([key, items]) => (
            <View
              key={key}
              className="flex-row items-center px-5 py-2 space-x-3 bg-white"
            >
              <Text className="font-bold text-green-600 text-md">
                {items.length} x
              </Text>
              <Image
                source={{
                  uri: items[0]?.image,
                }}
                className="w-12 h-12 rounded-full"
              />
              <Text className="flex-1">{items[0]?.name}</Text>
              <Text className="text-xs text-gray-600">
                <Currency quantity={items[0]?.price} currency="LKR" />
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(removeFromBasket({ id: key }))}
              >
                <AntDesign name="minuscircle" size={16} color="#00ccbb" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View className="p-5 mt-5 space-y-4 bg-white ">
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Subtotal</Text>
            <Text className="text-gray-400">
              <Currency quantity={basketTotal} currency="LKR" />
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Delivery Fee</Text>
            <Text className="text-gray-400">
              <Currency quantity={13.3} currency="LKR" />
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-bold text-gray-400">Order Total</Text>
            <Text className=" text-[#1f1f20] font-extrabold">
              {/* {(Number(basketTotal) + 13.3).toFixed(2)} */}
              <Currency quantity={basketTotal + 13.3} currency="LKR" />
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-lg bg-[#00ccbb] p-4 shadow-xl"
            onPress={handlePlaceOrder}
          >
            <Text className="text-lg font-bold text-center text-white">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BasketScreen;
