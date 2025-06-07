import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubProducts = ({ subProducts }) => {
    if (!subProducts || subProducts.length === 0) return null;
    
    return (
        <View className="mt-3 pl-4 border-l-2 border-gray-100">
            {subProducts.map((sub) => (
                <View key={sub.id} className="flex-row justify-between py-1">
                    <Text className="text-gray-600 text-sm">{sub.name}</Text>
                    <Text className="text-gray-600 text-sm">${sub.price}</Text>
                </View>
            ))}
        </View>
    );
};

const MenuItem = ({ item, isExpanded, onPress, onEditItem, onDeleteItem }) => {
    return (
        <View className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
            <TouchableOpacity 
                onPress={onPress}
                className="flex-1"
            >
                <View className="p-3 flex-row">
                    <Image 
                        source={{ uri: item.image }} 
                        className="w-20 h-20 rounded-lg"
                    />
                    <View className="flex-1 ml-3 justify-between">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <Text className="text-base font-bold">{item.name}</Text>
                                <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                                    {item.description}
                                </Text>
                            </View>
                            <View className="flex-row items-center ml-2">
                                <TouchableOpacity 
                                    onPress={() => onEditItem(item.id)}
                                    className="p-2"
                                >
                                    <Ionicons name="pencil" size={16} color="#666" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => onDeleteItem(item.id)}
                                    className="p-2"
                                >
                                    <Ionicons name="trash-outline" size={16} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row justify-between items-center mt-2">
                            <Text className="text-green-600 font-bold">${item.price}</Text>
                            <View className={`px-2 py-1 rounded
                                ${item.available ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-xs
                                    ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.available ? 'Available' : 'Unavailable'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                {isExpanded && (
                    <View className="px-3 pb-3 border-t border-gray-100 mt-2 pt-3">
                        <View className="flex-row">
                            <View className="bg-gray-100 px-2 py-1 rounded mr-2">
                                <Text className="text-xs text-gray-600">{item.category.category}</Text>
                            </View>
                            <View className="bg-blue-100 px-2 py-1 rounded">
                                <Text className="text-xs text-blue-600">Stock: {item.quantity}</Text>
                            </View>
                        </View>
                        <SubProducts subProducts={item.sub_products} />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default MenuItem;