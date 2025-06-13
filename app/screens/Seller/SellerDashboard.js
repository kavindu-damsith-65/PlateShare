import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useAxios from '../../hooks/useAxios';
import { PieChart, BarChart } from 'react-native-chart-kit';

const uid = "user_2";
const restaurantId = "restaurant_user_2";

export default function SellerDashboard() {
    const axios = useAxios();
    const navigation = useNavigation();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState("?");
    const [mealCount, setMealCount] = useState("?");
    const [donations, setDonations] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const response = await axios.get(`/api/user/seller/${uid}`);
                setSeller(response.data.seller);
            } catch (error) {
                console.error('Failed to fetch seller profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeller();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ratingRes, mealRes, donationRes, productRes] = await Promise.all([
                    axios.get(`/api/reviews/restaurants/average-rating/${restaurantId}`),
                    axios.get(`/api/products/count/${restaurantId}`),
                    axios.get(`/api/donations/${restaurantId}`),
                    axios.get(`/api/products/seller/${restaurantId}`),
                ]);
                setRating(ratingRes.data.averageRating);
                setMealCount(mealRes.data.availableProductCount);
                setDonations(donationRes.data.donations || []);
                setProducts(productRes.data.products || []);
            } catch (error) {
                setRating("?");
                setMealCount("?");
            }
        };
        fetchStats();
    }, []);

    if (loading || !seller) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="text-gray-500 mt-2">Loading seller dashboard...</Text>
            </SafeAreaView>
        );
    }

    // Donation statistics
    const groupedDonations = {};
    donations.forEach((donation) => {
        const pid = donation.product_id;
        if (!groupedDonations[pid]) groupedDonations[pid] = 0;
        groupedDonations[pid] += donation.quantity;
    });
    const productNames = products.map(p => p.name);
    const productDonated = products.map(p => groupedDonations[p.id] || 0);
    const totalDonated = productDonated.reduce((a, b) => a + b, 0);
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

    // Bar chart for product donations
    const barData = {
        labels: productNames,
        datasets: [
            {
                data: productDonated,
            },
        ],
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-7">
            <StatusBar style="dark" />
            <ScrollView className="flex-1 p-5">
                {/* Header */}
                <Text className="text-2xl font-bold text-gray-800 mb-8">Seller Dashboard</Text>

                {/* Highlighted Stats */}
                <View className="flex-row justify-between mb-5">
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow border-2 border-[#00CCBB]">
                        <Text className="text-3xl font-extrabold text-[#00CCBB]">{mealCount}</Text>
                        <Text className="text-xs text-gray-600 mt-1">Products</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow border-2 border-[#facc15]">
                        <Text className="text-3xl font-extrabold text-[#facc15]">{totalDonated}</Text>
                        <Text className="text-xs text-gray-600 mt-1">Total Donated</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow border-2 border-[#10B981]">
                        <Text className="text-3xl font-extrabold text-[#10B981]">{rating}</Text>
                        <Text className="text-xs text-gray-600 mt-1">Ratings</Text>
                    </View>
                </View>

                <View className="bg-white rounded-xl shadow p-4 mb-6 items-center">
                    <Text className="text-lg font-bold text-gray-800 mb-2">Product Distribution</Text>
                    <PieChart
                        data={products.map((p, idx) => ({
                            name: p.name,
                            population: p.quantity || 0,
                            color: ['#00CCBB', '#facc15', '#10B981', '#EC4899', '#6366F1'][idx % 5],
                            legendFontColor: '#222',
                            legendFontSize: 14,
                        })).filter(d => d.population > 0)}
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
                </View>

                {/* Bar Chart */}
                <View className="bg-white rounded-xl shadow p-4 mb-6 items-center">
                    <Text className="text-lg font-bold text-gray-800 mb-2">Donations by Product</Text>
                    <BarChart
                        data={barData}
                        width={Dimensions.get('window').width - 64}
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        verticalLabelRotation={30}
                        fromZero
                        showValuesOnTopOfBars
                    />
                </View>

                <View className="bg-white rounded-lg p-4 mb-5 shadow flex-row items-center">
                    <View className="flex-1 pr-4">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {seller.restaurant.name.replace(/\b\w/g, c => c.toUpperCase())}
                        </Text>
                        <Text className="text-sm text-gray-500 mb-2">
                            Serving spicy goodness since {new Date(seller.createdAt).getFullYear()}.
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Restaurant', {
                            id: seller.restaurant.id,
                            imgUrl: seller.restaurant.image,
                            title: seller.restaurant.name,
                            rating: rating,
                            short_description: seller.restaurant.description,
                            long: "loading long....",
                            lat: "loading lat....",
                        })} className="mt-3">
                            <Text className="text-sm font-semibold text-gray-700">View Restaurant</Text>
                        </TouchableOpacity>
                    </View>
                    {seller.restaurant.image ? (
                        <Image
                            source={{ uri: seller.restaurant.image }}
                            className="w-24 h-24 rounded-lg"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center">
                            <Text className="text-xs text-gray-500">No Image</Text>
                        </View>
                    )}
                </View>

                {/* Orders & Analytics */}
                <View className="bg-white p-4 rounded-2xl shadow mb-5">
                    <Text className="text-lg font-bold text-gray-800 mb-3">Orders & Analytics</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Orders')}
                        className="flex-row items-center justify-between p-3 bg-indigo-100 rounded-lg mb-3"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="receipt-outline" size={22} color="#6366F1" />
                            <Text className="ml-2 text-indigo-700 font-medium">View Orders</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Menu')}
                        className="flex-row items-center justify-between p-3 bg-pink-100 rounded-lg"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="bar-chart-outline" size={22} color="#EC4899" />
                            <Text className="ml-2 text-pink-700 font-medium">Manage Products/Menu</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#EC4899" />
                    </TouchableOpacity>
                </View>

                {/* Recent orders bloc */}
                <View className="bg-white p-4 rounded-2xl shadow mb-10">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Recent Orders</Text>
                    <View className="items-center justify-center py-8">
                        <Ionicons name="receipt-outline" size={50} color="#DDD" />
                        <Text className="mt-2 text-base text-gray-500">No orders yet</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}