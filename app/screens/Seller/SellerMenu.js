import React, { useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const SellerMenu = () => {
    const axios = useAxios();
    const restaurantId = "restaurant_user_2"; // TODO: Replace with actual restaurant ID from authentication
    const { data, loading, error } = axios.get(`/api/restaurants/restaurant/${restaurantId}`);
    console.log("Menu data:", data);

    const renderMenuItem = ({ item }) => (
        <View className="p-4 rounded-lg bg-gray-100 mb-3">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-base text-gray-600 mt-1">${item.price}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
            <View className="flex-row mt-3">
                <TouchableOpacity 
                    className="bg-blue-500 p-2 rounded-md mr-2 min-w-[70px] items-center"
                    onPress={() => console.log('Edit item:', item.id)}
                >
                    <Text className="text-white text-sm">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="bg-red-500 p-2 rounded-md min-w-[70px] items-center"
                    onPress={() => console.log('Delete item:', item.id)}
                >
                    <Text className="text-white text-sm">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading menu items</Text>;

    return (
        <View className="flex-1 p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">My Menu</Text>
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-lg mb-4 items-center"
                onPress={() => console.log('Add new item')}
            >
                <Text className="text-white text-base font-bold">+ Add New Item</Text>
            </TouchableOpacity>
            <FlatList
                className="flex-1"
                data={data}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default SellerMenu;
