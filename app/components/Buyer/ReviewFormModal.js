import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";
import useAxios from '../../hooks/useAxios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const ReviewFormModal = ({
  visible,
  onClose,
  onSubmit,
  editingReview,
  restaurantId,
  customUserId, // Add this prop
}) => {
  const axios = useAxios();
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setDescription(editingReview.description);
    } else {
      setRating(0);
      setDescription("");
    }
  }, [editingReview]);

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (!rating || !description) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        rating,
        description,
        restaurant_id: restaurantId,
        user_id: customUserId || "user_1", // Use customUserId if provided, otherwise default to user_1
      };

      if (editingReview) {
        // Update existing review
        await axios.patch(
          `/api/reviews/${editingReview.id}`,
          reviewData
        );
        Alert.alert("Success", "Review updated successfully!");
        onSubmit({ ...editingReview, ...reviewData });
      } else {
        // Create new review
        const createResponse = await axios.post(
          `/api/reviews`,
          reviewData
        );
        const newReviewId = createResponse.data.id;

        const fetchResponse = await axios.get(
          `/api/reviews/one/${newReviewId}`
        );
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

      <View className="flex-row mb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
            <StarIcon
              size={30}
              color={index < rating ? "green" : "gray"}
              opacity={index < rating ? 1 : 0.5}
            />
          </TouchableOpacity>
        ))}
      </View>

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
