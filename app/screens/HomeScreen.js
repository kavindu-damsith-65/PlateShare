import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Image, ScrollView, Text, TextInput, View , ImageBackground, TouchableOpacity, Dimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import Recommended from "../components/Recommended";
import Restaurants from "../components/Restaurants";

const HomeScreen = () => {
  // state and hooks
  const navigation = useNavigation();

  const category =  {"_createdAt": "2023-02-17T15:18:29Z", "_id": "f64c7e94-5eb4-49a0-8aeb-f623963ccbca", "_rev": "I13aVDhieoHVSVfjQjpB2w", "_type": "featured", "_updatedAt": "2023-02-17T18:35:01Z", "name": "Satisfy Your Cravings", "restaurants": [[Object], [Object], [Object]], "short_description": "Appetizing, varied, savory, creamy, crunchy"};

  // side effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);


  return (
    <>
      <SafeAreaView className="bg-white pt-5">
        {/* header */}
        <View className="flex-row pb-3 items-center mx-4 space-x-2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
            }}
            className=" h-7 w-7 bg-gray-300 p-4  rounded-full"
          />
          <View className="flex-1">
            <Text className="font-bold text-gray-400 text-xs">Deliver Now</Text>
            <Text className="font-bold text-xl  ">
              Current location <ChevronDownIcon size={20} color="#00CCBB" />
            </Text>
          </View>
          <UserIcon size={25} color="#00CCBB" />
        </View>

        {/* search bar */}
        <View className="flex-row mx-4 items-center space-x-2 pb-2">
          <View className="flex-row space-x-2 flex-1 bg-gray-200 p-3 rounded-md">
            <MagnifyingGlassIcon color="gray" />
            <TextInput placeholder="Restaurants and cuisines" keyboardType="default" />
          </View>
          <AdjustmentsVerticalIcon color="#00CCBB" />
        </View>

        {/* body */}
        <ScrollView className="bg-gray-100" contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Recommended section */}
          <Recommended />

          {/* featured rows */}
          <Restaurants
              key={category._id}
              title={category.name}
              description={category.short_description}
              id={category._id}
          />

          {/* Give a hand section */}
          <View style={{ width: Dimensions.get("window").width - 30, height: 200 }} className="bg-white rounded-lg m-4 shadow-lg overflow-hidden">
            <ImageBackground
                source={require('./assets/hand.jpg')}
                style={{ flex: 1, width: "100%" }}
                resizeMode="cover"
            >
              <View className="flex-1 justify-center p-4 bg-black/30">
                <Text className="text-xl font-black text-white mb-2">Be a Hero, Deliver Hope!</Text>
                <Text className="text-white mb-4 font-medium">Join our mission to fight food waste and feed those in need.</Text>
                <TouchableOpacity className="bg-[#00CCBB] rounded-full px-4 py-2 mt-2 self-start">
                  <Text className="text-white font-bold text-center">Sign Up for Delivery</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>


        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
