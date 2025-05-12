import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import RecommendCard from "./RecommendCard";
import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const Recommended = () => {
    const [recommendations, setRecommendations] = useState([]);

    // TODO: Replace with actual user ID 
    const userId = "user_1";

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/products/recommendations/${userId}`
                );
                setRecommendations(response.data.products);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [userId]);

  // Helper function to chunk recommendations into groups of 6
  const chunkRecommendations = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const recommendationChunks = chunkRecommendations(recommendations, 6);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 10,
      }}
    >
      <Text className="px-4 pt-2 text-lg font-bold">Popular Categories</Text>
      {recommendationChunks.map((chunk, index) => (
        <ScrollView
          key={index}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 10,
          }}
        >
          {chunk.map((recommendation) => (
            <RecommendCard
              imgUrl={recommendation.image}
              key={recommendation.id}
              title={recommendation.name}
            />
          ))}
        </ScrollView>
      ))}
    </ScrollView>
  );
};

export default Recommended;
