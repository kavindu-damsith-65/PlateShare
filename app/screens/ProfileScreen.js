import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {XMarkIcon} from "react-native-heroicons/solid";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const ProfileScreen = ({ visible, onClose, isLoggedIn, user }) => {
//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={visible}
//             onRequestClose={onClose}
//         >
//             <View className="flex-1 justify-end items-end bg-black bg-opacity-10">
//                 <View className="w-4/5 h-full bg-white p-5">
//                     {isLoggedIn ? (
//                         <>
//                             <Image source={{ uri: user.image }} className="w-24 h-24 rounded-full mb-5" />
//                             <Text className="text-2xl font-bold mb-2">{user.name}</Text>
//                             <Text className="text-lg text-gray-500 mb-5">{user.email}</Text>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Link 1</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Link 2</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Link 3</Text>
//                             </TouchableOpacity>
//                         </>
//                     ) : (
//                         <>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Login</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Register</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={onClose}>
//                                 <Text className="text-lg text-[#00CCBB] mb-2">Contact</Text>
//                             </TouchableOpacity>
//                         </>
//                     )}
//                 </View>
//             </View>
//         </Modal>
//     );
// };

const  ProfileScreen = () => {
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
                <Text style={{ fontSize: 30 }}>This is a modal!</Text>
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            {/*<TouchableOpacity onPress={() => navigation.goBack()}>*/}
            {/*    <XMarkIcon color="#fff" size={30} />*/}
            {/*</TouchableOpacity>*/}
        </View>
    );
};
export default ProfileScreen;

const styles = {
    logoutButton: {
        backgroundColor: '#FF6B6B',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
};
