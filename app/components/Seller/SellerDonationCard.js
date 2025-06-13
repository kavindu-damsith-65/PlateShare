import { View, Text, Image } from 'react-native';

const SellerDonationCard = ({ donation }) => {
    return (
        <View className="flex-row items-center bg-white rounded-lg shadow p-3 mb-3">
            <Image
                source={{ uri: donation.product?.image }}
                className="w-14 h-14 rounded-full mr-4"
                resizeMode="cover"
            />
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">{donation.product?.name}</Text>
                <Text className="text-gray-600 text-sm">Quantity: <Text className="font-semibold">{donation.quantity}</Text></Text>
                <Text className="text-xs text-gray-400 mt-1">
                    Donated on: {new Date(donation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            </View>
        </View>
    );
};

export default SellerDonationCard;