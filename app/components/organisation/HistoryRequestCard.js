import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TrashIcon } from 'react-native-heroicons/outline';

const HistoryRequestCard = ({ request, onDelete }) => {
  const navigation = useNavigation();

  // Format date to YYYY/MM/DD format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!request.donations || request.donations.length === 0) return 0;
    
    const totalDonated = request.donations.reduce((sum, donation) => sum + donation.quantity, 0);
    const percentage = Math.min((totalDonated / request.quantity) * 100, 100);
    
    return percentage;
  };

  // Get total donated quantity
  const getTotalDonated = () => {
    if (!request.donations || request.donations.length === 0) return 0;
    return request.donations.reduce((sum, donation) => sum + donation.quantity, 0);
  };

  // Handle delete confirmation
  const handleDeletePress = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this completed request?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => onDelete(request.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <TouchableOpacity 
        className="p-4"
        activeOpacity={0.7}
        onPress={() => navigation.navigate('RequestDetails', { requestId: request.id })}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{request.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">Completed on {formatDate(request.completedDate)}</Text>
          </View>
          <View className="bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-xs font-medium text-green-800">Completed</Text>
          </View>
        </View>
        
        <View className="mb-3">
          <Text className="text-gray-700 font-medium mb-1">Requested Items:</Text>
          <Text className="text-gray-600" numberOfLines={2}>{request.products}</Text>
        </View>
        
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-gray-700 font-medium mb-1">Quantity:</Text>
            <Text className="text-gray-600">{request.quantity} servings</Text>
          </View>
          <View>
            <Text className="text-gray-700 font-medium mb-1">Needed By:</Text>
            <Text className="text-gray-600">{formatDate(request.dateTime)}</Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-gray-500">
              {getTotalDonated()} of {request.quantity} servings received
            </Text>
            <Text className="text-sm font-medium text-green-600">
              {calculateProgress().toFixed(0)}%
            </Text>
          </View>
          <View className="h-2 w-full bg-gray-200 rounded-full">
            <View 
              className="h-2 rounded-full bg-green-500" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1">
              {request.donations ? request.donations.length : 0} donations
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons 
              name={request.delivery ? "car-outline" : "close-circle-outline"} 
              size={16} 
              color={request.delivery ? "#6B7280" : "#EF4444"} 
            />
            <Text className={`text-xs ml-1 ${request.delivery ? "text-gray-500" : "text-red-500"}`}>
              {request.delivery ? "Delivery requested" : "No delivery"}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons 
              name={request.visibility ? "eye-outline" : "eye-off-outline"} 
              size={16} 
              color={request.visibility ? "#6B7280" : "#6B7280"} 
            />
            <Text className="text-gray-500 text-xs ml-1">
              {request.visibility ? "Public" : "Private"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Delete button */}
      <View className="px-4 pb-3 flex-row justify-end">
        <TouchableOpacity 
          className="bg-red-100 px-3 py-2 rounded-md flex-row items-center"
          onPress={handleDeletePress}
        >
          <TrashIcon size={16} color="#EF4444" />
          <Text className="text-red-500 font-medium ml-1">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryRequestCard;
