import React, { useState, useEffect } from 'react';
import { FlatList, Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import useAxios from '../../hooks/useAxios';
import MenuItem from './MenuItem';
import UpdateMenuItemForm from './UpdateMenuItemForm';

const Menu = ({ restaurantId, ListHeaderComponent, contentContainerStyle }) => {
    const axios = useAxios();
    const [products, setProducts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/products/seller/${restaurantId}`);
            if (response.status === 200) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const handleDelete = async (productId) => {
        try {
            const response = await axios.delete(`/api/products/seller/remove/${productId}/${restaurantId}`);
            if (response.status === 200) {
                setProducts(products.filter(product => product.id !== productId));
                Alert.alert('Success', 'Menu item deleted successfully');
            } else {
                Alert.alert('Error', 'Failed to delete menu item');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Error deleting menu item');
        }
    };

    const confirmDelete = (productId) => {
        setPendingDeleteId(productId);
        setShowConfirm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleUpdated = () => {
        fetchData();
    };

    const renderMenuItem = ({ item }) => (
        <MenuItem
            item={item}
            isExpanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            onEditItem={() => handleEdit(item)}
            onDeleteItem={() => confirmDelete(item.id)}
        />
    );

    return (
        <>
            <FlatList
                data={products}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                refreshing={isLoading}
                onRefresh={fetchData}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[
                    { paddingHorizontal: 16, paddingBottom: 100 },
                    contentContainerStyle,
                ]}
            />
            {/* Delete Confirmation Modal */}
            <Modal
                visible={showConfirm}
                transparent
                animationType="fade"
                onRequestClose={() => setShowConfirm(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
                    <View className="bg-white rounded-xl p-6 w-80 shadow-lg">
                        <Text className="text-lg font-bold text-gray-800 mb-2">Delete Menu Item?</Text>
                        <Text className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</Text>
                        <View className="flex-row justify-end space-x-3">
                            <TouchableOpacity
                                className="px-4 py-2 rounded-md border border-gray-300 bg-white"
                                onPress={() => setShowConfirm(false)}
                            >
                                <Text className="text-gray-700 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2 rounded-md bg-red-600"
                                onPress={async () => {
                                    setShowConfirm(false);
                                    if (pendingDeleteId) await handleDelete(pendingDeleteId);
                                    setPendingDeleteId(null);
                                }}
                            >
                                <Text className="text-white font-medium">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Update Menu Item Modal */}
            <Modal
                visible={!!editingItem}
                animationType="slide"
                onRequestClose={() => setEditingItem(null)}
            >
                {editingItem && (
                    <UpdateMenuItemForm
                        restaurantId={restaurantId}
                        item={editingItem}
                        onClose={() => setEditingItem(null)}
                        onUpdated={handleUpdated}
                    />
                )}
            </Modal>
        </>
    );
};

export default Menu;