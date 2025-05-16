import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import useAxios from '../../hooks/useAxios';

const AddMenuItemForm = ({ restaurantId, onClose }) => {
    const axios = useAxios();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`/api/products/categories`);
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('categoryId', selectedCategory);
            formData.append('restaurantId', restaurantId);
            if (image) {
                formData.append('image', {
                    uri: image.uri,
                    name: 'menu-item.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`/api/products/seller/${restaurantId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 201) {
                console.log('Menu item added successfully:', response.data);
                onClose();
            } else {
                console.error('Failed to add menu item:', response.data);
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-xl font-bold mb-4">Add Menu Item</Text>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Item name"
                    className="border rounded-md px-3 py-2"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    multiline
                    className="border rounded-md px-3 py-2 min-h-[60px]"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Price</Text>
                <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Price"
                    keyboardType="decimal-pad"
                    className="border rounded-md px-3 py-2"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Quantity</Text>
                <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Quantity"
                    keyboardType="number-pad"
                    className="border rounded-md px-3 py-2"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Category</Text>
                <View className="border rounded-md">
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {categories.map((category) => (
                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1 text-gray-700">Image</Text>
                <TouchableOpacity
                    onPress={handleImagePick}
                    className="border rounded-md px-3 py-2 items-center bg-gray-50"
                >
                    <Text>{image ? 'Change Image' : 'Pick Image'}</Text>
                </TouchableOpacity>
                {image && (
                    <Image
                        source={{ uri: image.uri }}
                        className="w-32 h-32 mt-2 rounded-md"
                    />
                )}
            </View>
            <View className="flex-row justify-end space-x-3 mt-4">
                <TouchableOpacity
                    onPress={onClose}
                    className="border border-gray-300 bg-white px-4 py-2 rounded-md mr-2"
                >
                    <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-indigo-600 px-4 py-2 rounded-md"
                >
                    <Text className="text-white font-medium">Add Item</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddMenuItemForm;