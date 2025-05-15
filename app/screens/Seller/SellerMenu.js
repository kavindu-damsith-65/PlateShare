import React, { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

const SellerMenu = () => {
    const axios = useAxios();
    const restaurantId = "restaurant_user_2";  // Replace with actual restaurant ID
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/products/seller/${restaurantId}`);
                if (response.status === 200) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };
        fetchData();
    }, [restaurantId]);
    console.log('Products:', products);
    const renderSubProducts = (subProducts) => {
        if (!subProducts || subProducts.length === 0) return null;
        
        return (
            <View className="mt-2 pl-4 border-l-2 border-gray-200">
                <Text className="text-sm font-semibold text-gray-600 mb-1">Sub Products:</Text>
                {subProducts.map((sub) => (
                    <View key={sub.id} className="flex-row justify-between items-center py-1">
                        <Text className="text-sm text-gray-600">{sub.name}</Text>
                        <Text className="text-sm text-gray-600">${sub.price}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderMenuItem = ({ item }) => (
        <View className="p-4 rounded-lg bg-white mb-3 shadow-sm border border-gray-100">
            <View className="flex-row">
                <Image 
                    source={{ uri: item.image }} 
                    className="w-20 h-20 rounded-lg mr-3"
                />
                <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold">{item.name}</Text>
                        <View className="bg-gray-100 px-2 py-1 rounded">
                            <Text className="text-sm text-gray-600">{item.category.category}</Text>
                        </View>
                    </View>
                    <Text className="text-base text-green-600 font-semibold mt-1">${item.price}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
                    <View className="flex-row mt-2">
                        <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                            <Text className="text-xs text-blue-600">Stock: {item.quantity}</Text>
                        </View>
                        <View className={`px-2 py-1 rounded ${item.available ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Text className={`text-xs ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                                {item.available ? 'Available' : 'Unavailable'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            
            {renderSubProducts(item.sub_products)}
            
            <View className="flex-row mt-3 pt-3 border-t border-gray-100">
                <TouchableOpacity 
                    className="bg-blue-500 p-2 rounded-md mr-2 flex-1 items-center"
                    onPress={() => console.log('Edit item:', item.id)}
                >
                    <Text className="text-white text-sm">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="bg-red-500 p-2 rounded-md flex-1 items-center"
                    onPress={() => console.log('Delete item:', item.id)}
                >
                    <Text className="text-white text-sm">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-4 bg-white shadow-sm">
                <Text className="text-2xl font-bold">My Menu</Text>
                <TouchableOpacity 
                    className="bg-green-500 p-3 rounded-lg mt-4 items-center"
                    onPress={() => console.log('Add new item')}
                >
                    <Text className="text-white text-base font-bold">+ Add New Item</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                className="flex-1 p-4"
                data={products}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default SellerMenu;
