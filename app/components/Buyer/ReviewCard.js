import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";

const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <View className="p-4 mt-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold">{review.user.name}</Text>
      <Text className="text-gray-500">{review.description}</Text>
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row">
          {Array.from({ length: review.rating }, (_, index) => (
            <StarIcon key={index} size={20} color="#00CCBB" opacity={0.5} />
          ))}
        </View>
        <View className="flex-row justify-end space-x-2">
        <TouchableOpacity
          className="bg-gray-200 px-3 py-1.5 rounded"
          onPress={() => onEdit(review)}
        >
          <Text className="text-xs font-medium text-gray-800">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#FF6B6B] px-3 py-1.5 rounded"
          onPress={() => onDelete(review.id)}
        >
          <Text className="text-xs font-medium text-white">Delete</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default ReviewCard;