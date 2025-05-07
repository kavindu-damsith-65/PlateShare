import { NavigationContainer } from "@react-navigation/native";
import { TailwindProvider } from "tailwindcss-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Platform } from 'react-native';

import RestaurantScreen from "./screens/RestaurantScreen";
import { store } from "./store";
import PreparingScreen from "./screens/PreparingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AllRestaurantsScreen from "./screens/AllRestaurantsScreen";
import AllNearbyFoodsScreen from "./screens/AllNearbyFoodsScreen";
import LoginScreen from "./screens/LoginScreen";
import BuyerTabs from "./screens/BuyerTabs";
import OrganizationTabs from "./screens/organisation/OrganizationTabs";
import RequestDetails from "./screens/organisation/RequestDetails";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();

function App(){
    const [isProfileVisible, setProfileVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const role = await AsyncStorage.getItem('userRole');
                setUserRole(role);
                setIsLoggedIn(!!role);
                setIsLoading(false);
            } catch (error) {
                console.error('Error checking user role:', error);
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="#00CCBB" />
                <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Provider store={store}>
                <TailwindProvider platform={Platform.OS}>
                    <Stack.Navigator initialRouteName={userRole ? (userRole === 'buyer' ? 'Main' : 'OrganizationDashboard') : 'Login'}>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Main"
                            options={{ headerShown: false }}
                        >
                            {() => <BuyerTabs setProfileVisible={setProfileVisible} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="OrganizationDashboard"
                            component={OrganizationTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Restaurant"
                            component={RestaurantScreen}
                        />
                        <Stack.Screen
                            name="RequestDetails"
                            component={RequestDetails}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="Prepare"
                            component={PreparingScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="Delivery"
                            component={DeliveryScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="AllRestaurantsScreen"
                            component={AllRestaurantsScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="AllNearbyFoodsScreen"
                            component={AllNearbyFoodsScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Group screenOptions={{ presentation: 'modal' }}>
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        </Stack.Group>
                        <Stack.Screen
                            name="SearchScreen"
                            component={SearchScreen}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </TailwindProvider>
            </Provider>
        </NavigationContainer>
    );
}

export default App;
