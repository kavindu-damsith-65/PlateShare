import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ onSearch, className, editable = true }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigation = useNavigation();

  const placeholders = [
    "Find something delicious...",
    "Craving pizza?",
    "Hungry for burgers?",
    "Looking for healthy options?",
    "Discover local restaurants"
  ];

  // Rotate through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => 
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    // Navigate to search screen when the search bar is clicked
    navigation.navigate('SearchScreen');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={editable}
      className={`flex-row items-center pb-2 mx-4 space-x-2 ${className}`}
    >
      <View className="flex-row flex-1 p-3 space-x-2 bg-gray-100 rounded-md">
        <MagnifyingGlassIcon color="gray" />
        <TextInput
          placeholder={placeholders[placeholderIndex]}
          keyboardType="default"
          onChangeText={onSearch}
          editable={editable}
          pointerEvents={editable ? "auto" : "none"}
        />
      </View>
      <AdjustmentsVerticalIcon color="#00CCBB" />
    </TouchableOpacity>
  );
};

export default SearchBar;
