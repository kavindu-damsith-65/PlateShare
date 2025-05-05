import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "@env";

const Reviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reviews/all/${restaurantId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = () => {
    // Logic to open a modal or navigate to a review creation screen
    Alert.alert("Create Review", "This feature is under development.");
  };

  const handleEditReview = (review) => {
    // Logic to open a modal or navigate to a review editing screen
    Alert.alert("Edit Review", `Editing review: ${review.id}`);
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`${BACKEND_URL}/api/reviews/${reviewId}`);
              setReviews(reviews.filter((review) => review.id !== reviewId));
              Alert.alert("Success", "Review deleted successfully");
            } catch (error) {
              console.error("Error deleting review:", error);
              Alert.alert("Error", "Failed to delete review. Please try again.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#00CCBB" />
        <Text className="mt-2 text-gray-500">Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View className="px-4 py-3 pt-6">
        <Text className="pb-3 text-xl font-bold">Your Feedback Lights Us Up!</Text>
        <TouchableOpacity
          className="bg-[#00CCBB] px-3 py-2 rounded-md mr-64"
          onPress={handleCreateReview}
        >
          <Text className="font-medium text-white">Add Review</Text>
        </TouchableOpacity>
      {reviews.length > 0 ? (
        reviews.map((review) => (   
          <View
            key={review.id}
            className="p-4 mt-4 bg-white rounded-lg shadow-md"
          >
            <Text className="text-lg font-bold">{review.user.name}</Text>
            <Text className="text-gray-500">{review.description}</Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="font-bold text-green-500">
                Rating: {review.rating}
              </Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="bg-[#00CCBB] px-3 py-2 rounded-md"
                  onPress={() => handleEditReview(review)}
                >
                  <Text className="font-medium text-white">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-3 py-2 bg-red-500 rounded-md"
                  onPress={() => handleDeleteReview(review.id)}
                >
                  <Text className="font-medium text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text className="mt-4 text-gray-500">No reviews available.</Text>
      )}
    </View>
  );
};

export default Reviews;