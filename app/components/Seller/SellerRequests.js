import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import useAxios from '../../hooks/useAxios';
import SellerRequestCard from './SellerRequestCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SellerRequests = () => {
    const axios = useAxios();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/orgrequests/requests');
            setRequests(response.data.foodRequests || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRequestCard = ({ item }) => (
        <SellerRequestCard
            request={item}
            onEdit={() => console.log('Edit request:', item.id)} // Placeholder for edit functionality
            onDelete={() => console.log('Delete request:', item.id)} // Placeholder for delete functionality
        />
    );

    if (loading && requests.length === 0) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="mt-2 text-gray-500">Loading requests...</Text>
            </View>
        );
    }

    if (error && requests.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
                <Text className="mt-2 text-red-500 text-center">{error}</Text>
                <TouchableOpacity
                    className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-md"
                    onPress={fetchRequests}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800">Requests</Text>
            </View>

            {requests.length > 0 ? (
                <FlatList
                    data={requests}
                    renderItem={renderRequestCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    refreshing={loading}
                    onRefresh={fetchRequests}
                />
            ) : (
                <View className="flex-1 justify-center items-center p-5">
                    <Ionicons name="notifications-off-outline" size={50} color="#DDD" />
                    <Text className="mt-2 text-base text-gray-500">No requests available</Text>
                </View>
            )}
        </View>
    );
};

export default SellerRequests;