import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import RequestCard from './RequestCard';
import RequestFormModal from './RequestFormModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const navigation = useNavigation();

  // TODO: Replace with actual user ID from authentication
  const orgUserId = "user_3";

  // Fetch requests on initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch requests whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
      return () => {}; // cleanup function
    }, [])
  );

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orgrequests/requests/incomplete/${orgUserId}`);
      setRequests(response.data.foodRequests);
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load food requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRequest(null);
    setModalVisible(true);
  };

  const handleEdit = (request) => {
    // Transform the request data to match the form structure
    const formattedRequest = {
      ...request,
      preferredFoodTypes: request.products.split(', '),
      requestByDateTime: request.dateTime,
      additionalNotes: request.notes,
      deliveryNeeded: request.delivery,
      requestType: request.urgent ? 'Urgent' : 'General',
      numberOfPeople: request.quantity.toString(),
      visibility: request.visibility
    };
    
    setEditingRequest(formattedRequest);
    setModalVisible(true);
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
          onPress: async () => {
            try {
              // Call the delete API endpoint
              await axios.delete(`${BACKEND_URL}/api/orgrequests/requests/${id}`);
              
              // Remove the deleted request from the local state
              setRequests(requests.filter(request => request.id !== id));
              Alert.alert("Success", "Request deleted successfully");
            } catch (error) {
              console.error("Error deleting request:", error);

              // Check if it's a specific error about donations
              if (error.response && error.response.status === 400) {
                Alert.alert(
                  "Cannot Delete",
                  "This request already has donations. Consider marking it as completed instead."
                );
              } else {
                Alert.alert("Error", "Failed to delete request. Please try again.");
              }
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSubmit = async (formData) => {
    try {
      // Transform the form data to match the API structure
      const apiData = {
        title: formData.title,
        products: formData.preferredFoodTypes.join(', '),
        quantity: parseInt(formData.numberOfPeople),
        dateTime: formData.requestByDateTime,
        notes: formData.additionalNotes,
        urgent: formData.requestType === 'Urgent',
        delivery: formData.deliveryNeeded,
        visibility: formData.visibility === 'Public'
      };

      if (editingRequest) {
        // Update existing request
        const response = await axios.put(
          `${BACKEND_URL}/api/orgrequests/requests/${editingRequest.id}`,
          apiData
        );
        
        // Update the local state with the updated request
        setRequests(requests.map(request => 
          request.id === editingRequest.id ? response.data.foodRequest : request
        ));
        
        Alert.alert("Success", "Request updated successfully");
      } else {
        // Create new request
        const response = await axios.post(
          `${BACKEND_URL}/api/orgrequests/requests`,
          {
            ...apiData,
            orgUserId
          }
        );
        
        // Add the new request to the local state
        setRequests([response.data.foodRequest, ...requests]);
        
        Alert.alert("Success", "New request created successfully");
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Failed to save request. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <RequestCard 
      request={item} 
      onEdit={handleEdit} 
      onDelete={handleDelete}
    />
  );

  if (loading && requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00CCBB" />
        <Text className="mt-2 text-gray-500">Loading requests...</Text>
      </View>
    );
  }

  if (error && requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text className="mt-2 text-red-500 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-md"
          onPress={fetchRequests}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200">
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
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshing={loading}
          onRefresh={fetchRequests}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="notifications-off-outline" size={50} color="#DDD" />
          <Text className="mt-2 text-base text-gray-500">No pending requests</Text>
          <TouchableOpacity 
            className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-md"
            onPress={openCreateModal}
          >
            <Text className="text-white font-medium">Create New Request</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <RequestFormModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        editingRequest={editingRequest}
      />
    </View>
  );
};

export default Requests;
