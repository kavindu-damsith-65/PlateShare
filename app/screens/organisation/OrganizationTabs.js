import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import OrganizationDashboard from './OrganizationDashboard';
import OrganizationRequests from './OrganizationRequests';
import OrganizationHistory from './OrganizationHistory';
import OrganizationProfile from './OrganizationProfile';

const Tab = createBottomTabNavigator();

export default function OrganizationTabs() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = "home-outline";
          } else if (route.name === "Requests") {
            iconName = "clipboard-outline";
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
      <Tab.Screen name="Dashboard" component={OrganizationDashboard} />
      <Tab.Screen name="Requests" component={OrganizationRequests} />
      <Tab.Screen name="History" component={OrganizationHistory} />
      <Tab.Screen name="Profile" component={OrganizationProfile} />
    </Tab.Navigator>
  );
}
