import React, { useRef, useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import useAxios from '../../hooks/useAxios';
import ReviewCard from "./ReviewCard";
import ReviewFormModal from "./ReviewFormModal";
import { StarIcon } from "react-native-heroicons/solid";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const Reviews = ({ restaurantId }) => {
  const axios = useAxios();
  const scrollViewRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0] // Count of 1-star, 2-star, 3-star, 4-star, 5-star
  });
  const [activeFilter, setActiveFilter] = useState('All');

  const getFilteredReviews = () => {
    if (activeFilter === 'All') return reviews;
    if (activeFilter === 'With Photos') return reviews.filter(review => review.images && review.images.length > 0);
    // Extract the star number from filter text (e.g. "5 ★" -> 5)
    const rating = parseInt(activeFilter);
    return reviews.filter(review => review.rating === rating);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/reviews/all/${restaurantId}`
      );
      setReviews(response.data);
      console.log(response.data);
      calculateRatingStats(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRatingStats = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) {
      setRatingStats({
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0]
      });
      return;
    }

    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;
    
    // Calculate distribution
    const distribution = [0, 0, 0, 0, 0];
    reviewsData.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    setRatingStats({
      average: parseFloat(average.toFixed(1)),
      total,
      distribution
    });
  };

  useEffect(() => {
    let scrollPosition = 0;
    const cardWidth = SCREEN_WIDTH - 30 + 16; // Card width + margin
    const maxScroll = cardWidth * (reviews.length - 1);

    const intervalId = setInterval(() => {
      if (isUserScrolling) return; // Skip auto-scroll if user is scrolling

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        scrollPosition += cardWidth;
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isUserScrolling, reviews]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = SCREEN_WIDTH - 30 + 16;
    const currentIndex = Math.round(offsetX / cardWidth);
    const newOffset = currentIndex * cardWidth;

    if (offsetX !== newOffset) {
      scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ccbb" />;
  }

  if (!reviews || reviews.length === 0) {
    return <Text className="mt-4 text-gray-500">No reviews available.</Text>;
  }

  const handleCreateReview = () => {
    setEditingReview(null);
    setModalVisible(true);
  };

  const handleReviewSubmit = async (submittedReview) => {
    try {
      if (editingReview) {
        // Updated review 
        const response = await axios.get(`/api/reviews/one/${submittedReview.id}`);
        const updatedReview = response.data;

        setReviews(
          reviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
      } else {
        setReviews([submittedReview, ...reviews]);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", "Failed to update review. Please try again.");
    } finally {
      setModalVisible(false);
      setEditingReview(null); // Reset editingReview after submission
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#00CCBB" />
        <Text className="mt-2 text-gray-500">Loading reviews...</Text>
      </View>
    );
  }

  // Custom progress bar component that works on both platforms
  const RatingBar = ({ percentage, color }) => (
    <View className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
      <View 
        className="h-full rounded-full" 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color || "#00CCBB" 
        }} 
      />
    </View>
  );

  return (
    <View >
      <Text className="pb-3 text-xl font-bold">Your Feedback Lights Us Up</Text>
      
      {/* Rating Summary Section */}
      {reviews.length > 0 && (
        <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="items-center">
              <Text className="text-3xl font-bold">{ratingStats.average}</Text>
              <View className="flex-row my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    size={16} 
                    color={star <= Math.round(ratingStats.average) ? "#00CCBB" : "#D3D3D3"} 
                  />
                ))}
              </View>
              <Text className="text-xs text-gray-500">{ratingStats.total} reviews</Text>
            </View>
            
            <View className="flex-1 ml-6">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.distribution[star - 1];
                const percentage = ratingStats.total > 0 
                  ? (count / ratingStats.total) * 100 
                  : 0;
                
                return (
                  <View key={star} className="flex-row items-center mb-1">
                    <Text className="w-6 mr-2 text-xs text-gray-500">{star}</Text>
                    <RatingBar percentage={percentage} />
                    <Text className="w-8 ml-2 text-xs text-right text-gray-500">
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          
          <TouchableOpacity
            className="bg-[#00CCBB]/20 px-3 py-2 rounded-md self-start"
            onPress={handleCreateReview}
          >
            <View className="flex-row items-center">
              <StarIcon size={16} color="#00CCBB" strokeWidth={2.5} />
              <Text className="text-[#00CCBB] font-semibold ml-1">Add Review</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Add Review Button (when no reviews) */}
      {reviews.length === 0 && (
        <TouchableOpacity
          className="bg-[#00CCBB]/20 px-3 py-2 rounded-md self-start mb-4"
          onPress={handleCreateReview}
        >
          <View className="flex-row items-center">
            <StarIcon size={16} color="#00CCBB" strokeWidth={2.5} />
            <Text className="text-[#00CCBB] font-semibold ml-1">Add Review</Text>
          </View>
        </TouchableOpacity>
      )}
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <View className="pb-5">
          <Text className="text-base font-semibold text-gray-700 mb-2">
            Customer Reviews ({reviews.length})
          </Text>
          
          {/* Filter options */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {["All", "5 ★", "4 ★", "3 ★", "2 ★", "1 ★"].map((filter, index) => (
              <TouchableOpacity 
                key={index}
                className={`mr-2 px-4 py-2 rounded-full ${activeFilter === filter ? 'bg-[#00CCBB]' : 'bg-gray-100'}`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text className={`text-sm ${activeFilter === filter ? 'text-white' : 'text-gray-700'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Reviews */}
          {getFilteredReviews().map((review) => (
            <View key={review.id} className="mb-2">
              <ReviewCard review={review} />
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-8 bg-white rounded-lg">
          <StarIcon size={40} color="#00CCBB" opacity={0.3} />
          <Text className="mt-2 text-lg font-medium text-gray-500">No reviews yet</Text>
          <Text className="text-sm text-gray-400 text-center px-6 mt-1">
            Be the first to share your experience with this restaurant
          </Text>
        </View>
      )}

      {/* Modal for Create/Edit Review Form */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="w-11/12 p-4 bg-white rounded-lg">
            <ReviewFormModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSubmit={handleReviewSubmit}
              editingReview={editingReview}
              restaurantId={restaurantId}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Reviews;
