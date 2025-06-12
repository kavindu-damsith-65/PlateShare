import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import useAxios from '../../hooks/useAxios';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

export default function SellerDonationForm({ route, navigation }) {
    const axios = useAxios();
    const { restaurantId, request } = route.params; // Extract restaurantId and request from route.params

    // Build a map of needed product quantities from the request
    const neededProducts = Array.isArray(request?.products)
        ? request.products.reduce((acc, item) => {
            acc[item.productId] = item.quantity;
            return acc;
        }, {})
        : {};

    // Filter products to only those needed in the request
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products for restaurant:', restaurantId);
                const response = await axios.get(`/api/products/seller/${restaurantId}`);
                setProducts(response.data.products || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [restaurantId]);

    const handleQuantityChange = (productId, quantity) => {
        const product = products.find((p) => p.id === productId);
        const validQuantity = Math.min(parseInt(quantity, 10) || 0, product.quantity); // Ensure quantity is less than or equal to available

        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === productId);

            if (existingProduct) {
                return prev.map((p) =>
                    p.id === productId ? { ...p, quantity: validQuantity } : p
                );
            } else {
                return [...prev, { ...product, quantity: validQuantity }];
            }
        });
    };

    const handleSubmit = async () => {
        const donationData = selectedProducts.filter((p) => p.quantity > 0).map((p) => ({
            productId: p.id,
            quantity: p.quantity
        }));

        if (donationData.length === 0) {
            Alert.alert('Error', 'Please select at least one product to donate.');
            return;
        }

        try {
            const response = await axios.post(`/api/donations/${restaurantId}`, {
                requestId: request.id,
                products: donationData
            });

            if (response.status === 201) {
                Alert.alert(
                    'Success',
                    '🎉 Your donation has been submitted successfully! Thank you for your generosity.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to submit donation. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
            Alert.alert('Error', 'Failed to submit donation. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <Text>Loading products...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center p-5">
                    <Text className="text-red-500 text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        className="bg-[#00CCBB] px-4 py-2 rounded-md"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-white">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <View className="relative py-4 shadow-sm bg-white">
                <TouchableOpacity
                    className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeftIcon size={20} color="#00CCBB" />
                </TouchableOpacity>
                <Text className="text-center text-xl font-bold text-[#00CCBB]">Donate Products</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white rounded-lg p-4 mb-4 shadow">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Select Products to Donate</Text>
                    {products.filter((product) => product.quantity > 0).map((product) => (
                        <View key={product.id} className="mb-4">
                            <Text className="text-gray-800 font-medium text-lg">{product.name}</Text>
                            <Text className="text-gray-600 text-sm mb-2">{product.description}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-gray-800 font-medium mr-2">Quantity:</Text>
                                <TouchableOpacity
                                    className="bg-gray-200 px-3 py-2 rounded-md mr-2"
                                    onPress={() => handleQuantityChange(product.id, (selectedProducts.find((p) => p.id === product.id)?.quantity || 0) - 1)}
                                    disabled={(selectedProducts.find((p) => p.id === product.id)?.quantity || 0) <= 0}
                                >
                                    <Text className="text-gray-800 font-bold">-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2 w-24 text-center"
                                    keyboardType="number-pad"
                                    value={(selectedProducts.find((p) => p.id === product.id)?.quantity || 0).toString()}
                                    onChangeText={(quantity) => handleQuantityChange(product.id, quantity)}
                                />
                                <TouchableOpacity
                                    className="bg-gray-200 px-3 py-2 rounded-md ml-2"
                                    onPress={() => handleQuantityChange(product.id, (selectedProducts.find((p) => p.id === product.id)?.quantity || 0) + 1)}
                                    disabled={(selectedProducts.find((p) => p.id === product.id)?.quantity || 0) >= product.quantity}
                                >
                                    <Text className="text-gray-800 font-bold">+</Text>
                                </TouchableOpacity>
                                <Text className="ml-2 text-gray-500">Available: {product.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    className="bg-[#00CCBB] px-4 py-3 rounded-md flex-row justify-center items-center shadow-lg"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-medium text-lg">Submit Donation</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}