import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import { XMarkIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ onSearch, className = "", editable = true, initialValue = "" }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchText, setSearchText] = useState(initialValue || "");
  const navigation = useNavigation();

  const placeholders = [
    "Find something delicious... 🍽️",
    "Craving pizza? 🍕",
    "Hungry for burgers? 🍔",
    "Looking for healthy options? 🥗",
    "Discover local restaurants 🏙️🍴"
  ];

  useEffect(() => {
    // Update searchText when value changes
    if (initialValue !== searchText) {
      setSearchText(initialValue || "");
    }
  }, [initialValue]);

  // Rotate through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => 
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    if (!editable) {
      navigation.navigate('SearchScreen');
    }
  };

  const handleChangeText = (text) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClearText = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <View className={`flex-row items-center pb-2 mx-4 space-x-2 ${className}`}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={editable}
        className="flex-1"
      >
        <View className="flex-row items-center p-3 bg-gray-100 rounded-full border border-gray-300">
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            placeholder={placeholders[placeholderIndex]}
            keyboardType="default"
            value={searchText}
            onChangeText={handleChangeText}
            editable={editable}
            className="flex-1 ml-2"
          />
          {searchText && searchText.length > 0 && editable && (
            <TouchableOpacity onPress={handleClearText}>
              <XMarkIcon color="gray" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <AdjustmentsVerticalIcon color="#00CCBB" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
