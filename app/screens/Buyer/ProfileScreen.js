import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userRole');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View className="flex-1 justify-end items-end bg-black bg-opacity-10">
            <View className="w-4/5 h-full bg-white p-5">
                <Text className="text-3xl">This is a modal!</Text>
                <TouchableOpacity 
                    className="bg-[#FF6B6B] p-4 rounded-lg items-center mt-5"
                    onPress={handleLogout}
                >
                    <Text className="text-white font-bold text-base">Logout</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default ProfileScreen;
