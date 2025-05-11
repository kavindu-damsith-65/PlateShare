import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SearchResultsScreen = ({ route }) => {
  const { searchQuery } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  
  // TODO: Replace with actual user location
  const location = "Buyer Location 1";

  useEffect(() => {
    // Only search if query is at least 3 characters
    if (searchQuery.length < 3) {
      setLoading(false);
      setError("Please enter at least 3 characters to search");
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/products/search/${searchQuery}/${location}`
        );
        
        if (response.data) {
          const fetchedRestaurants = response.data.restaurants || [];
          const fetchedProducts = response.data.products || [];
          
          setRestaurants(fetchedRestaurants);
          setProducts(fetchedProducts);
          
          console.log("Fetched restaurants:", fetchedRestaurants.length);
          console.log("Fetched products:", fetchedProducts.length);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, location]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("Restaurant", {
          id: item.id,
          imgUrl: item.image,
          title: item.name,
          rating: item.averageRating || 4.5,
          short_description: item.description,
          long: item.long || 0,
          lat: item.lat || 0,
        });
      }}
    >
      <Image 
        source={{ uri: item.image || "https://picsum.photos/400/300" }} 
        className="w-32 h-32"
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.description || "Delicious food from this restaurant"}
        </Text>
        <View className="mt-2">
          <Text className="text-xs text-green-700">1.2 km away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("Restaurant", {
          id: item.restaurant_id,
          imgUrl: item.restaurant?.image,
          title: item.restaurant?.name,
          rating: 4.5,
          short_description: "Restaurant with this product",
          highlightedProductId: item.id
        });
      }}
    >
      <Image 
        source={{ uri: item.image || "https://picsum.photos/400/300" }} 
        className="w-32 h-32"
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.description || "Delicious food item"}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-bold text-green-600">
            {item.price === 0 ? "Free" : `Rs. ${item.price}`}
          </Text>
          <Text className="text-xs text-gray-500">
            {item.restaurant?.name || "Restaurant"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <TouchableOpacity
            className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
          <Text className="text-center text-xl font-bold">Searching for "{searchQuery}"</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00CCBB" />
          <Text className="mt-2 text-gray-500">Searching...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <TouchableOpacity
            className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
          <Text className="text-center text-xl font-bold">Search</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity 
            className="mt-4 py-2 px-4 bg-green-500 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const noResultsMessage = (
    <View className="flex-1 items-center justify-center py-10">
      <Text className="text-gray-500">No results found for "{searchQuery}"</Text>
      <TouchableOpacity 
        className="mt-4 py-2 px-4 bg-green-500 rounded-full"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white font-bold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-7">
      <View className="relative py-4 shadow-sm bg-white">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold">Results for "{searchQuery}"</Text>
      </View>

      {restaurants.length === 0 && products.length === 0 ? (
        noResultsMessage
      ) : (
        <FlatList
          data={[
            ...(restaurants.length > 0 ? [{ type: 'header', id: 'restaurants-header', title: 'Restaurants' }] : []),
            ...restaurants.map(item => ({ type: 'restaurant', ...item })),
            ...(products.length > 0 ? [{ type: 'header', id: 'products-header', title: 'Food Items' }] : []),
            ...products.map(item => ({ type: 'product', ...item })),
          ]}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View className="px-4 pt-6 pb-2">
                  <Text className="text-lg font-bold">{item.title}</Text>
                </View>
              );
            } else if (item.type === 'restaurant') {
              return renderRestaurantItem({ item });
            } else {
              return renderProductItem({ item });
            }
            return null;
          }}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">No results found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
