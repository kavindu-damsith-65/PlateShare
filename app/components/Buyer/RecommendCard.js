import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const RecommendCard = ({ imgUrl, title }) => {
  return (
    <TouchableOpacity 
      className="items-center mr-3" 
      style={{ width: 70 }}
    >
      <View className="relative">
        {/* Image with shadow and border effect */}
        <View 
          className="rounded-full" 
          style={{ 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View className="p-[1.5px] rounded-full bg-white">
            <View className="p-[0.5px] rounded-full bg-[#00CCBB10]">
              <Image
                source={{ uri: imgUrl }}
                className="w-16 h-16 rounded-full"
                style={{ borderWidth: 0.5, borderColor: "#00CCBB20" }}
              />
            </View>
          </View>
        </View>
        
        {/* Highlight effect */}
        <View 
          className="absolute top-0 left-0 w-16 h-8 rounded-t-full" 
          style={{ 
            backgroundColor: "rgba(255,255,255,0.15)",
            transform: [{ scaleX: 1 }]
          }} 
        />
      </View>
      
      {/* Title with better typography */}
      <Text 
        className="mt-1 text-xs font-medium text-center" 
        style={{ color: "#404040" }} 
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default RecommendCard;
