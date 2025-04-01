import { View, ScrollView } from "react-native";
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




    return (
        <View>
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
                        imgUrl={restaurant.image}
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
