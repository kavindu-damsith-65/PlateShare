import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useAxios from '../../hooks/useAxios';
import { PieChart, BarChart } from 'react-native-chart-kit';

const restaurantId = "restaurant_user_2";

export default function SellerDashboard() {
    const axios = useAxios();
    const navigation = useNavigation();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState("?");
    const [mealCount, setMealCount] = useState("?");
    const [donations, setDonations] = useState([]);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [topReviews, setTopReviews] = useState([]);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [restaurantRes, reviewsRes, ratingRes, mealRes, donationRes] = await Promise.all([
                    axios.get(`/api/restaurants/unique/${restaurantId}`),
                    axios.get(`/api/reviews/all/${restaurantId}`),
                    axios.get(`/api/reviews/restaurants/average-rating/${restaurantId}`),
                    axios.get(`/api/products/count/${restaurantId}`),
                    axios.get(`/api/donations/${restaurantId}`),
                ]);
                setRestaurant(restaurantRes.data.restaurant);
                setProducts(restaurantRes.data.restaurant.products || []);
                setReviews(reviewsRes.data || []);
                setRating(ratingRes.data.averageRating);
                setMealCount(mealRes.data.availableProductCount);
                setDonations(donationRes.data.donations || []);
            } catch (error) {
                setRating("?");
                setMealCount("?");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const sorted = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 5);
        setTopReviews(sorted);
    }, [reviews]);

    useEffect(() => {
        if (topReviews.length > 1 && carouselRef.current) {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % topReviews.length;
                try {
                    carouselRef.current.scrollToIndex({ index, animated: true });
                } catch { }
            }, 3500);
            return () => clearInterval(interval);
        }
    }, [topReviews.length]);

    if (loading || !restaurant) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text className="text-gray-500 mt-2">Loading seller dashboard...</Text>
            </SafeAreaView>
        );
    }

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
    const pieData = products.map((p, idx) => ({
        name: p.name,
        population: p.quantity || 0,
        color: ['#00CCBB', '#facc15', '#10B981', '#EC4899', '#6366F1'][idx % 5],
        legendFontColor: '#222',
        legendFontSize: 14,
    })).filter(d => d.population > 0);
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
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-2xl font-bold text-gray-800">Seller Dashboard</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Restaurant', restaurant)}>
                        <Image
                            source={{ uri: restaurant.image }}
                            className="w-12 h-12 rounded-full border-2 border-[#00CCBB]"
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
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
                        data={pieData}
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
                <View className="bg-white p-4 rounded-2xl shadow mb-10">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Top Customer Reviews</Text>
                    {topReviews.length === 0 ? (
                        <View className="items-center justify-center py-8">
                            <Ionicons name="chatbubble-ellipses-outline" size={50} color="#DDD" />
                            <Text className="mt-2 text-base text-gray-500">No reviews yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={carouselRef}
                            data={topReviews}
                            keyExtractor={item => item.id.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View className="w-[320px] mx-2 p-4 bg-gray-50 rounded-xl shadow-sm justify-center" style={{ width: Dimensions.get('window').width - 80 }}>
                                    <View className="flex-row items-center mb-2">
                                        <Ionicons name="person-circle-outline" size={28} color="#00CCBB" />
                                        <Text className="ml-2 font-semibold text-gray-800">{item.user?.name || 'Anonymous'}</Text>
                                        <View className="flex-row ml-4 items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons
                                                    key={i}
                                                    name={i < item.rating ? 'star' : 'star-outline'}
                                                    size={16}
                                                    color="#facc15"
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text className="text-gray-700 mb-1">{item.description}</Text>
                                    <Text className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}