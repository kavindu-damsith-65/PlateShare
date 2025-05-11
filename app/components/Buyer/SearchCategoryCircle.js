import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const SearchCategoryCircle = ({ name, imageUrl, onPress }) => {
  return (
    <TouchableOpacity 
      className="items-center mr-4" 
      onPress={onPress}
    >
      <View className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-xs mt-1 text-center">{name}</Text>
    </TouchableOpacity>
  );
};

export default SearchCategoryCircle;