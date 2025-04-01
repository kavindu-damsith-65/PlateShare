import { View, Text, ScrollView } from "react-native";
import React from "react";
import DishRow from "./DishRow";
import { dishes } from "../data/dishes";

const NearbyFoods = () => {

    return (
        <View>
            <Text className="font-bold text-lg px-4 pt-2">Foods Near You</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 10,
                }}
            >
                {dishes.map((dish) => (
                    <DishRow
                        key={dish._id}
                        id={dish._id}
                        name={dish.name}
                        description={dish.short_description}
                        price={dish.price}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default NearbyFoods;
