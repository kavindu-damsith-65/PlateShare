import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const SignUpCard = ({ title, description, buttonText, imageSource }) => {
  return (
    <View
      style={{ width: Dimensions.get("window").width - 30, height: 200 }}
      className="m-4 overflow-hidden bg-white rounded-lg shadow-lg"
    >
      <ImageBackground
        source={imageSource}
        style={{ flex: 1, width: "100%" }}
        resizeMode="cover"
      >
        <View className="justify-center flex-1 p-4 bg-black/30">
          <Text className="mb-2 text-xl font-black text-white">
            {title}
          </Text>
          <Text className="mb-4 font-medium text-white">
            {description}
          </Text>
          <TouchableOpacity className="bg-[#00CCBB] rounded-full px-4 py-2 mt-2 self-start">
            <Text className="font-bold text-center text-white">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUpCard;