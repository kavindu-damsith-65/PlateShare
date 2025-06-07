import ={ useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useAxios from '../../hooks/useAxios';

const AddMenuItemForm = ({ restaurantId, onClose }) => {
    const axios = useAxios();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    // Placeholder for image picker
    // const [image, setImage] = useState(null);

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
                restaurantId,
                // image, // Add image logic if needed
            };
            const response = await axios.post('/api/products', payload);
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
            <View className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
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

            {/*
            <Text className="text-sm font-medium text-gray-700 mb-1">Image</Text>
            <TouchableOpacity
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
                onPress={() => {
                    // open image picker
                }}
            >
                <Text className="text-gray-500">{image ? "Image Selected" : "Select Image"}</Text>
            </TouchableOpacity>
            */}

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