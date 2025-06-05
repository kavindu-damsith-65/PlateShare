import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import RecommendCard from "./RecommendCard";
import useAxios from '../../hooks/useAxios';


const Recommended = () => {
    const axios = useAxios();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    // TODO: Replace with actual user ID 
    const userId = "user_1";

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `/api/products/recommendations/${userId}`
                );
                setRecommendations(response.data.products);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
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

  if (loading) {
    // Create 8 skeleton items (4 in each row)
    const skeletonRow1 = [1, 2, 3, 4];
    const skeletonRow2 = [5, 6, 7, 8];

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
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {skeletonRow1.map((id) => (
                <View
                  key={`skeleton-${id}`}
                  className="items-center mr-3"
                  style={{ width: 70 }}
                >
                  <View className="relative">
                    <View
                      className="rounded-full bg-gray-200"
                      style={{
                        width: 64,
                        height: 64,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    />
                  </View>

                  {/* Title placeholder */}
                  <View
                    className="mt-1 rounded-full bg-gray-200"
                    style={{ height: 12, width: 50 }}
                  />
                </View>
              ))}
            </View>

            {/* Second row */}
            <View style={{ flexDirection: 'row' }}>
              {skeletonRow2.map((id) => (
                <View
                  key={`skeleton-${id}`}
                  className="items-center mr-3"
                  style={{ width: 70 }}
                >
                  <View className="relative">
                    <View
                      className="rounded-full bg-gray-200"
                      style={{
                        width: 64,
                        height: 64,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    />
                  </View>

                  {/* Title placeholder */}
                  <View
                    className="mt-1 rounded-full bg-gray-200"
                    style={{ height: 12, width: 50 }}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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
