import { View, Text, ScrollView } from "react-native";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DishRow from "./DishRow";

const NearbyFoods = () => {
    const [dishes, setDishes] = useState([]);
    const location = "Buyer Location 1";

    useEffect(() => {
        const fetchNearbyFoods = async () => {
            try {
                const response = await axios.get(`http://192.168.105.16:3001/api/products/${location}`);
                setDishes(response.data.products);
            } catch (error) {
                console.error("Error fetching nearby foods:", error);
            }
        };

        fetchNearbyFoods().then(r => {});
    }, []);

    useEffect(() => {
        console.log(dishes);
    }, [dishes]);


    return (
        <View className="pb-4">
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
                        key={dish._id || dish.id}
                        id={dish._id || dish.id}
                        name={dish.name}
                        description={dish.description || dish.short_description}
                        price={dish.price}
                        image={dish.image}
                        has_subs={dish.has_subs}
                        sub_products={dish.sub_products}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default NearbyFoods;
