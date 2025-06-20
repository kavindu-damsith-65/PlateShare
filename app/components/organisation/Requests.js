import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import useAxios from '../../hooks/useAxios';
import RequestCard from './RequestCard';
import RequestFormModal from './RequestFormModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PlusIcon } from 'react-native-heroicons/outline';

const Requests = () => {
  const axios = useAxios();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const navigation = useNavigation();

  // TODO: Replace with actual user ID from authentication
  const orgUserId = "user_3";

  // Fetch requests on an initial load
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
      const response = await axios.get(`/api/orgrequests/requests/incomplete/${orgUserId}`);
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
              await axios.delete(`/api/orgrequests/requests/${id}`);
              
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
          `/api/orgrequests/requests/${editingRequest.id}`,
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
          `/api/orgrequests/requests`,
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
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Donation Requests</Text>
          <View className="bg-gray-200 px-3 py-2 rounded-md w-28 h-9" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {Array(3).fill().map((_, index) => (
            <View key={`skeleton-${index}`} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
              <View className="p-4">
                {/* Title and urgency tag */}
                <View className="flex-row justify-between items-center mb-2">
                  <View className="w-2/3 h-7 bg-gray-200 rounded" />
                  <View className="bg-gray-200 px-2 py-1 rounded-full w-16 h-5" />
                </View>

                {/* Needs text */}
                <View className="w-full h-5 bg-gray-200 rounded mb-2" />

                {/* Quantity */}
                <View className="w-1/2 h-5 bg-gray-200 rounded mb-2" />

                {/* Notes (optional) */}
                <View className="w-3/4 h-5 bg-gray-200 rounded mb-2" />

                {/* Tags row */}
                <View className="flex-row mb-3">
                  <View className="bg-gray-200 px-2 py-1 rounded-full mr-2 w-28 h-5" />
                  <View className="bg-gray-200 px-2 py-1 rounded-full w-16 h-5" />
                </View>

                {/* Date and action buttons */}
                <View className="flex-row justify-between items-center">
                  <View className="w-1/3 h-4 bg-gray-200 rounded" />

                  {/* Action buttons */}
                  <View className="flex-row justify-end space-x-2">
                    <View className="bg-gray-200 px-3 py-2 rounded-md w-20 h-9" />
                    <View className="bg-gray-200 px-3 py-2 rounded-md w-24 h-9" />
                  </View>
                </View>

                {/* Donations section */}
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                  <View className="flex-row">
                    {[1, 2, 3].map((item) => (
                      <View key={item} className="mr-2 items-center">
                        <View className="w-10 h-10 rounded-full bg-gray-200" />
                        <View className="w-8 h-3 bg-gray-200 rounded mt-1" />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
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
          className="bg-[#00CCBB]/20 px-3 py-2 rounded-md flex-row items-center"
          onPress={openCreateModal}
        >
          <PlusIcon size={16} color="#00CCBB" strokeWidth={2.5} />
          <Text className="text-[#00CCBB] font-semibold ml-1">New Request</Text>
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
