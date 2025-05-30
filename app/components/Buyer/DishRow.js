import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Currency from "react-currency-formatter";
import { MinusCircleIcon, PlusCircleIcon, ChevronDownIcon } from "react-native-heroicons/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasket,
  selectBasketItemsWithId,
  removeFromBasket,
} from "../../slices/basketSlice";

const DishRow = ({ id, name, description, price, image, sub_products }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showSubProducts, setShowSubProducts] = useState(false);
  const dispatch = useDispatch();

  // this wll cause some massive re-renders
  // const items = useSelector((state) => selectBasketItemsWithId(state, id));

  const getImageUrl = (imageSource) => {
    if (!imageSource) return null;
    return imageSource;
  };

  const addItemToBasket = () => {
    dispatch(addToBasket({
      id,
      name,
      description,
      price,
      image: getImageUrl(image),
      sub_products
    }));
  };

  const removeItemFromBasketHandler = () => {
    if (!items.length > 0) return;
    dispatch(removeFromBasket({ id }));
  };

  const toggleSubProducts = (e) => {
    e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
    setShowSubProducts(!showSubProducts);
  };

  const hasSubProducts = sub_products && sub_products.length > 0;

  return (
    <View className="self-center w-full max-w-[360px]">
      <TouchableOpacity
        onPress={() => setIsPressed(!isPressed)}
        className={`bg-white p-4 rounded-2xl shadow-sm ${
          (isPressed || showSubProducts) ? "border-b-0 rounded-b-none" : ""
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-bold text-left text-gray-800">{name}</Text>
            <Text
              className="text-gray-500 text-xs mt-1 text-left"
              numberOfLines={2}
            >
              {description}
            </Text>
            <Text className="text-[#00CCBB] font-semibold mt-2 text-left">
              <Currency quantity={parseFloat(price)} currency="LKR" />
            </Text>
            
            {hasSubProducts && (
              <TouchableOpacity
                onPress={toggleSubProducts}
                className="flex-row items-center mt-2"
              >
                <Text className="text-xs font-medium text-[#00CCBB] mr-1">
                  {showSubProducts ? "Hide Options" : "View Options"}
                </Text>
                <ChevronDownIcon
                  size={12}
                  color="#00CCBB"
                  style={{ transform: [{ rotate: showSubProducts ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            )}
          </View>

          {image && (
            <Image
              style={{ borderWidth: 1, borderColor: "#f3f3f4" }}
              source={{ uri: getImageUrl(image) }}
              className="h-24 w-24 rounded-lg"
            />
          )}
        </View>
      </TouchableOpacity>

      {showSubProducts && hasSubProducts && (
        <View className="bg-white px-4 py-3 border-t border-gray-100">
          <View className="pl-3 border-l-2 border-[#00CCBB]">
            {sub_products.map((subProduct, index) => (
              <View 
                key={subProduct.id} 
                className={`flex-row justify-between py-2 ${
                  index !== sub_products.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <Text className="text-gray-700 flex-1">{subProduct.name}</Text>
                <Text className="text-[#00CCBB] font-medium ml-2">
                  Rs.{subProduct.price}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {isPressed && (
        <View className={`bg-white px-4 pt-3 pb-4 rounded-b-2xl shadow-sm ${
          showSubProducts ? "" : "border-t border-gray-100"
        }`}>
          <View className="flex-row items-center space-x-4 justify-center">
            <TouchableOpacity
              onPress={removeItemFromBasketHandler}
              disabled={!items?.length}
              className={`${!items?.length ? "opacity-30" : ""}`}
            >
              <MinusCircleIcon
                color={items?.length > 0 ? "#00ccbb" : "gray"}
                size={40}
              />
            </TouchableOpacity>
            <Text className="font-bold text-xl text-gray-700">{items?.length || 0}</Text>
            <TouchableOpacity onPress={addItemToBasket}>
              <PlusCircleIcon size={40} color="#00ccbb" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default DishRow;
