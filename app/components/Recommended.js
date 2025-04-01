import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import RecommendCard from "./RecommendCard";
import SanityClient, { urlFor } from "../sanity";


const Recommended = () => {
    const [recommendations, setRecommendations] = useState([]);

    /*
     TODO : Add recommended foods for the user based on past data
        and set those to recommendations
     */
    useEffect(() => {
        SanityClient.fetch(
            `

    *[_type == "category"]
    `,
        ).then((data) => setRecommendations(data));
    }, []);


    return (
        <View>
            <Text className="font-bold text-lg px-4 pt-2">Recommended For You</Text>
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
                        imgUrl={urlFor(recommendation.image).width(500).url()}
                        key={recommendation._id}
                        title={recommendation.name}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Recommended;
