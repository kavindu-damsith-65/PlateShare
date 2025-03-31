// <Tab.Navigator
//     screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//             let iconName;
//             if (route.name === "Home") {
//                 iconName = "home-outline";
//             } else if (route.name === "Basket") {
//                 iconName = "list-outline";
//             }  else if (route.name === "Profile") {
//                 iconName = "person-outline";
//             }
//             return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#00CCBB",
//         tabBarInactiveTintColor: "gray",
//     })}
// >
//     <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//     <Tab.Screen name="Basket" component={BasketScreen} options={{ headerShown: false }} />
//     <Tab.Screen name="Profile" component={HomeScreen} options={{ headerShown: false }} />
// </Tab.Navigator>
