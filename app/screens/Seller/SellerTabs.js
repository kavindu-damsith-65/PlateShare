import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import SellerDashboard from './SellerDashboard';
import SellerRequests from './SellerRequests';
import SellerHistory from './SellerHistory';
import SellerMenu from './SellerMenu';
import SellerProfile from './SellerProfile';

const Tab = createBottomTabNavigator();

export default function SellerTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Dashboard") {
                        iconName = "home-outline";
                    } else if (route.name === "Requests") {
                        iconName = "time-outline";
                    } else if (route.name === "History") {
                        iconName = "document-text-outline";
                    } else if (route.name === "Menu") {
                        iconName = "restaurant-outline";
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
            <Tab.Screen name="Dashboard" component={SellerDashboard} />
            <Tab.Screen name="Requests" component={SellerRequests} />
            <Tab.Screen name="History" component={SellerHistory} />
            <Tab.Screen name="Menu" component={SellerMenu} />
            <Tab.Screen name="Profile" component={SellerProfile} />
        </Tab.Navigator>
    );
}