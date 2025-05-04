import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RequestCard = ({ request, onEdit, onDelete, onMarkComplete }) => {
  const navigation = useNavigation();
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-4 shadow"
      onPress={() => navigation.navigate("RequestDetails", { requestId: request.id })}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{request.title}</Text>
        {request.urgent && (
          <View className="bg-red-100 px-2 py-1 rounded-full">
            <Text className="text-xs font-medium text-red-800">Urgent</Text>
          </View>
        )}
      </View>
      
      <Text className="text-gray-600 mb-2">
        Needs: {request.products}
      </Text>
      
      <Text className="text-gray-500 mb-2">Quantity: {request.quantity}</Text>
      
      {request.notes && (
        <Text className="text-gray-500 mb-2 italic">"{request.notes}"</Text>
      )}
      
      <View className="flex-row mb-3">
        {request.delivery && (
          <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
            <Text className="text-xs font-medium text-blue-800">Delivery Needed</Text>
          </View>
        )}
        <View className={`px-2 py-1 rounded-full ${request.visibility ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-medium ${request.visibility ? 'text-green-800' : 'text-gray-800'}`}>
            {request.visibility ? 'Public' : 'Private'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">
          Needed by: {formatDate(request.dateTime)}
        </Text>
        
        <View className="flex-row">
          <TouchableOpacity 
            className="bg-gray-200 px-3 py-1.5 rounded mr-2"
            onPress={() => onEdit(request)}
          >
            <Text className="text-xs text-gray-800 font-medium">Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#FF6B6B] px-3 py-1.5 rounded mr-2"
            onPress={() => onDelete(request.id)}
          >
            <Text className="text-xs text-white font-medium">Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-green-500 px-3 py-1.5 rounded"
            onPress={() => onMarkComplete(request.id)}
          >
            <Text className="text-xs text-white font-medium">Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {request.donations && request.donations.length > 0 && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <Text className="text-xs font-medium text-gray-700 mb-2">
            Donations ({request.donations.length}):
          </Text>
          <View className="flex-row">
            {request.donations.slice(0, 3).map((donation, index) => (
              <View key={donation.id} className="mr-2 items-center">
                <Image 
                  source={{ uri: donation.product.image }} 
                  className="w-10 h-10 rounded-full"
                />
                <Text className="text-xs text-center mt-1">{donation.quantity}x</Text>
              </View>
            ))}
            {request.donations.length > 3 && (
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                <Text className="text-xs font-medium text-gray-600">
                  +{request.donations.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RequestCard;