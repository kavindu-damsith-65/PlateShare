import React, {useState} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Menu from '../../components/Seller/Menu';
import AddMenuItemForm from '../../components/Seller/AddMenuItemForm';

const SellerMenu = () => {
    const restaurantId = "restaurant_user_2";  // Get Restaurand ID from session

    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {!showAddForm ? (
                <>
                    <View className="pt-7">
                        <View className="p-4 bg-white shadow-sm">
                            <Text className="text-2xl font-bold">My Menu</Text>
                        </View>
                    </View>
                    <View className="mt-4">
                        <Menu 
                            restaurantId={restaurantId}
                        />
                    </View>
                    <TouchableOpacity 
                        className="absolute bottom-6 right-6 bg-green-700 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                        onPress={() => setShowAddForm(true)}
                    >
                        <Text className="text-white text-2xl font-light">+</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <AddMenuItemForm 
                    restaurantId={restaurantId}
                    onClose={() => setShowAddForm(false)}
                />
            )}
        </SafeAreaView>
    );
};

export default SellerMenu;