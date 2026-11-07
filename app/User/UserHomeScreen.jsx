import { View, Text, TouchableOpacity, Image, StyleSheet, } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../supabase"; // Import the supabase client
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
  
const UserHomeScreen = ({ navigation, route }) => {
    const [username, setUsername] = useState("");
    const [localPath, setLocalPath] = useState(null);
    const isFocused = useIsFocused();
  
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("username");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
    
  
    useEffect(() => {
      const fetchUsername = async () => {
        try {
          const storedUsername = await AsyncStorage.getItem("username");
          if (storedUsername) {
            setUsername(storedUsername);
          }
        } catch (error) {
          console.error("Error fetching username from AsyncStorage:", error);
        }
      };
      if (isFocused) {
        fetchUsername();
      }
    }, [isFocused]);
  
    // Fetch and download profile image
    useEffect(() => {
      const fetchAndDownloadImage = async () => {
        try {
          const { data, error } = supabase.storage
            .from("user-photos")
            .getPublicUrl(`${username}.jpeg`);
    
          if (error) {
            alert("Error fetching image URL: " + error.message);
            console.error(error);
            return;
          }
    
          // Append a timestamp to force fetching a fresh URL
          const publicUrl = `${data.publicUrl}`;
    
          const localFilename = `${username}-profile.jpg`;
          const localUri = `${FileSystem.documentDirectory}${localFilename}`;
    
          const { uri } = await FileSystem.downloadAsync(publicUrl, localUri);
          setLocalPath(uri);
        } catch (err) {
          alert("Error downloading the image: " + err.message);
          console.error(err);
        }
      };
    
      if (username && isFocused) {
        fetchAndDownloadImage();
      }
    }, [username, isFocused]);
    
  
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={() => navigation.navigate("View Profile", { Photo: localPath })}
          >
            {localPath ? (
              <Image source={{ uri: localPath }} style={styles.photo} />
            ) : (
              <Image
                source={require("../../assets/Profile PlaceHolder.png")}
                style={styles.photo}
              />
            )}
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            <View style={styles.hello}>
              <Text style={styles.helloTxt}>Hello {username}!</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Edit Profile", { Photo: localPath })}>
              <Text style={styles.profile}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/Logo.png")} style={styles.logo} />
          </View>
        </View>
  
        <View style={styles.body}>
          <View style={styles.create}>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate("Camera Screen")}
            >
              <Text style={styles.createTxt}>Make a Report</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.view}>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => navigation.navigate("View Reports")}
            >
              <Text style={styles.viewTxt}>View My Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={styles.logout}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutTxt}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default UserHomeScreen; // Export the UserScreen as the main navigator


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
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
    profileContainer: {
        marginHorizontal: 5,
        width: "40%",
    },
    photo: {
        
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
    body: {
        flex: 1,
        alignItems: "center",
    },
    create: {
        marginBottom: "10%",
        marginTop: "15%",
    },
    createBtn: {
        backgroundColor: "#00AAFF",
        borderRadius: 25,
        paddingVertical: 7,
        width: "60%",
        elevation: 4,
    },
    createTxt: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
    },
    view: {
        marginBottom: 20,
    },
    viewBtn: {
        backgroundColor: "#ACD6EF",
        borderRadius: 25,
        paddingVertical: 7,
        width: "60%",
        elevation: 4,
    },
    viewTxt: {
        color: "#3E6277",
        fontSize: 20,
        textAlign: "center",
    },
    logout: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    logoutBtn: {
        backgroundColor: "#3E6277",
        borderRadius: 25,
        paddingVertical: 10,
        width: "80%",
        elevation: 4,
    },
    logoutTxt: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
    },
    photo: {
        height: 70,
        width: 70,
        borderRadius: 50,
    },
});