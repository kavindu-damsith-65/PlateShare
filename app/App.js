import { NavigationContainer } from "@react-navigation/native";
import { TailwindProvider } from "tailwindcss-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { StripeProvider } from '@stripe/stripe-react-native';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Platform } from 'react-native';

import RestaurantScreen from "./screens/Buyer/RestaurantScreen";
import { store } from "./store";
import PreparingScreen from "./screens/PreparingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import AllRestaurantsScreen from "./screens/Buyer/AllRestaurantsScreen";
import AllNearbyFoodsScreen from "./screens/Buyer/AllNearbyFoodsScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import BuyerTabs from "./screens/Buyer/BuyerTabs";
import OrganizationTabs from "./screens/organisation/OrganizationTabs";
import SellerTabs from "./screens/Seller/SellerTabs";
import DeliveryTabs from "./screens/Delivery/DeliveryTabs";
import RequestDetails from "./screens/organisation/RequestDetails";
import SellerRequestDetails from "./screens/Seller/SellerRequestDetails";
import SellerDonationForm from "./screens/Seller/SellerDonationForm";
import SearchScreen from "./screens/Buyer/SearchScreen";
import CategoryResultsScreen from "./screens/Buyer/CategoryResultsScreen";
import SearchResultsScreen from "./screens/Buyer/SearchResultsScreen";
import CheckoutScreen from "./screens/Buyer/CheckoutScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import ForgotPassScreen from "./screens/Auth/ForgotPassScreen";

const Stack = createNativeStackNavigator();

function App() {
    const [isProfileVisible, setProfileVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const role = await AsyncStorage.getItem('userRole');

                // setUserRole(role);
                // setIsLoggedIn(!!role);
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
                    <StripeProvider
                    publishableKey={process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51PTpvf09I3fN7mCT7vXxyWe679a3SVfurihlsN1HlkS3WPffQW9uKyvmRnXv5xyyikN9TFMkFsYUyUjDYKOAzclw003rvNg99T"}
                    >
                    <Stack.Navigator initialRouteName={userRole ? (userRole === 'buyer' ? 'BuyerDashboard' : userRole === 'seller' ? 'SellerDashboard' : userRole === 'delivery' ? 'DeliveryDashboard' : 'OrganizationDashboard') : 'Login'}>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignupScreen}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPassScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="BuyerDashboard"
                            component={BuyerTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="OrganizationDashboard"
                            component={OrganizationTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SellerDashboard"
                            component={SellerTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="DeliveryDashboard"
                            component={DeliveryTabs}
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
                            name="SellerRequestDetails"
                            component={SellerRequestDetails}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="SellerDonationForm"
                            component={SellerDonationForm}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="Checkout"
                            component={CheckoutScreen}
                            options={{ headerShown: true, title: 'Payment' }}
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
                        <Stack.Screen
                            name="SearchScreen"
                            component={SearchScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="CategoryResults"
                            component={CategoryResultsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SearchResults"
                            component={SearchResultsScreen}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                    </StripeProvider>
                </TailwindProvider>
            </Provider>
        </NavigationContainer>
    );
}

export default App;
