import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import RecommendCard from "./RecommendCard";
import useAxios from '../../hooks/useAxios';


const Recommended = () => {
    const axios = useAxios();
    const [recommendations, setRecommendations] = useState([]);

    // TODO: Replace with actual user ID 
    const userId = "user_1";

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(
                    `/api/products/recommendations/${userId}`
                );
                setRecommendations(response.data.products);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [userId]);

  // Organize recommendations into a grid layout (2 rows)
  const organizeRecommendationsIntoGrid = (items) => {
    if (!items || items.length === 0) return [];
    
    // Calculate how many items per row (half of total, rounded up)
    const itemsPerRow = Math.ceil(items.length / 2);
    
    // Create two rows
    const row1 = items.slice(0, itemsPerRow);
    const row2 = items.slice(itemsPerRow);
    
    return [row1, row2];
  };

  const gridRows = organizeRecommendationsIntoGrid(recommendations);

  return (
    <View>
      <Text className="px-4 pt-2 text-lg font-bold">Popular Categories</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {/* Grid container */}
        <View style={{ flexDirection: 'column' }}>
          {/* First row */}
          {gridRows.length > 0 && (
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {gridRows[0].map((recommendation) => (
                <RecommendCard
                  imgUrl={recommendation.image}
                  key={recommendation.id}
                  title={recommendation.name}
                />
              ))}
            </View>
          )}
          
          {/* Second row */}
          {gridRows.length > 1 && (
            <View style={{ flexDirection: 'row' }}>
              {gridRows[1].map((recommendation) => (
                <RecommendCard
                  imgUrl={recommendation.image}
                  key={recommendation.id}
                  title={recommendation.name}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Recommended;
