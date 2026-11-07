import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';  // Import the Location API
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../supabase';

const HistoryScreen = ({ navigation, route }) => {
  const [reports, setReports] = useState([]); // State for the reports
  const [currentLocation, setCurrentLocation] = useState(null); // State for the current location
  const [hasLocationPermission, setHasLocationPermission] = useState(false); // State to check permission
  const [username, setUsername] = useState('');
  const { Photo } = route.params || {};

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        setHasLocationPermission(true);
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } catch (error) {
        console.error("Error fetching location: ", error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('Name');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        } catch (error) {
            console.error("Error fetching username from AsyncStorage:", error);
        }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('Report')
          .select('Latitude, Longitude')
        if (error) {
          console.error("Error fetching reports:", error);
          return;
        }
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  if (!hasLocationPermission || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTxt}>Location permission not granted or loading...</Text>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.photoContainer}>
        {Photo ? (
                    <Image source={{ uri: Photo }} style={styles.photo} />
                    ) : (
                    <Image
                        source={require("../../assets/Profile PlaceHolder.png")}
                        style={styles.photo}
                    />
                    )}
            </View>
            <View style={styles.profileContainer}>
                <Text style={styles.helloTxt}>Hello {username}!</Text>
            </View>
                <View style={styles.logoContainer}>
                <Image source={require("../../assets/Logo.png")} style={styles.logo} />
            </View>
        </View>
        <View style={styles.absContainer}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require("../../assets/Back Button.png")} />
            </TouchableOpacity>
            <Text style={styles.absTxt}>Report Map</Text>
        </View>
      <MapView
        style={styles.map}
        provider="google" // Use Google Maps
        initialRegion={{
          latitude: currentLocation.latitude, // Use current latitude
          longitude: currentLocation.longitude, // Use current longitude
          latitudeDelta: 0.0922, // Zoom level
          longitudeDelta: 0.0421, // Zoom level
        }}
      >
        {reports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.Latitude,
              longitude: report.Longitude
            }}
            title="Reported Location"
            description={`Latitude: ${report.Latitude}, Longitude: ${report.Longitude}`}
          />
        ))}
      </MapView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F6FF',
  },
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#49B4F5",
    alignItems: "center",
},
photoContainer: {
    borderRadius: 50,
},
photo: {
  width: 70,
  height: 70,
  borderRadius: 50,
},
profileContainer: {
    marginHorizontal: 5,
    width: "40%",
},
hello: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFFAF3",
},
helloTxt: {
    color: "#FFFAF3",
},
profile: {
    color: "#FFFAF3",
},
logoContainer: {
    marginLeft: "auto",
    backgroundColor: "#FFFAF3",
    borderRadius: 40,
    padding: 2.5,
},
logo: {
    width: 70,
    height: 70,
  },
absContainer: {
  position: "absolute",
  top: "13%",
  zIndex: 1,
  flexDirection: 'row',
  justifyContent: "space-between", // Space out children
  alignItems: "center",
  width: "100%", // Ensure the container spans the full width
  paddingHorizontal: 20, // Add padding for spacing
},
backBtn: {
  backgroundColor: 'white',
  borderRadius: 25,
  padding: 10,
},
absTxt: {
  fontWeight: 'bold',
  fontSize: 22,
},
map: {
  flex: 1,
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