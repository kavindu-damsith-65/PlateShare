import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const DonationItem = ({ donation }) => (
  <View className="bg-white p-4 rounded-lg mb-3 shadow-sm">
    <View className="flex-row">
      <Image 
        source={{ uri: donation.product.image }} 
        className="w-20 h-20 rounded-md"
      />
      <View className="ml-3 flex-1 justify-center">
        <Text className="font-bold text-gray-800">{donation.product.name}</Text>
        <Text className="text-gray-600 text-sm">{donation.product.description}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-700">Quantity: {donation.quantity}</Text>
        </View>
      </View>
    </View>
    <View className="mt-2 pt-2 border-t border-gray-100">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: donation.restaurant.image }} 
          className="w-6 h-6 rounded-full"
        />
        <Text className="ml-2 text-sm text-gray-700">{donation.restaurant.name}</Text>
      </View>
    </View>
  </View>
);

export default function RequestDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = route.params;
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        // In a real app, you would fetch the specific request by ID
        const response = await axios.get(`${BACKEND_URL}/api/organisation/requests/incomplete/user_3`);
        const foundRequest = response.data.foodRequests.find(req => req.id === requestId);
        
        if (foundRequest) {
          setRequest(foundRequest);
        } else {
          setError("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError("Failed to load request details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [requestId]);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Loading request details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error || !request) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-center mb-4">{error || "Request not found"}</Text>
          <TouchableOpacity 
            className="bg-[#00CCBB] px-4 py-2 rounded-md"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="relative py-4 shadow-sm bg-white">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold">Request Details</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">{request.title}</Text>
            {request.urgent && (
              <View className="bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-red-800">Urgent</Text>
              </View>
            )}
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">Requested Items:</Text>
            <Text className="text-gray-600">{request.products}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">Quantity Needed:</Text>
            <Text className="text-gray-600">{request.quantity} servings</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">Needed By:</Text>
            <Text className="text-gray-600">{formatDate(request.dateTime)}</Text>
          </View>
          
          {request.notes && (
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Additional Notes:</Text>
              <Text className="text-gray-600 italic">"{request.notes}"</Text>
            </View>
          )}
          
          <View className="flex-row mb-2">
            {request.delivery && (
              <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                <Text className="text-xs font-medium text-blue-800">Delivery Needed</Text>
              </View>
            )}
            <View className={`px-2 py-1 rounded-full ${request.visibility ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-medium ${request.visibility ? 'text-green-800' : 'text-gray-800'}`}>
                {request.visibility ? 'Public Request' : 'Private Request'}
              </Text>
            </View>
          </View>
        </View>
        
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Donations ({request.donations.length})</Text>
          {request.donations.length > 0 ? (
            request.donations.map(donation => (
              <DonationItem key={donation.id} donation={donation} />
            ))
          ) : (
            <View className="bg-white p-4 rounded-lg items-center">
              <Text className="text-gray-500">No donations yet</Text>
            </View>
          )}
        </View>
        
        <View className="flex-row justify-between mb-10">
          <TouchableOpacity 
            className="bg-[#00CCBB] px-4 py-3 rounded-md flex-1 mr-2"
            onPress={() => navigation.navigate('OrganizationRequests')}
          >
            <Text className="text-white text-center font-medium">Back to Requests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-green-500 px-4 py-3 rounded-md flex-1 ml-2"
            onPress={() => {
              // Mark as complete logic would go here
              alert('Request marked as complete');
              navigation.navigate('OrganizationRequests');
            }}
          >
            <Text className="text-white text-center font-medium">Mark Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}