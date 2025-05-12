import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

const RecommendCard = ({ imgUrl, title }) => {
  return (
    <TouchableOpacity className="relative items-center mr-2">
      <Image
        source={{ uri: imgUrl }}
        className="w-20 h-20 rounded-full"
      />
      <Text className="mt-2 text-xs font-bold text-gray-700 left-1">{title}</Text>
    </TouchableOpacity>
  );
};

export default RecommendCard;
