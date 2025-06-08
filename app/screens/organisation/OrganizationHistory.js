import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, ScrollView } from 'react-native';
import useAxios from '../../hooks/useAxios';
import HistoryRequestCard from '../../components/organisation/HistoryRequestCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const OrganizationHistory = () => {
  const axios = useAxios();
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // TODO: Replace with actual user ID from authentication
  const orgUserId = "user_3";

  // Fetch completed requests on an initial load
  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  // Fetch completed requests whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCompletedRequests();
      return () => {}; // cleanup function
    }, [])
  );

  const fetchCompletedRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/orghistory/completed/${orgUserId}`);
      setCompletedRequests(response.data.foodRequests);
      setError(null);
    } catch (error) {
      console.error("Error fetching completed requests:", error);
      if (error.response && error.response.status === 404) {
        // No completed requests is not an error state
        setCompletedRequests([]);
        setError(null);
      } else {
        setError("Failed to load completed requests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      // Call the delete API endpoint
      await axios.delete(`/api/orgrequests/requests/${requestId}`);
      
      // Remove the deleted request from the local state
      setCompletedRequests(completedRequests.filter(request => request.id !== requestId));
      Alert.alert("Success", "Request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);

      // Check if it's a specific error about donations
      if (error.response && error.response.status === 400) {
        Alert.alert(
          "Cannot Delete",
          "This request has donations associated with it. Historical records with donations cannot be deleted."
        );
      } else {
        Alert.alert("Error", "Failed to delete request. Please try again.");
      }
    }
  };

  const renderItem = ({ item }) => (
    <HistoryRequestCard 
      request={item} 
      onDelete={handleDelete}
    />
  );

  if (loading && completedRequests.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <Text className="text-center text-xl font-bold">Request History</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {Array(3).fill().map((_, index) => (
            <View key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
              {/* Card content area */}
              <View className="p-4">
                {/* Title and status badge */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <View className="h-6 bg-gray-200 rounded w-3/4 mb-1" />
                    <View className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
                  </View>
                  <View className="bg-gray-200 px-2 py-1 rounded-full w-20 h-5" />
                </View>

                {/* Requested items */}
                <View className="mb-3">
                  <View className="h-5 bg-gray-200 rounded w-1/3 mb-1" />
                  <View className="h-5 bg-gray-200 rounded w-full" />
                </View>

                {/* Quantity and date */}
                <View className="flex-row justify-between mb-3">
                  <View>
                    <View className="h-5 bg-gray-200 rounded w-20 mb-1" />
                    <View className="h-5 bg-gray-200 rounded w-24" />
                  </View>
                  <View>
                    <View className="h-5 bg-gray-200 rounded w-24 mb-1" />
                    <View className="h-5 bg-gray-200 rounded w-20" />
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mb-3">
                  <View className="flex-row justify-between items-center mb-1">
                    <View className="h-4 bg-gray-200 rounded w-1/2" />
                    <View className="h-4 bg-gray-200 rounded w-10" />
                  </View>
                  <View className="h-2 w-full bg-gray-200 rounded-full" />
                </View>

                {/* Icons row */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="h-4 bg-gray-200 rounded w-20" />
                  </View>

                  <View className="flex-row items-center">
                    <View className="h-4 bg-gray-200 rounded w-28" />
                  </View>

                  <View className="flex-row items-center">
                    <View className="h-4 bg-gray-200 rounded w-16" />
                  </View>
                </View>
              </View>

              {/* Delete button */}
              <View className="px-4 pb-3 flex-row justify-end">
                <View className="bg-gray-200 px-3 py-2 rounded-md w-20 h-9" />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error && completedRequests.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <Text className="text-center text-xl font-bold">Request History</Text>
        </View>
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
          <Text className="mt-2 text-red-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-[#00CCBB] px-4 py-2 rounded-md"
            onPress={fetchCompletedRequests}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-7">
      <View className="relative py-4 shadow-sm bg-white">
        <Text className="text-center text-xl font-bold">Request History</Text>
      </View>
      
      {completedRequests.length > 0 ? (
        <FlatList
          data={completedRequests}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshing={loading}
          onRefresh={fetchCompletedRequests}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="checkmark-done-outline" size={50} color="#DDD" />
          <Text className="mt-2 text-base text-gray-500">No completed requests</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrganizationHistory;
