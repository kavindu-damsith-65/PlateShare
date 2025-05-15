import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { ClockIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';
import SearchBar from '../../components/Buyer/SearchBar';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SearchCategoryCircle = ({ name, imageUrl, onPress }) => (
  <TouchableOpacity 
    className="items-center mr-3" 
    style={{ width: 70 }}
    onPress={onPress}
  >
    <View className="relative">
      {/* Image with shadow and border effect */}
      <View 
        className="rounded-full" 
        style={{ 
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="p-[1.5px] rounded-full bg-white">
          <View className="p-[0.5px] rounded-full bg-[#00CCBB10]">
            <Image
              source={{ uri: imageUrl || "https://picsum.photos/100" }}
              className="w-16 h-16 rounded-full"
              style={{ borderWidth: 0.5, borderColor: "#00CCBB20" }}
            />
          </View>
        </View>
      </View>
      
      {/* Highlight effect */}
      <View 
        className="absolute top-0 left-0 w-16 h-8 rounded-t-full" 
        style={{ 
          backgroundColor: "rgba(255,255,255,0.15)",
          transform: [{ scaleX: 1 }]
        }} 
      />
    </View>
    
    {/* Title with better typography */}
    <Text 
      className="mt-1 text-xs font-medium text-center" 
      style={{ color: "#404040" }} 
      numberOfLines={1}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const axios = useAxios();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  
  // TODO: Replace with actual user location
  const location = "Buyer Location 1";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/products/categories`);
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

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const delaySearch = setTimeout(() => {
      if (searchQuery.length >= 3) {
        performSearch();
      } else {
        setSearchResults({ restaurants: [], products: [] });
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async () => {
    if (searchQuery.length < 3) return;
    
    setSearchLoading(true);
    try {
      const response = await axios.get(
        `/api/products/search/${searchQuery}/${location}`
      );
      
      if (response.data) {
        setSearchResults({
          restaurants: response.data.restaurants || [],
          products: response.data.products || []
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCategoryPress = (categoryId, categoryName) => {
    navigation.navigate("CategoryResults", {
      categoryId,
      categoryName
    });
  };

  const handleRecentSearchPress = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const handlePopularRestaurantPress = (restaurantName) => {
    setSearchQuery(restaurantName);
  };

  const handleResultPress = (item, type) => {
    if (type === 'restaurant') {
      navigation.navigate("Restaurant", {
        id: item.id,
        imgUrl: item.image,
        title: item.name,
        rating: item.averageRating || 4.5,
        short_description: item.description,
        long: item.long || 0,
        lat: item.lat || 0,
      });
    } else {
      navigation.navigate("Restaurant", {
        id: item.restaurant_id,
        imgUrl: item.restaurant?.image,
        title: item.restaurant?.name,
        rating: 4.5,
        short_description: "Restaurant with this product",
        highlightedProductId: item.id
      });
    }
  };

  const renderSearchResults = () => {
    const { restaurants, products } = searchResults;
    const hasResults = restaurants.length > 0 || products.length > 0;

    if (searchLoading) {
      return (
        <View className="items-center justify-center py-4">
          <ActivityIndicator size="small" color="#00CCBB" />
          <Text className="text-gray-500 mt-2">Searching...</Text>
        </View>
      );
    }

    if (searchQuery.length > 0 && searchQuery.length < 3) {
      return (
        <View className="items-center justify-center py-4">
          <Text className="text-yellow-600">Please enter at least 3 characters to search</Text>
        </View>
      );
    }

    if (searchQuery.length >= 3 && !hasResults) {
      return (
        <View className="items-center justify-center py-4">
          <Text className="text-gray-500">No results found for "{searchQuery}"</Text>
        </View>
      );
    }

    if (!hasResults) return null;

    return (
      <View className="border-t border-gray-200 pt-2">
        {restaurants.length > 0 && (
          <View>
            <Text className="px-4 font-bold text-lg mb-2">Restaurants</Text>
            {restaurants.slice(0, 3).map((item) => (
              <TouchableOpacity 
                key={`restaurant-${item.id}`}
                className="flex-row mx-4 mb-3 p-2 bg-white rounded-lg shadow-sm"
                onPress={() => handleResultPress(item, 'restaurant')}
              >
                <Image 
                  source={{ uri: ite.m.image || "https://picsum.photos/100" }} 
                  className="w-16 h-16 rounded-md"
                />
                <View className="ml-2 flex-1">
                  <Text className="font-bold" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {restaurants.length > 3 && (
              <TouchableOpacity 
                className="items-center py-2"
                onPress={() => navigation.navigate('SearchResults', { searchQuery })}
              >
                <Text className="text-[#00CCBB] font-bold">See all {restaurants.length} restaurants</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {products.length > 0 && (
          <View className="mt-2">
            <Text className="px-4 font-bold text-lg mb-2">Food Items</Text>
            {products.slice(0, 3).map((item) => (
              <TouchableOpacity 
                key={`product-${item.id}`}
                className="flex-row mx-4 mb-3 p-2 bg-white rounded-lg shadow-sm"
                onPress={() => handleResultPress(item, 'product')}
              >
                <Image 
                  source={{ uri: item.image || "https://picsum.photos/100" }} 
                  className="w-16 h-16 rounded-md"
                />
                <View className="ml-2 flex-1">
                  <Text className="font-bold" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>{item.description}</Text>
                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-[#00CCBB] font-bold">Rs. {item.price}</Text>
                    <Text className="text-xs">{item.restaurant?.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {products.length > 3 && (
              <TouchableOpacity 
                className="items-center py-2"
                onPress={() => navigation.navigate('SearchResults', { searchQuery })}
              >
                <Text className="text-[#00CCBB] font-bold">See all {products.length} food items</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {hasResults && (
          <TouchableOpacity 
            className="mx-4 mt-2 mb-4 py-3 bg-[#00CCBB] rounded-full items-center"
            onPress={() => navigation.navigate('SearchResults', { searchQuery })}
          >
            <Text className="text-white font-bold">View All Results</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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
      <View className="pb-2 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 ml-2 bg-gray-100 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
          <View className="flex-1">
            <SearchBar onSearch={handleSearch} editable={true} />
          </View>
        </View>
      </View>

      {renderSearchResults()}

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
