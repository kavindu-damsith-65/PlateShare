import React, { useState, useEffect } from 'react';
import {Text} from 'react-native';
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('categoryId', selectedCategory);
            formData.append('restaurantId', restaurantId);
            if (image) formData.append('image', image);

            const response = await axios.post('/api/products', formData);
            if (response.status === 201) {
                console.log('Menu item added successfully:', response.data);
            } else {
                console.error('Failed to add menu item:', response.data);
            }
            onClose();
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <Text className="block text-sm font-medium text-gray-700">Name</Text>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <Text className="block text-sm font-medium text-gray-700">Description</Text>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <Text className="block text-sm font-medium text-gray-700">Price</Text>
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <Text className="block text-sm font-medium text-gray-700">Quantity</Text>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <Text className="block text-sm font-medium text-gray-700">Category</Text>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <Text component="option" value="">Select a category</Text>
                    {categories.map((category) => (
                        <Text component="option" key={category.id} value={category.id}>
                            {category.name}
                        </Text>
                    ))}
                </select>
            </div>

            <div>
                <Text className="block text-sm font-medium text-gray-700">Image</Text>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className="mt-1 block w-full"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Text>Cancel</Text>
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Item
                </button>
            </div>
        </form>
    );
};

export default AddMenuItemForm;
