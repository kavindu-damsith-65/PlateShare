import {Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {StarIcon} from "react-native-heroicons/outline";
import React, {useEffect, useState} from "react";
import ReviewFormModal from "../Buyer/ReviewFormModal";
import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const DonationItem = ({ donation, isFromHistory }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // TODO: Replace with actual user ID
    const userId = "user_3";

    const handleAddReview = (donation) => {
        setSelectedRestaurant({
            id: donation.restaurant.id,
            name: donation.restaurant.name
        });
        setModalVisible(true);
    };

    useEffect(() => {
        // Only fetch if we're in history view and have a restaurant ID
        if (isFromHistory && donation?.restaurant?.id) {
            fetchReviews();
        }
    }, [isFromHistory, donation?.restaurant?.id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BACKEND_URL}/api/reviews/user/${userId}/restaurant/${donation.restaurant.id}`
            );

            if (response.data && Array.isArray(response.data)) {
                setReviews(response.data);
            } else {
                console.warn('Unexpected response format:', response.data);
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error.response || error.message || error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = (reviewData) => {
        setModalVisible(false);
        if (isFromHistory && donation?.restaurant?.id) {
            fetchReviews();
        }
    };

  return (
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
              <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                      <Image
                          source={{ uri: donation.restaurant.image }}
                          className="w-6 h-6 rounded-full"
                      />
                      <Text className="text-gray-700 ml-2">{donation.restaurant.name}</Text>
                  </View>

                  {isFromHistory && (
                      <TouchableOpacity
                          className="bg-[#00CCBB]/20 px-3 py-1.5 rounded-md flex-row items-center"
                          onPress={() => handleAddReview(donation)}
                      >
                          <StarIcon size={16} color="#00CCBB" strokeWidth={2.5} />
                          <Text className="text-[#00CCBB] font-semibold ml-1">Add Review</Text>
                      </TouchableOpacity>
                  )}
              </View>
          </View>
          {/* Display reviews section */}
          {isFromHistory && (
              <View className="mt-3">
                  <Text className="font-medium text-gray-700 mb-1">Your Reviews :</Text>
                  {loading ? (
                      <Text className="text-gray-500 italic">Loading reviews...</Text>
                  ) : reviews && reviews.length > 0 ? (
                      <View>
                          {reviews.slice(0, 2).map(review => (
                              <View key={review.id} className="bg-gray-50 p-2 rounded mb-1">
                                  <View className="flex-row items-center">
                                      <Text className="text-sm font-medium">Rating :</Text>
                                      <View className="flex-row ml-2">
                                          {[...Array(5)].map((_, i) => (
                                              <StarIcon 
                                                  key={i} 
                                                  size={12} 
                                                  color={i < review.rating ? "#00CCBB" : "#D3D3D3"}
                                                  opacity={i < review.rating ? 1 : 0.5}
                                              />
                                          ))}
                                      </View>
                                  </View>
                                  <Text className="text-sm text-gray-600 mt-1">{review.description}</Text>
                              </View>
                          ))}
                          {reviews.length > 2 && (
                              <Text className="text-xs text-gray-500 italic">
                                  +{reviews.length - 2} more reviews
                              </Text>
                          )}
                      </View>
                  ) : (
                      <Text className="text-gray-500 italic">No reviews yet</Text>
                  )}
              </View>
          )}
          {/* Review Modal */}
          <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
          >
              <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="w-11/12 bg-white rounded-lg">
                      <ReviewFormModal
                          visible={modalVisible}
                          onClose={() => setModalVisible(false)}
                          onSubmit={handleReviewSubmit}
                          editingReview={null}
                          restaurantId={selectedRestaurant?.id}
                          customUserId={userId}
                      />
                  </View>
              </View>
          </Modal>
      </View>
  );
};

export default DonationItem;
