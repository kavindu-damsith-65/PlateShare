import { NavigationContainer } from "@react-navigation/native";
import { TailwindProvider } from "tailwindcss-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import {
    CardStyleInterpolators,
    TransitionPresets,
    TransitionSpecs,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import  {useNavigation} from "@react-navigation/native";

import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import { store } from "./store";
import BasketScreen from "./screens/BasketScreen";
import PreparingScreen from "./screens/PreparingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AllRestaurantsScreen from "./screens/AllRestaurantsScreen";
import AllNearbyFoodsScreen from "./screens/AllNearbyFoodsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const MainTabs = ({setProfileVisible}) => {
    const  navigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = "home-outline";
                    } else if (route.name === "Basket") {
                        iconName = "list-outline";
                    } else if (route.name === "Profile") {
                        iconName = "person-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#00CCBB",
                tabBarInactiveTintColor: "gray",
                ...TransitionPresets.FadeFromBottomAndroid, // Add transition animation

            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Basket" component={BasketScreen} options={{ headerShown: false }} />
            <Tab.Screen
                name="Profile"
                component={HomeScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("Profile");
                        setProfileVisible(true);
                    },
                }}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};

function App(){

    const [isProfileVisible, setProfileVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Example state for login status
    const user = { image: "https://example.com/user.jpg", name: "John Doe", email: "john@example.com" }; // Example user data


    return (
        <NavigationContainer>
            <Provider store={store}>
                <TailwindProvider>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Main"
                            options={{ headerShown: false }}
                        >
                            {() => <MainTabs setProfileVisible={setProfileVisible} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="Restaurant"
                            component={RestaurantScreen}
                        />
                        <Stack.Screen
                            name="Basket"
                            component={BasketScreen}
                            options={{
                                presentation: "modal",
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
                    </Stack.Navigator>
                    {/*<ProfileScreen*/}
                    {/*    visible={isProfileVisible}*/}
                    {/*    onClose={() => setProfileVisible(false)}*/}
                    {/*    isLoggedIn={isLoggedIn}*/}
                    {/*    user={user}*/}
                    {/*/>*/}
                </TailwindProvider>
            </Provider>
        </NavigationContainer>
    );
}

export default App;
