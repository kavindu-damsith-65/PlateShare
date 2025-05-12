import {Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {StarIcon} from "react-native-heroicons/outline";
import React from "react";
import ReviewFormModal from "../Buyer/ReviewFormModal";


const DonationItem = ({ donation, isFromHistory }) => {
    const [selectedRestaurant, setSelectedRestaurant] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleAddReview = (donation) => {
        setSelectedRestaurant({
            id: donation.restaurant.id,
            name: donation.restaurant.name
        });
        setModalVisible(true);
    };

    const handleReviewSubmit = (reviewData) => {
        setModalVisible(false);
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
                          customUserId="user_3" // Pass the organization user ID
                      />
                  </View>
              </View>
          </Modal>
      </View>
  );
};

export default DonationItem;
