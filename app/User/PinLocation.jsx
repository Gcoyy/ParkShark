import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const PinLocationScreen = ({ navigation, route }) => {
  const { photo } = route.params;
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

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

  const handleMapLongPress = ({ nativeEvent }) => {
    const { latitude, longitude } = nativeEvent.coordinate;
    setPinnedLocation({ latitude, longitude });
  };

  if (!hasLocationPermission || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTxt}>Location permission not granted or loading...</Text>
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
          <Text style={styles.titleTxt}>Pin Location</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleMapLongPress}
      >
        {pinnedLocation && (
          <Marker
            coordinate={pinnedLocation}
            title="Pinned Location"
            description={`Latitude: ${pinnedLocation.latitude}, Longitude: ${pinnedLocation.longitude}`}
          />
        )}
      </MapView>
      <View style={styles.pinContainer}>
        <TouchableOpacity style={styles.pinBtn} onPress={() => {
          if (pinnedLocation) {
            navigation.navigate('Input Report Details', {
              photo: photo,
              latitude: pinnedLocation.latitude, 
              longitude: pinnedLocation.longitude,
            });
          } else {
            alert('Please pin a location.');
          }
        }}>
          <Text style={styles.pinTxt}>
            Pin Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PinLocationScreen;

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
    height: '15%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pinBtn: {
    marginBottom: 30,
    width: "80%",
    backgroundColor: '#3E6277',
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 4,
  },
  pinTxt: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
  },
});