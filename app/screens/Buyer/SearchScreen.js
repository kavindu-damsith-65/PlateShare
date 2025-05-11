import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ClockIcon 
} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SearchCategoryCircle = ({ name, imageUrl, onPress }) => (
  <TouchableOpacity 
    className="items-center mr-6" 
    onPress={onPress}
  >
    <Image 
      source={{ uri: imageUrl || "https://picsum.photos/100" }} 
      className="h-16 w-16 rounded-full"
    />
    <Text className="text-xs mt-1 text-center">{name}</Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/categories`);
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim().length >= 3) {
      navigation.navigate('SearchResults', { searchQuery: searchQuery.trim() });
    } else {
      // Show error or toast message
      alert('Please enter at least 3 characters to search');
    }
  };

  const handleCategoryPress = (categoryId, categoryName) => {
    navigation.navigate("CategoryResults", {
      categoryId,
      categoryName
    });
  };

  const handleRecentSearchPress = (searchTerm) => {
    setSearchQuery(searchTerm);
    navigation.navigate('SearchResults', { searchQuery: searchTerm });
  };

  const handlePopularRestaurantPress = (restaurantName) => {
    navigation.navigate('SearchResults', { searchQuery: restaurantName });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white pt-7">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00CCBB" />
          <Text className="mt-2 text-gray-500">Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-7">
      <View className="flex-row items-center space-x-2 px-4 pb-2 border-b border-gray-200">
        <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300">
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            placeholder="Search for food or restaurants"
            className="flex-1 ml-2"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <XMarkIcon color="gray" size={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          className="p-3 rounded-full bg-green-500"
          onPress={handleSearch}
        >
          <Text className="text-white font-bold">Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-4">
          <Text className="px-4 text-lg font-bold mb-3">Browse Categories</Text>
          
          {categories.length > 0 ? (
            <>
              <FlatList
                data={categories.slice(0, 4)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `category-1-${item.id}`}
                renderItem={({ item }) => (
                  <SearchCategoryCircle
                    name={item.category}
                    imageUrl={item.image}
                    onPress={() => handleCategoryPress(item.id, item.category)}
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                className="mb-3"
              />
              
              <FlatList
                data={categories.slice(4)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `category-2-${item.id}`}
                renderItem={({ item }) => (
                  <SearchCategoryCircle
                    name={item.category}
                    imageUrl={item.image}
                    onPress={() => handleCategoryPress(item.id, item.category)}
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: 15 }}
              />
            </>
          ) : (
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">No categories available</Text>
            </View>
          )}
        </View>

        {/* Recent searches section */}
        <View className="mb-4">
          <Text className="px-4 pt-2 pb-2 text-lg font-bold">Recent Searches</Text>
          <View className="px-4 flex-row flex-wrap">
            {['Pizza', 'Burger', 'Salad', 'Pasta', 'Sushi', 'Chinese', 'Indian', 'Mexican', 'Thai'].map((item, index) => (
              <TouchableOpacity 
                key={`recent-${index}`}
                className="mr-3 mb-3 px-3 py-2 bg-gray-100 rounded-full flex-row items-center"
                onPress={() => handleRecentSearchPress(item)}
              >
                <ClockIcon size={16} color="#00CCBB" />
                <Text className="ml-1 text-gray-700">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular restaurants section */}
        <View className="mb-4">
          <Text className="px-4 pt-2 pb-2 text-lg font-bold">Popular Restaurants</Text>
          <View className="px-4 flex-row flex-wrap">
            {['Pizza Hut', 'Burger King', 'Subway', 'KFC', 'Domino\'s', 'McDonald\'s', 'Taco Bell', 'Wendy\'s'].map((item, index) => (
              <TouchableOpacity 
                key={`restaurant-${index}`}
                className="mr-3 mb-3 px-3 py-2 bg-gray-100 rounded-full flex-row items-center"
                onPress={() => handlePopularRestaurantPress(item)}
              >
                <ClockIcon size={16} color="#00CCBB" />
                <Text className="ml-1 text-gray-700">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
