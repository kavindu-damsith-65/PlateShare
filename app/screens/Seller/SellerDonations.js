import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { PieChart } from 'react-native-chart-kit';
import useAxios from "../../hooks/useAxios";

// Helper to group donations by product
function groupDonationsByProduct(donations) {
    const grouped = {};
    donations.forEach((donation) => {
        const pid = donation.product_id;
        if (!grouped[pid]) {
            grouped[pid] = {
                product: donation.product,
                totalDonated: 0,
                donations: [],
            };
        }
        grouped[pid].totalDonated += donation.quantity;
        grouped[pid].donations.push(donation);
    });
    return Object.values(grouped);
}

export default function SellerDonations({ navigation }) {
    const restaurantId = "restaurant_user_2";
    const axios = useAxios();
    const [donations, setDonations] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                console.log("Fetching donations and products for restaurant:", restaurantId);
                const [donRes, prodRes] = await Promise.all([
                    axios.get(`/api/donations/${restaurantId}`),
                    axios.get(`/api/products/seller/${restaurantId}`),
                ]);
                setDonations(donRes.data.donations || []);
                setProducts(prodRes.data.products || []);
                setError(null);
            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="mt-4 text-gray-500">Loading donations and products...</Text>
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

    // Group donations by product
    const groupedDonations = groupDonationsByProduct(donations);

    // Map productId to available quantity
    const productMap = {};
    products.forEach((p) => {
        productMap[p.id] = p;
    });

    // Pie chart data: Donated vs Available
    const totalDonated = groupedDonations.reduce((sum, g) => sum + g.totalDonated, 0);
    const totalAvailable = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const pieData = [
        {
            name: 'Donated',
            quantity: totalDonated,
            color: '#00CCBB',
            legendFontColor: '#222',
            legendFontSize: 14,
        },
        {
            name: 'Available',
            quantity: totalAvailable,
            color: '#facc15',
            legendFontColor: '#222',
            legendFontSize: 14,
        },
    ].filter(d => d.quantity > 0);

    // Price-wise sum (assuming product.price exists)
    let totalDonatedValue = 0;
    groupedDonations.forEach(group => {
        const price = productMap[group.product.id]?.price || 0;
        totalDonatedValue += group.totalDonated * price;
    });
    totalDonatedValue = totalDonatedValue.toFixed(2);

    // Number of unique requests (food_request_id)
    const uniqueRequests = new Set(donations.map(d => d.food_request_id)).size;
    // Number of donation actions
    const totalDonations = donations.length;

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-12">
            <View className="relative py-4 shadow-sm bg-white">
                <TouchableOpacity
                    className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeftIcon size={20} color="#00CCBB" />
                </TouchableOpacity>
                <Text className="text-center text-xl font-bold text-[#00CCBB]">Your Donations Overview</Text>
            </View>
            <ScrollView className="flex-1 p-4">
                {/* Pie Chart and Stats */}
                <View className="bg-white rounded-xl shadow p-4 mb-6 items-center">
                    <Text className="text-lg font-bold text-gray-800 mb-2">Summary</Text>
                    <PieChart
                        data={pieData.map(d => ({
                            name: d.name,
                            population: d.quantity,
                            color: d.color,
                            legendFontColor: d.legendFontColor,
                            legendFontSize: d.legendFontSize,
                        }))}
                        width={Dimensions.get('window').width - 64}
                        height={160}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                    <View className="flex-row justify-between w-full mt-4">
                        <View className="flex-1 bg-[#00CCBB]/10 rounded-lg p-3 mx-1 items-center">
                            <Text className="text-lg font-bold text-[#00CCBB]">{totalDonatedValue.toLocaleString(undefined, { style: 'currency', currency: 'LKR' })}</Text>
                            <Text className="text-xs text-gray-600 mt-1">Total Value Donated</Text>
                        </View>
                        <View className="flex-1 bg-yellow-100 rounded-lg p-3 mx-1 items-center">
                            <Text className="text-lg font-bold text-yellow-600">{uniqueRequests}</Text>
                            <Text className="text-xs text-gray-600 mt-1">Unique Requests</Text>
                        </View>
                        <View className="flex-1 bg-indigo-100 rounded-lg p-3 mx-1 items-center">
                            <Text className="text-lg font-bold text-indigo-600">{totalDonations}</Text>
                            <Text className="text-xs text-gray-600 mt-1">Total Donations</Text>
                        </View>
                    </View>
                </View>
                {/* Product Cards */}
                {products.length === 0 ? (
                    <View className="bg-white rounded-lg p-6 items-center mt-10 shadow">
                        <Text className="text-gray-500 text-lg">No products found.</Text>
                    </View>
                ) : (
                    products.map((product) => {
                        const group = groupedDonations.find(g => g.product.id === product.id);
                        const donated = group ? group.totalDonated : 0;
                        const available = product.quantity;
                        const total = donated + available;
                        const percentDonated = total > 0 ? (donated / total) * 100 : 0;
                        return (
                            <View
                                key={product.id}
                                className="bg-white rounded-xl shadow mb-6 p-4"
                                style={{ elevation: 2 }}
                            >
                                <View className="flex-row items-center mb-3">
                                    <Image
                                        source={{ uri: product.image }}
                                        className="w-16 h-16 rounded-full mr-4"
                                        style={{ borderWidth: 2, borderColor: "#00CCBB" }}
                                    />
                                    <View className="flex-1">
                                        <Text className="text-xl font-bold text-gray-800">{product.name}</Text>
                                        <Text className="text-gray-500 text-sm">
                                            Product ID: <Text className="text-xs text-gray-500">{product.id}</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View className="mb-2">
                                    <Text className="text-base text-gray-700 font-semibold mb-1">
                                        Donated: <Text className="text-[#00CCBB]">{donated}</Text>
                                        {"  "} |  Remaining: <Text className="text-yellow-600">{available}</Text>
                                    </Text>
                                    <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <View
                                            style={{
                                                width: `${percentDonated}%`,
                                                backgroundColor: "#00CCBB",
                                                height: "100%",
                                                borderRadius: 8,
                                            }}
                                        />
                                    </View>
                                    <View className="flex-row justify-between mt-1">
                                        <Text className="text-xs text-[#00CCBB]">Donated</Text>
                                        <Text className="text-xs text-yellow-600">Available</Text>
                                    </View>
                                </View>
                                {group && group.donations.length > 0 ? (
                                    <View className="mt-3">
                                        <Text className="text-gray-700 font-semibold mb-2">Donation History:</Text>
                                        {group.donations
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((donation, idx) => (
                                                <View key={donation.id} className="flex-row justify-between mb-1">
                                                    <Text className="text-gray-600 text-sm">
                                                        {new Date(donation.createdAt).toLocaleDateString()} {new Date(donation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                    <Text className="text-gray-800 font-medium">
                                                        +{donation.quantity}
                                                    </Text>
                                                </View>
                                            ))}
                                    </View>
                                ) : (
                                    <View className="mt-3">
                                        <Text className="text-gray-400 italic text-sm">No donations yet for this product.</Text>
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
