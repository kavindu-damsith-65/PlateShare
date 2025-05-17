import React from "react";
import { View, Text, Image } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";

const ReviewCard = ({ review }) => {
  // Custom function to format date as "time ago"
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Convert to appropriate time unit
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

  // Format the date
  const formattedDate = review.createdAt
    ? formatTimeAgo(review.createdAt)
    : '';

  return (
    <View className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header with user info */}
      <View className="flex-row items-center mb-2">
        <Image 
          source={{ 
            uri: review.user?.avatar || 
                `https://ui-avatars.com/api/?name=${review.user?.name}&background=00CCBB&color=fff` 
          }} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="text-base font-bold text-gray-800">{review.user.name}</Text>
          {formattedDate && (
            <Text className="text-xs text-gray-500">{formattedDate}</Text>
          )}
        </View>
      </View>
      
      {/* Rating stars */}
      <View className="flex-row mb-2">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon 
            key={index} 
            size={18} 
            color={index < review.rating ? "#00CCBB" : "#E5E7EB"} 
            opacity={index < review.rating ? 1 : 0.5} 
          />
        ))}
      </View>
      
      {/* Review content */}
      <Text className="text-gray-700 leading-5">{review.description}</Text>
      
      {/* If there's a photo attached to the review */}
      {review.photo && (
        <Image 
          source={{ uri: review.photo }} 
          className="w-full h-40 rounded-lg mt-3"
          resizeMode="cover"
        />
      )}
    </View>
  );
};

export default ReviewCard;
