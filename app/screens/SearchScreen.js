import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  ScrollView,
  TextInput
} from 'react-native';
import { ArrowLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import SearchCategoryCircle from '../components/SearchCategoryCircle';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  // Sample categories - replace with API data in production
  useEffect(() => {
    // Sample data for now
    setCategories([
      { id: 1, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
      { id: 2, name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { id: 3, name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
      { id: 4, name: 'Pasta', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8' },
      { id: 5, name: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb' },
      { id: 6, name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e' },
      { id: 7, name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666' },
      { id: 8, name: 'Healthy', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061' },
    ]);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handleCategoryPress = (categoryName) => {
    // Set the search query to the category name and perform search
    setSearchQuery(categoryName);
    // Implement search logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-9">
      {/* Search header */}
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity 
          className="p-2 rounded-full bg-gray-100 mr-2" 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        
        {/* Search input */}
        <View className="flex-row flex-1 p-3 space-x-2 bg-gray-100 rounded-md">
          <MagnifyingGlassIcon color="gray" />
          <TextInput
            placeholder="Search for food or restaurants"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
        </View>
      </View>

      <ScrollView>
        {/* Popular categories section */}
        <View className="mb-4">
          <Text className="px-4 pt-2 pb-2 text-lg font-bold">Popular Categories</Text>
          
          {/* First row of categories */}
          <FlatList
            data={categories.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `category-1-${item.id}`}
            renderItem={({ item }) => (
              <SearchCategoryCircle 
                name={item.name} 
                imageUrl={item.image} 
                onPress={() => handleCategoryPress(item.name)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            className="mb-3"
          />
          
          {/* Second row of categories */}
          <FlatList
            data={categories.slice(4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `category-2-${item.id}`}
            renderItem={({ item }) => (
              <SearchCategoryCircle 
                name={item.name} 
                imageUrl={item.image} 
                onPress={() => handleCategoryPress(item.name)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          />
        </View>

        {/* Recent searches section */}
        <View className="mb-4">
          <Text className="px-4 pt-2 pb-2 text-lg font-bold">Recent Searches</Text>
          <View className="px-4">
            {['Pizza', 'Burger', 'Salad'].map((item, index) => (
              <TouchableOpacity 
                key={`recent-${index}`}
                className="py-3 border-b border-gray-100"
                onPress={() => handleCategoryPress(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular restaurants section */}
        <View className="mb-4">
          <Text className="px-4 pt-2 pb-2 text-lg font-bold">Popular Restaurants</Text>
          <View className="px-4">
            {['Pizza Hut', 'Burger King', 'Subway'].map((item, index) => (
              <TouchableOpacity 
                key={`restaurant-${index}`}
                className="py-3 border-b border-gray-100"
                onPress={() => handleCategoryPress(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
