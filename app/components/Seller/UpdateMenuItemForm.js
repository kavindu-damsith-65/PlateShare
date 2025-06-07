import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import useAxios from '../../hooks/useAxios';

const UpdateMenuItemForm = ({ restaurantId, item, onClose, onUpdated }) => {
    const axios = useAxios();
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [price, setPrice] = useState(item.price.toString());
    const [quantity, setQuantity] = useState(item.quantity.toString());
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        item.categoryId || (typeof item.category === 'object' ? item.category.id : '')
    );
    const [selectedCategoryName, setSelectedCategoryName] = useState(
        typeof item.category === 'string'
            ? item.category
            : (item.category?.name || item.category?.category || '')
    );
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
            const response = await axios.put(
                `/api/products/seller/update/${item.id}/${restaurantId}`,
                payload
            );
            if (response.status === 200) {
                Alert.alert('Success', 'Menu item updated successfully');
                onUpdated && onUpdated();
                onClose();
            } else {
                Alert.alert('Error', 'Failed to update menu item');
            }
        } catch (error) {
            Alert.alert('Error', 'Error updating menu item');
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Update Menu Item</Text>

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
                            keyExtractor={cat => cat.id}
                            renderItem={({ item: cat }) => (
                                <TouchableOpacity
                                    className="py-2"
                                    onPress={() => {
                                        setSelectedCategory(cat.id);
                                        setSelectedCategoryName(cat.name || cat.category || '');
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-base text-gray-700">{cat.name || cat.category || ''}</Text>
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
                    <Text className="text-white font-medium">Update Item</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default UpdateMenuItemForm;