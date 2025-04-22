import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import {
  Image,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import Recommended from "../components/Recommended";
import Restaurants from "../components/Restaurants";
import NearbyFoods from "../components/NearbyFoods";

const HomeScreen = () => {
  const navigation = useNavigation();

  const category = {
    _createdAt: "2023-02-17T15:18:29Z",
    _id: "f64c7e94-5eb4-49a0-8aeb-f623963ccbca",
    _rev: "I13aVDhieoHVSVfjQjpB2w",
    _type: "featured",
    _updatedAt: "2023-02-17T18:35:01Z",
    name: "Satisfy Your Cravings",
    restaurants: [[Object], [Object], [Object]],
    short_description: "Appetizing, varied, savory, creamy, crunchy",
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // Components to render in the FlatList
  const renderSections = () => {
    return [
      // Recommended section
      <Recommended key="recommended" />,

      // Restaurants section
      <Restaurants
        key={category._id}
        title={category.name}
        description={category.short_description}
        id={category._id}
      />,

      // NearbyFoods section
      <NearbyFoods key="nearbyFoods" />,

      // Horizontal scroll view for sign-up cards
      <ScrollView
        key="signUpCards"
        showsHorizontalScrollIndicator={false}
        horizontal
        className="pb-5 "
      >
        {/* Sign Up for Delivery Card */}
        <View
          style={{ width: Dimensions.get("window").width - 30, height: 200 }}
          className="m-4 overflow-hidden bg-white rounded-lg shadow-lg"
        >
          <ImageBackground
            source={require("./assets/hand.jpg")}
            style={{ flex: 1, width: "100%" }}
            resizeMode="cover"
          >
            <View className="justify-center flex-1 p-4 bg-black/30">
              <Text className="mb-2 text-xl font-black text-white">
                Be a Hero, Deliver Hope!
              </Text>
              <Text className="mb-4 font-medium text-white">
                Join our mission to fight food waste and feed those in need.
              </Text>
              <TouchableOpacity className="bg-[#00CCBB] rounded-full px-4 py-2 mt-2 self-start">
                <Text className="font-bold text-center text-white">
                  Sign Up for Delivery
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Sign Up for Restaurant Card */}
        <View
          style={{ width: Dimensions.get("window").width - 30, height: 200 }}
          className="m-4 overflow-hidden bg-white rounded-lg shadow-lg"
        >
          <ImageBackground
            source={require("./assets/restaurant.jpg")}
            style={{ flex: 1, width: "100%" }}
            resizeMode="cover"
          >
            <View className="justify-center flex-1 p-4 bg-black/30">
              <Text className="mb-2 text-xl font-black text-white">
                Turn Surplus into Success!
              </Text>
              <Text className="mb-4 font-medium text-white">
                Partner with us to reduce food waste and make a difference.
              </Text>
              <TouchableOpacity className="bg-[#00CCBB] rounded-full px-4 py-2 mt-2 self-start">
                <Text className="font-bold text-center text-white">
                  Sign Up for Restaurant
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>,
    ];
  };

  return (
    <SafeAreaView className="pt-3 bg-white">
      {/* Header section*/}
      <View key="header" className="flex-row items-center pb-3 mx-4 space-x-2">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
          }}
          className="p-4 bg-gray-300 rounded-full h-7 w-7"
        />
        <View className="flex-1">
          <Text className="text-xs font-bold text-gray-400">Deliver Now</Text>
          <Text className="text-xl font-bold">
            Current location <ChevronDownIcon size={20} color="#00CCBB" />
          </Text>
        </View>
        <UserIcon size={25} color="#00CCBB" />
      </View>

      {/*Search bar section*/}
      <View key="search" className="flex-row items-center pb-2 mx-4 space-x-2">
        <View className="flex-row flex-1 p-3 space-x-2 bg-gray-100 rounded-md">
          <MagnifyingGlassIcon color="gray" />
          <TextInput
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>
        <AdjustmentsVerticalIcon color="#00CCBB" />
      </View>

      <FlatList
        data={[{ key: "dummy" }]}
        renderItem={() => null}
        ListHeaderComponent={<>{renderSections().map((section) => section)}</>}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="bg-gray-100"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
