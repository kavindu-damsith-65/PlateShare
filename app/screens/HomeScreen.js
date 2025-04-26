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
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import Recommended from "../components/Recommended";
import Restaurants from "../components/Restaurants";
import NearbyFoods from "../components/NearbyFoods";
import SignUpCards from "../components/SignUpCards";

const HomeScreen = () => {
  const navigation = useNavigation();

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
      <Restaurants key="restaurants" />,
      // NearbyFoods section
      <NearbyFoods key="nearbyFoods" />,
      // SignUpCards section
      <SignUpCards key="signUpCards" />,
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
