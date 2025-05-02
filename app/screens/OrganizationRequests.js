import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import RequestFormModal from '../components/RequestFormModal';
import {requestsData, addRequest, updateRequest, deleteRequest} from '../data/dishes';

export default function OrganizationRequests() {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [requests, setRequests] = useState(requestsData);

    const openCreateModal = () => {
        setEditingRequest(null);
        setModalVisible(true);
    };

    const openEditModal = (request) => {
        setEditingRequest(request);
        setModalVisible(true);
    };

    const handleSubmit = (formData) => {
        if (editingRequest) {
            /*
            * TODO: Add backend call for editing the requests
            */
            const updated = updateRequest(editingRequest.id, formData);
            setRequests([...requestsData]); // Update local state with the modified array
            Alert.alert("Success", "Request updated successfully");
        } else {
            /*
            * TODO: Add backend call for creating the requests
            */

            const newRequest = addRequest(formData);
            setRequests([...requestsData]); // Update local state with the modified array
            Alert.alert("Success", "New request created successfully");
        }
        setModalVisible(false);
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this request?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const deleted = deleteRequest(id);
                        if (deleted) {
                            /*
                            * TODO: Add backend call for deleting the requests
                            */
                            setRequests([...requestsData]); // Update local state with the modified array
                            Alert.alert("Success", "Request deleted successfully");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 shadow">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-bold text-gray-800">{item.title}</Text>
                <View className={`px-2 py-1 rounded-full ${
                    item.requestType === 'Urgent' ? 'bg-red-100' : 
                    item.requestType === 'Specific' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                    <Text className={`text-xs font-medium ${
                        item.requestType === 'Urgent' ? 'text-red-800' : 
                        item.requestType === 'Specific' ? 'text-blue-800' : 'text-yellow-800'
                    }`}>{item.requestType}</Text>
                </View>
            </View>
            
            <Text className="text-sm text-gray-600 mb-1">For {item.numberOfPeople} people</Text>
            <Text className="text-sm text-gray-600 mb-2">Needs: {item.preferredFoodTypes.join(', ')}</Text>
            
            <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-500">{item.time}</Text>
                
                <View className="flex-row">
                    <TouchableOpacity 
                        className="bg-gray-200 px-3 py-1.5 rounded mr-2"
                        onPress={() => openEditModal(item)}
                    >
                        <Text className="text-xs text-gray-800 font-medium">Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="bg-[#FF6B6B] px-3 py-1.5 rounded"
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text className="text-xs text-white font-medium">Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            
            <View className="px-5 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-800">Donation Requests</Text>
                <TouchableOpacity 
                    className="bg-[#00CCBB] px-3 py-2 rounded-md"
                    onPress={openCreateModal}
                >
                    <Text className="text-white font-medium">New Request</Text>
                </TouchableOpacity>
            </View>
            
            {requests.length > 0 ? (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16 }}
                />
            ) : (
                <View className="flex-1 justify-center items-center p-5">
                    <Ionicons name="notifications-off-outline" size={50} color="#DDD" />
                    <Text className="mt-2 text-base text-gray-500">No pending requests</Text>
                </View>
            )}
            
            <RequestFormModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                editingRequest={editingRequest}
            />
        </SafeAreaView>
    );
}
