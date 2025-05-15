import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Menu from '../../components/Seller/Menu';

const SellerMenu = () => {
    const restaurantId = "restaurant_user_2";  // Replace with actual restaurant ID

    const handleEditItem = (itemId) => {
        console.log('Edit item:', itemId);
    };

    const handleDeleteItem = (itemId) => {
        console.log('Delete item:', itemId);
    };

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
            <Menu 
                restaurantId={restaurantId}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
            />
        </View>
    );
};

export default SellerMenu;