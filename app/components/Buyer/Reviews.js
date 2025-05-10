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
import axios from "axios";
import ReviewCard from "./ReviewCard";
import ReviewFormModal from "./ReviewFormModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const Reviews = ({ restaurantId }) => {
  const scrollViewRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/reviews/all/${restaurantId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
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

  const handleEditReview = (review) => {
    setEditingReview(review);
    setModalVisible(true);
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
              Alert.alert(
                "Error",
                "Failed to delete review. Please try again."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleReviewSubmit = async (submittedReview) => {
    try {
      if (editingReview) {
        // Updated review 
        const response = await axios.get(`${BACKEND_URL}/api/reviews/one/${submittedReview.id}`);
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

 return (
  <View className="mt-6">
    <Text className="pb-3 text-xl font-bold">Your Feedback Lights Us Up</Text>
    <TouchableOpacity
      className="bg-[#00CCBB] px-3 py-2 rounded-md mr-64"
      onPress={handleCreateReview}
    >
      <Text className="font-medium text-white">Add Review</Text>
    </TouchableOpacity>
   {reviews.length > 0 ? (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={() => setIsUserScrolling(true)}
        onScrollEndDrag={() => setIsUserScrolling(false)}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH - 30 + 16}
        snapToAlignment="center"
        className="pb-5"
      >
        {reviews.map((review, index) => (
          <View
            key={index}
            style={{
              width: SCREEN_WIDTH - 30,
              marginRight: 16,
            }}
          >
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          </View>
        ))}
      </ScrollView>
    ) : (
      <Text className="mt-4 text-gray-500">No reviews available.</Text>
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
