import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Image, LayoutAnimation, Platform, UIManager } from "react-native";
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon } from "react-native-heroicons/solid";
import useAxios from '../../hooks/useAxios';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const restaurantId = "restaurant_user_2";

export default function SellerOrders({ navigation }) {
    const axios = useAxios();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buyerDetails, setBuyerDetails] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    axios.get(`/api/orders/${restaurantId}`),
                    axios.get(`/api/products/seller/${restaurantId}`),
                ]);
                setOrders(ordersRes.data.orders || []);
                setProducts(productsRes.data.products || []);
                setError(null);
            } catch (err) {
                setError("Failed to load orders or products.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Fetch buyer details on demand
    const fetchBuyer = async (userId) => {
        if (buyerDetails[userId]) return; // Already fetched
        try {
            const res = await axios.get(`/api/user/buyer/${userId}`);
            setBuyerDetails(prev => ({ ...prev, [userId]: res.data.buyer }));
        } catch (e) {
            setBuyerDetails(prev => ({ ...prev, [userId]: { name: 'Unknown', email: '' } }));
        }
    };

    const toggleExpand = async (orderId, userId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => ({ ...prev, [orderId]: !prev[orderId] }));
        if (!buyerDetails[userId]) await fetchBuyer(userId);
    };

    const handleReady = (orderId) => {
        // Here you would call your API to mark as completed
        console.log(`Order ${orderId} marked as completed.`);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="mt-4 text-gray-500">Loading orders...</Text>
            </SafeAreaView>
        );
    }
    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text className="text-red-500">{error}</Text>
                <TouchableOpacity
                    className="mt-4 bg-[#00CCBB] px-4 py-2 rounded"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Map productId to product details
    const productMap = {};
    products.forEach((p) => { productMap[p.id] = p; });

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="relative py-4 shadow-sm bg-white">
                <TouchableOpacity
                    className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeftIcon size={20} color="#00CCBB" />
                </TouchableOpacity>
                <Text className="text-center text-xl font-bold text-[#00CCBB]">Orders</Text>
            </View>
            <ScrollView className="flex-1 p-4">
                {orders.length === 0 ? (
                    <View className="bg-white rounded-lg p-6 items-center mt-10 shadow">
                        <Text className="text-gray-500 text-lg">No orders yet.</Text>
                    </View>
                ) : (
                    orders.map(order => {
                        const isAccepted = order.status === 1;
                        const isExpanded = expanded[order.id];
                        const buyer = buyerDetails[order.user_id] || {};
                        return (
                            <View key={order.id} className="bg-white rounded-xl shadow mb-6 p-4">
                                <TouchableOpacity onPress={() => toggleExpand(order.id, order.user_id)} className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-lg font-bold text-gray-800">Order #{order.id}</Text>
                                        <Text className="text-xs text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</Text>
                                        <Text className="text-xs text-gray-500">Buyer: {buyer.name || '...'}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        {isAccepted && <Text className="text-green-600 font-bold mr-2">Accepted</Text>}
                                        {isExpanded ? (
                                            <ChevronUpIcon size={22} color="#00CCBB" />
                                        ) : (
                                            <ChevronDownIcon size={22} color="#00CCBB" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                {isExpanded && (
                                    <View className="mt-4">
                                        <Text className="text-base font-semibold text-gray-700 mb-2">Products:</Text>
                                        {order.foodBucketProducts.map((item) => {
                                            const prod = productMap[item.product_id] || {};
                                            return (
                                                <View key={item.id} className="flex-row items-center mb-2">
                                                    <Image
                                                        source={{ uri: prod.image }}
                                                        className="w-10 h-10 rounded-full mr-3"
                                                        style={{ borderWidth: 1, borderColor: '#00CCBB' }}
                                                    />
                                                    <View className="flex-1">
                                                        <Text className="text-gray-800 font-medium">{prod.name || item.product_id}</Text>
                                                        <Text className="text-xs text-gray-500">Quantity: {item.quantity}</Text>
                                                        <Text className="text-xs text-gray-500">Price: {prod.price ? `$${prod.price}` : '-'}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                        <View className="mt-4">
                                            <Text className="text-gray-700 font-semibold">Order Total: <Text className="text-[#00CCBB]">${order.price}</Text></Text>
                                            <Text className="text-xs text-gray-500">Status: {isAccepted ? 'Accepted' : 'Pending/Completed'}</Text>
                                            <Text className="text-xs text-gray-500">Buyer Email: {buyer.email || '...'}</Text>
                                        </View>
                                        {isAccepted && (
                                            <TouchableOpacity
                                                className="mt-4 bg-green-500 px-4 py-2 rounded flex-row items-center justify-center"
                                                onPress={() => handleReady(order.id)}
                                            >
                                                <CheckCircleIcon size={20} color="#fff" />
                                                <Text className="text-white font-bold ml-2">Mark as Ready</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
