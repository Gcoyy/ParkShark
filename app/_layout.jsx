import 'react-native-gesture-handler';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginNavigator from './LoginScreen';
import SignUpNavigator from './SignUpScreen';
import UserHomeScreen from './User/UserHomeScreen';
import CameraScreen from "./User/CameraScreen";
import ViewProfileScreen from "./User/ViewProfileScreen";
import EditProfileScreen from "./User/EditProfileScreen";
import ViewMyReportsScreen from "./User/ViewMyReportsScreen";
import SavedMessageScreen from "./User/SavedMessageScreen";
import PinLocationScreen from './User/PinLocation';
import SubmissionMessageScreen from './User/SubmissionMessageScreen';
import InputDetailsScreen from './User/InputReportDetailsScreen';
import LocationScreen from './User/Location';
import DetailedReportScreen from './User/DetailedReportScreen';
import EnforcerHomeScreen from './Enforcer/EnforcerHomeScreen';
import ViewAllReportsScreen from './Enforcer/ViewAllReports';
import UpdateStatusScreen from './Enforcer/UpdateStatus';
import MapScreen from './Enforcer/Map';
import HistoryScreen from './Enforcer/ViewParkingPatterns';
import * as Font from 'expo-font';

const Stack = createStackNavigator();

// Main App Component
const HomeScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [token, setToken] = useState(null);

  // Load custom font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins': require('../assets/fonts/Poppins-Regular.ttf'), // Update with your font path
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo.png')}
        style={styles.logo}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Sign Up')}
      >
        <Text style={styles.signupText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Login" component={LoginNavigator}/>
      <Stack.Screen name="Sign Up" component={SignUpNavigator}/>
      <Stack.Screen name="User" component={UserHomeScreen}/>
        <Stack.Screen name="View Profile" component={ViewProfileScreen}/>
        <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
          <Stack.Screen name="Saved Message" component={SavedMessageScreen}/>
        <Stack.Screen name="Camera Screen" component={CameraScreen}/>
          <Stack.Screen name="Input Report Details" component={InputDetailsScreen} />
          <Stack.Screen name="Map" component={PinLocationScreen}/>
            <Stack.Screen name="SuccessMessage" component={SubmissionMessageScreen}/>
        <Stack.Screen name="View Reports" component={ViewMyReportsScreen}/>
        <Stack.Screen name="Report Details" component={DetailedReportScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Enforcer" component={EnforcerHomeScreen}/>
      <Stack.Screen name="View All Reports" component={ViewAllReportsScreen}/>
        <Stack.Screen name="Update" component={UpdateStatusScreen}/>
        <Stack.Screen name="GPS" component={MapScreen}/>
      <Stack.Screen name="History" component={HistoryScreen}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf3',
  },
  logo: {
    width: "80%",
    height: "40%",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#0AF',
    borderRadius: 100,
    // paddingTop: 5,
    paddingVertical: 5,
    width: "60%",
    elevation: 4,
  },
  signupButton: {
    backgroundColor: '#ACD6EF',
    borderRadius: 100,
    // paddingTop: 5,
    paddingVertical: 5,
    marginTop: 37,
    elevation: 4,
    width: "60%",
  },
  loginText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  signupText: {
    color: '#3E6277',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});
