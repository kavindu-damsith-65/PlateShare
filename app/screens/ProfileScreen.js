import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {XMarkIcon} from "react-native-heroicons/solid";


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

    return (
        <View className="flex-1 justify-end items-end bg-black bg-opacity-10">
            <View className="w-4/5 h-full bg-white p-5">
                <Text style={{ fontSize: 30 }}>This is a modal!</Text>

            </View>
            {/*<TouchableOpacity onPress={() => navigation.goBack()}>*/}
            {/*    <XMarkIcon color="#fff" size={30} />*/}
            {/*</TouchableOpacity>*/}
        </View>
    );
};
export default ProfileScreen;
