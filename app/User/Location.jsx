import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';  // Import the Location API


const LocationScreen = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState(null); // State for the current location
  const [hasLocationPermission, setHasLocationPermission] = useState(false); // State to check permission
  const {latitude, longitude } = route.params || {};

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (hasLocationPermission) {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      }
    })();
  }, [hasLocationPermission]);

  if (!hasLocationPermission || !currentLocation) {
    return (
      <View style={styles.container}>
        <Text>Location permission not granted or loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/Back Button.png')}
              style={styles.back}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Image source={require("../../assets/Location Pin.png")} />
          <Text style={styles.titleTxt}>Location</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        provider="google" // Use Google Maps
        initialRegion={{
          latitude: latitude, // Use latitude from route
          longitude: longitude, // Use longitude from route
          latitudeDelta: 0.0922, // Zoom level
          longitudeDelta: 0.0421, // Zoom level
        }}
      >
        <Marker
          coordinate={{
            latitude: latitude, // Use latitude from route
            longitude: longitude, // Use longitude from route
          }}
        />
      </MapView>
      <View style={styles.pinContainer}>
      </View>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F6FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: '10%',
  },
  backContainer: {
    borderRadius: 25,
    marginLeft: 5,
  },
  backBtn: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: "auto",
    marginRight: 10,
  },
  titleTxt: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  pinContainer: {
    height: '10%',
  },
});

