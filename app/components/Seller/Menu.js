import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import useAxios from '../../hooks/useAxios';
import MenuItem from './MenuItem';

const Menu = ({ restaurantId, ListHeaderComponent, contentContainerStyle }) => {
    const axios = useAxios();
    const [products, setProducts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const renderMenuItem = ({ item }) => (
        <MenuItem
            item={item}
            isExpanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            onEditItem={()=> console.log('Edit item:', item.id)}
            onDeleteItem={() => handleDelete(item.id)}
        />
    );

    return (
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
    );
};

export default Menu;