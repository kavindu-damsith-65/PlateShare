import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import useAxios from '../../hooks/useAxios';
import HistoryRequestCard from '../../components/organisation/HistoryRequestCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SellerHistory = () => {
    const axios = useAxios();
    const [completedSales, setCompletedSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    // TODO: Replace with actual seller ID from authentication
    const sellerId = "seller_1";

    // Fetch completed sales on initial load
    useEffect(() => {
        fetchCompletedSales();
    }, []);

    // Fetch completed sales whenever the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchCompletedSales();
            return () => {};
        }, [])
    );

    const fetchCompletedSales = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/sellerhistory/completed/${sellerId}`);
            setCompletedSales(response.data.sales);
            setError(null);
        } catch (error) {
            console.error("Error fetching completed sales:", error);
            if (error.response && error.response.status === 404) {
                setCompletedSales([]);
                setError(null);
            } else {
                setError("Failed to load completed sales. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (saleId) => {
        try {
            await axios.delete(`/api/seller/sales/${saleId}`);
            setCompletedSales(completedSales.filter(sale => sale.id !== saleId));
            Alert.alert("Success", "Sale record deleted successfully");
        } catch (error) {
            console.error("Error deleting sale:", error);
            Alert.alert("Error", "Failed to delete sale record. Please try again.");
        }
    };

    const renderItem = ({ item }) => (
        <HistoryRequestCard 
            request={item} 
            onDelete={handleDelete}
        />
    );

    if (loading && completedSales.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 pt-7">
                <View className="relative py-4 shadow-sm bg-white">
                    <Text className="text-center text-xl font-bold">Sales History</Text>
                </View>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#00CCBB" />
                    <Text className="mt-2 text-gray-500">Loading sales history...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && completedSales.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 pt-7">
                <View className="relative py-4 shadow-sm bg-white">
                    <Text className="text-center text-xl font-bold">Sales History</Text>
                </View>
                <View className="flex-1 justify-center items-center p-5">
                    <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
                    <Text className="mt-2 text-red-500 text-center">{error}</Text>
                    <TouchableOpacity 
                        className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-md"
                        onPress={fetchCompletedSales}
                    >
                        <Text className="text-white">Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-7">
            <View className="relative py-4 shadow-sm bg-white">
                <Text className="text-center text-xl font-bold">Sales History</Text>
            </View>
            
            {completedSales.length > 0 ? (
                <FlatList
                    data={completedSales}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    refreshing={loading}
                    onRefresh={fetchCompletedSales}
                />
            ) : (
                <View className="flex-1 justify-center items-center p-5">
                    <Ionicons name="checkmark-done-outline" size={50} color="#DDD" />
                    <Text className="mt-2 text-base text-gray-500">No completed sales</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default SellerHistory;