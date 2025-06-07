import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import useAxios from '../../hooks/useAxios';

const AddMenuItemForm = ({ restaurantId, onClose }) => {
    const axios = useAxios();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`/api/products/categories`);
                setCategories(response.data.categories);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!name || !description || !price || !quantity || !selectedCategory) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            const payload = {
                name,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                categoryId: selectedCategory,
            };
            const response = await axios.post(`/api/products/seller/add/${restaurantId}`, payload);
            if (response.status === 201) {
                Alert.alert('Success', 'Menu item added successfully');
                onClose();
            } else {
                Alert.alert('Error', 'Failed to add menu item');
            }
        } catch (error) {
            Alert.alert('Error', 'Error adding menu item');
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Add Menu Item</Text>

            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor="#9CA3AF"
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                style={{ minHeight: 60, textAlignVertical: 'top' }}
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Price</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Quantity</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Enter quantity"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Category</Text>
            <TouchableOpacity
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50 flex-row items-center justify-between"
                onPress={() => setModalVisible(true)}
            >
                <Text className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
                    {selectedCategoryName || "Select a category"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View className="absolute left-6 right-6 top-1/4 bg-white rounded-lg p-4 shadow-lg">
                        <Text className="text-lg font-bold mb-3">Select Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="py-2"
                                    onPress={() => {
                                        setSelectedCategory(item.id);
                                        setSelectedCategoryName(item.category);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-base text-gray-700">{item.category}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <View className="flex-row justify-end space-x-3 mt-4">
                <TouchableOpacity
                    onPress={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2"
                >
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="rounded-md bg-indigo-600 px-4 py-2"
                >
                    <Text className="text-white font-medium">Add Item</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddMenuItemForm;