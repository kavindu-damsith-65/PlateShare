import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SellerRequestCard = ({ request, onEdit, onDelete }) => {
    const navigation = useNavigation();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    return (
        <View className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            <TouchableOpacity
                className="p-4"
                activeOpacity={0.7}
                onPress={() => navigation.navigate("SellerRequestDetails", { requestId: request.id })}
            >
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold text-gray-800">{request.title}</Text>
                    {request.urgent ? (
                        <View className="bg-red-100 px-2 py-1 rounded-full">
                            <Text className="text-xs font-medium text-red-800">Urgent</Text>
                        </View>
                    ) : (
                        <View className="bg-yellow-100 px-2 py-1 rounded-full">
                            <Text className="text-xs font-medium text-yellow-600">General</Text>
                        </View>
                    )}
                </View>

                <Text className="text-gray-600 mb-2">
                    Needs: {request.products}
                </Text>

                <Text className="text-gray-500 mb-2">Quantity: {request.quantity}</Text>

                {request.notes && (
                    <Text className="text-gray-500 mb-2 italic">"{request.notes}"</Text>
                )}

                <View className="flex-row mb-3">
                    {request.delivery && (
                        <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                            <Text className="text-xs font-medium text-blue-800">Delivery Needed</Text>
                        </View>
                    )}
                    <View className={`px-2 py-1 rounded-full ${request.visibility ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs font-medium ${request.visibility ? 'text-green-800' : 'text-gray-800'}`}>
                            {request.visibility ? 'Public' : 'Private'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                        Needed by: {formatDate(request.dateTime)}
                    </Text>

                    {/* Action buttons */}
                    <View className="flex-row justify-end space-x-2">
                        <TouchableOpacity
                            className="bg-green-100 px-3 py-2 rounded-md flex-row items-center"
                            onPress={() => navigation.navigate('Donate', { requestId: request.id })}
                        >
                            <Text className="text-green-800 font-medium ml-1">Donate</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {request.donations && request.donations.length > 0 && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                        <Text className="text-xs font-medium text-gray-700 mb-2">
                            Donations ({request.donations.length}):
                        </Text>
                        <View className="flex-row">
                            {request.donations.slice(0, 3).map((donation, index) => (
                                <View key={donation.id} className="mr-2 items-center">
                                    <Image
                                        source={{ uri: donation.product.image }}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <Text className="text-xs text-center mt-1">{donation.quantity}x</Text>
                                </View>
                            ))}
                            {request.donations.length > 3 && (
                                <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                                    <Text className="text-xs font-medium text-gray-600">
                                        +{request.donations.length - 3}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </TouchableOpacity>


        </View>
    );
};

export default SellerRequestCard;
