import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar } from "react-native";
import React, {useState, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../supabase";
import * as FileSystem from "expo-file-system";

const EnforcerHomeScreen = ({ navigation, route }) => {
    const [username, setUsername] = useState('');
    const [localPath, setLocalPath] = useState('');
    
    const handleLogout = async () => {
        try {
            // Remove username from AsyncStorage
            await AsyncStorage.removeItem('username');
    
            // Reset the navigation stack to AppNavigator (Home screen)
            navigation.reset({
                index: 0, // Reset to the first screen in the stack
                routes: [{ name: "Home" }], // Set the route name of AppNavigator's main screen
            });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('Name'); // Retrieve username from AsyncStorage
                if (storedUsername) {
                    setUsername(storedUsername); // Set the username in state
                }
            } catch (error) {
                console.error("Error fetching username from AsyncStorage:", error);
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        const fetchAndDownloadImage = async () => {
          try {
            const { data, error } = supabase.storage
              .from("enforcer-photos")
              .getPublicUrl(`${username}.jpg`);
              
      
            if (error) {
              alert("Error fetching image URL: " + error.message);
              console.error(error);
              return;
            }
      
            const publicUrl = `${data.publicUrl}?timestamp=${new Date().getTime()}`;
      
            const localFilename = `${username}-profile.jpg`;
            const localUri = `${FileSystem.documentDirectory}${localFilename}`;
      
            const { uri } = await FileSystem.downloadAsync(publicUrl, localUri);
            setLocalPath(uri);
          } catch (err) {
            alert("Error downloading the image: " + err.message);
            console.error(err);
          }
        };
      
        if (username) {
          fetchAndDownloadImage();
        }
      }, [username]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.photoContainer}>
                {localPath ? (
                <Image source={{ uri: localPath }} style={styles.photo} />
                ) : (
                <Image
                    source={require("../../assets/Profile PlaceHolder.png")}
                    style={styles.photo}
                />
                )}
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.hello}>
                        <Text style={styles.helloTxt}>Hello {username}!</Text>
                    </View>
                </View>
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/Logo.png")} style={styles.logo} />
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.create}>
                    <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('View All Reports', {Photo: localPath})}>
                        <Text style={styles.createTxt}>View All Reports</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.view}>
                    <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('History', {Photo: localPath})}>
                        <Text style={styles.viewTxt}>Parking Patterns</Text>
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

export default EnforcerHomeScreen;

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
});

