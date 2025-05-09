import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const ReviewFormModal = ({ visible,onClose, onSubmit, editingReview, restaurantId  }) => {
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating.toString());
      setDescription(editingReview.description);
    } else {
      setRating("");
      setDescription("");
    }
  }, [editingReview]);

  const handleSubmit = async () => {
    if (!rating || !description) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        rating: parseInt(rating),
        description,
        restaurant_id: restaurantId,
        user_id: "user_1", // TODO: Replace with actual user ID
      };

      if (editingReview) {
        // Update existing review
        await axios.patch(`${BACKEND_URL}/api/reviews/${editingReview.id}`, reviewData);
        Alert.alert("Success", "Review updated successfully!");
        onSubmit({ ...editingReview, ...reviewData });
      } else {
        // Create new review
        const createResponse = await axios.post(`${BACKEND_URL}/api/reviews`, reviewData);
        const newReviewId = createResponse.data.id;

        const fetchResponse = await axios.get(`${BACKEND_URL}/api/reviews/one/${newReviewId}`);
        const fullReviewData = fetchResponse.data;

        Alert.alert("Success", "Review created successfully!");
        onSubmit(fullReviewData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="mb-4 text-xl font-bold">
      {editingReview ? "Edit Your Review" : "Add Your Review"}
        </Text>
      <TextInput
        className="px-3 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Rating (1-5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        className="px-3 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Write your review..."
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View className="flex-row justify-end space-x-2">
        <TouchableOpacity
          className="px-4 py-2 bg-gray-200 rounded-md"
          onPress={onClose}
          disabled={loading}
        >
          <Text className="font-medium text-gray-800">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#00CCBB] px-4 py-2 rounded-md"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="font-medium text-white">
          {loading ? "Submitting..." : editingReview ? "Update" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewFormModal;
