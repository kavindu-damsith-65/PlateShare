import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeliveryDashboard from './DeliveryDashboard';
import DeliveryOrders from './DeliveryOrders';
import DeliveryHistory from './DeliveryHistory';
import DeliveryProfile from './DeliveryProfile';

const Tab = createBottomTabNavigator();

export default function DeliveryTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "My Deliveries") {
            iconName = "bicycle-outline";
          } else if (route.name === "History") {
            iconName = "time-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00CCBB",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DeliveryDashboard} />
      <Tab.Screen name="My Deliveries" component={DeliveryOrders} />
      <Tab.Screen name="History" component={DeliveryHistory} />
      <Tab.Screen name="Profile" component={DeliveryProfile} />
    </Tab.Navigator>
  );
}