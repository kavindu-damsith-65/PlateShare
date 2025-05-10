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


    return (
        <View>
            <Text className="px-4 pt-2 text-lg font-bold">Recommended For You</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 10,
                }}
            >
                {/* Recommendation Card */}
                {recommendations.map((recommendation) => (
                    <RecommendCard
                        imgUrl={recommendation.image}
                        key={recommendation.id}
                        title={recommendation.name}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Recommended;
