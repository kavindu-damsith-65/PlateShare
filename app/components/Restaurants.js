import {View, ScrollView, Text} from "react-native";
import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import SanityClient from "../sanity";

const Restaurants = ({ id }) => {
    const [restaurants, setRestaurants] = useState([]);

    /*
        TODO: set restaurants for the user based on location
     */
    useEffect(() => {
        SanityClient.fetch(
            `
      
      *[_type == "featured" && _id == $id]{
        ...,
        restaurants[]->{
          ...,
        dishes[]->,
          type-> {
            name
          }
          
        }
     }[0]


      `,
            { id },
        ).then((data) => setRestaurants(data?.restaurants));
    }, [id]);

    useEffect(() => {
        console.log(restaurants);
    }, [restaurants]);



    return (
        <View>
            <Text className="font-bold text-lg px-4 pt-3">Restaurants Near You</Text>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                horizontal
                className="pt-4"
            >
                {/* restaurant cards */}
                {restaurants?.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant._id}
                        id={restaurant._id}
                        imgUrl={"https://picsum.photos/400/300?random=127"}
                        title={restaurant.name}
                        rating={restaurant.rating}
                        genre={restaurant.type?.name}
                        address={restaurant.address}
                        short_description={restaurant.short_description}
                        dishes={restaurant.dishes}
                        long={restaurant.long}
                        lat={restaurant.lat}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Restaurants;
