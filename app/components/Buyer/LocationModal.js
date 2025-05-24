import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    Alert
} from "react-native";
import {
    MapPinIcon,
    XMarkIcon,
    MapIcon
} from "react-native-heroicons/outline";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationModal = ({
                           visible,
                           onClose,
                           currentLocation,
                           onLocationChange,
                           savedLocations = []
                       }) => {
    const [newLocation, setNewLocation] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [selectedMapLocation, setSelectedMapLocation] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [locationPermission, setLocationPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');

            if (status === 'granted') {
                getUserLocation();
            }
        })();
    }, []);

    const getUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setMapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    const handleUseCurrentLocation = async () => {
        if (!locationPermission) {
            Alert.alert(
                "Location Permission Required",
                "Please enable location services to use your current location",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Settings", onPress: () => Location.openSettings() }
                ]
            );
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const locationString = `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            onLocationChange(locationString);
        } catch (error) {
            Alert.alert("Error", "Could not get your current location. Please try again.");
            console.error(error);
        }
    };

    const handleAddNewLocation = () => {
        if (newLocation.trim()) {
            onLocationChange(newLocation);
            setNewLocation("");
        }
    };

    const handleMapPress = (event) => {
        setSelectedMapLocation(event.nativeEvent.coordinate);
        setMapRegion({
            ...mapRegion,
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
        });
    };

    const handleSelectMapLocation = () => {
        if (selectedMapLocation) {
            const coords = selectedMapLocation;
            const locationString = locationName.trim()
                ? `${locationName} - ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
                : `Location at ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;

            onLocationChange(locationString);
            setLocationName("");
            setSelectedMapLocation(null);
            setShowMap(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-xl p-5 h-2/3">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-xl font-bold">
                            {showMap ? "Select on Map" : "Change Location"}
                        </Text>
                        <TouchableOpacity onPress={showMap ? () => setShowMap(false) : onClose}>
                            <XMarkIcon size={24} color="#00CCBB" />
                        </TouchableOpacity>
                    </View>

                    {showMap ? (
                        // Map View
                        <View className="flex-1">
                            <MapView
                                style={styles.map}
                                region={mapRegion}
                                onPress={handleMapPress}
                            >
                                {selectedMapLocation && (
                                    <Marker
                                        coordinate={selectedMapLocation}
                                        pinColor="#00CCBB"
                                    />
                                )}
                            </MapView>

                            <View className="mt-3 mb-3">
                                <TextInput
                                    className="p-3 bg-gray-100 rounded-lg mb-3"
                                    placeholder="Name this location (e.g., Home, Work)"
                                    value={locationName}
                                    onChangeText={setLocationName}
                                />

                                <TouchableOpacity
                                    className="bg-[#00CCBB] p-3 rounded-lg"
                                    onPress={handleSelectMapLocation}
                                    disabled={!selectedMapLocation}
                                >
                                    <Text className="text-white font-medium text-center">
                                        {selectedMapLocation ? "Confirm Location" : "Tap on the map to select a location"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        // Regular Location Selection View
                        <>
                            {/* Current location */}
                            <TouchableOpacity
                                className="flex-row items-center p-3 bg-gray-100 rounded-lg mb-3"
                                onPress={handleUseCurrentLocation}
                            >
                                <MapPinIcon size={20} color="#00CCBB" />
                                <Text className="ml-2 font-medium">Use current location</Text>
                            </TouchableOpacity>

                            {/* Select on map button */}
                            <TouchableOpacity
                                className="flex-row items-center p-3 bg-gray-100 rounded-lg mb-3"
                                onPress={() => setShowMap(true)}
                            >
                                <MapIcon size={20} color="#00CCBB" />
                                <Text className="ml-2 font-medium">Select on map</Text>
                            </TouchableOpacity>

                            {/* New location input */}
                            <View className="flex-row items-center mb-5">
                                <TextInput
                                    className="flex-1 p-3 bg-gray-100 rounded-lg mr-2"
                                    placeholder="Enter a new address"
                                    value={newLocation}
                                    onChangeText={setNewLocation}
                                />
                                <TouchableOpacity
                                    className="bg-[#00CCBB] p-3 rounded-lg"
                                    onPress={handleAddNewLocation}
                                >
                                    <Text className="text-white font-medium">Add</Text>
                                </TouchableOpacity>
                            </View>

                            <Text className="font-bold text-gray-700 mb-2">Saved Locations</Text>
                            {savedLocations.map((location, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="p-3 border-b border-gray-100"
                                    onPress={() => onLocationChange(location)}
                                >
                                    <Text className="font-medium">{location}</Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
});

export default LocationModal;
