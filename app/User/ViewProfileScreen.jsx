import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../supabase";


const ViewProfileScreen = ({ navigation, route }) => {
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: "",
    });
    const { Photo } = route.params || {};


    useEffect(() => {
        // Fetch the username from AsyncStorage
        const fetchUserDetails = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem("username");

                if (storedUsername) {
                    const { data, error } = await supabase
                        .from("UserProfile")
                        .select("Username, Password")
                        .eq("Username", storedUsername)
                        .single();

                    if (error) {
                        console.error("Error fetching user details:", error);
                        return;
                    }

                    setUserDetails({
                        username: data.Username,
                        password: data.Password,
                    });
                    
                }
            } catch (error) {
                console.error("Error retrieving username from AsyncStorage:", error);
            }
        };

        fetchUserDetails();
    }, []);


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
                    <View style={styles.hello}>
                        <Text style={styles.helloTxt}>Hello {userDetails.username}!</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Edit Profile', { Photo })}>
                        <Text style={styles.profile}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/Logo.png")} style={styles.logo} />
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.backContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Image source={require("../../assets/Back Button.png")} style={styles.back}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.imgContainer}>
                    {Photo ? (
                    <Image source={{ uri: Photo }} style={styles.img} />
                    ) : (
                    <Image
                        source={require("../../assets/Profile PlaceHolder.png")}
                        style={styles.img}
                    />
                    )}
                    </View>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username}>
                            Username:
                        </Text>
                        <Text style={styles.name}>
                            {userDetails.username}
                        </Text>
                    </View>
                    <View style={styles.passwordContainer}>
                        <Text style={styles.password}>
                            Password:
                        </Text>
                        <Text style={styles.pass}>
                            {userDetails.password}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ViewProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFAF3",
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
    body: {
        flex: 1,
    },
    backContainer: {
        paddingLeft: "7%",
        paddingTop: "7%",
    },
    backBtn: {
        //
    },
    infoContainer: {
        flexDirection: "column", 
        alignItems: "center",   
        justifyContent: "center",
    },
    
    imgContainer: {
        marginTop: 10,
        marginBottom: 40,
    },
    img: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    usernameContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
    name: {
        backgroundColor: "#fff",
        padding: 5,
        width: "50%",
        borderRadius: 10,
        marginLeft: 10,
        elevation: 3,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    password: {
        fontSize: 20,
        fontWeight: "bold",
    },
    pass: {
        backgroundColor: "#fff",
        padding: 5,
        width: "50%",
        borderRadius: 10,
        marginLeft: 10,
        elevation: 3,
    },
});