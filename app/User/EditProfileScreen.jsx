import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import supabase from '../../supabase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const EditProfileScreen = ({ navigation, route }) => {
    const [showPassword1, setShowPassword1] = useState(false);
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    //const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const { Photo } = route.params || {};

useEffect(() => {
    const fetchUsername = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        } catch (error) {
            console.error("Error fetching username from AsyncStorage:", error);
        }
    };

    fetchUsername();
}, []);

const handleUpdate = async () => {
    if (!newUsername || !password) {
        alert("Username, and password are required.");
        return;
    }
    
    try {

        const { data: existingUser, error: userErr } = await supabase
            .from("UserProfile")
            .select("Username")
            .eq("Username", newUsername)
            .single();
        if (existingUser) {
            alert("Profile with that username already exists");
            return;
        }
        const { data: updatedProfileData, error: updatedDataError } = await supabase
            .from('UserProfile')
            .update({ Username: newUsername, Password: password, Photo: `${newUsername}.jpeg`})
            .eq('Username', username);

        if (updatedDataError) {
            console.error("Error updating user profile:", updatedDataError);
            alert("Something went wrong. Please try again.");
            return;
        }
        // await AsyncStorage.setItem('username', newUsername);
        // navigation.navigate('Saved Message');


            // await deleteImage(`${username}.jpeg`);
            // await uploadFileToSupabase(Photo);
            const oldImagePath = `${username}.jpeg`;
            const newImagePath = `${newUsername}.jpeg`;

            const { error: renameError } = await supabase.storage
            .from('user-photos')
            .move(oldImagePath, newImagePath);

            if (renameError) {
                alert("Error renaming image: " + renameError.message);
                return;
            }

        await AsyncStorage.setItem('username', newUsername);
        navigation.navigate('Saved Message');
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Something went wrong. Please try again.");
    }
};

// const deleteImage = async (fileName) => {
//     const { data, error } = await supabase.storage
//         .from('user-photos')
//         .remove([fileName]);

//     if (error) {
//         console.error("Error deleting image:", error);
//         return false;
//     }
//     return true;
// };

// const handlePickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//         base64: true,
//     });

//     if (!result.canceled) {
//         setProfileImage(result.assets[0]);
//     }
// };

// const uploadFileToSupabase = async (photo) => {
//     try {
//       setUploading(true);
//       const fileUri = photo;
  
//       const fileData = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
  
//       const fileBuffer = decode(fileData);
//       const contentType = 'image/jpeg';
  
//       const { data, error } = await supabase.storage
//         .from("report-pictures")
//         .upload(`${Date.now()}-report.jpeg`, fileBuffer, {
//           cacheControl: "3600",
//           upsert: false,
//           contentType: contentType,
//         });
  
//       if (error) {
//         console.error("Error uploading file:", error);
//         alert("Upload failed");
//         setUploading(false);
//         return null;
//       }
  
//       setUploading(false);
//       return data.path;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setUploading(false);
//       return null;
//     }
//   };

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
                        <Text style={styles.helloTxt}>Hello {username}!</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.profile}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/Logo.png')} style={styles.logo} />
                </View>
            </View>
            <View style={styles.body}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.backContainer}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/Back Button.png')} style={styles.back} />
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
                            {/* <TouchableOpacity onPress={handlePickImage}>
                                <Text style={styles.imgTxt}>Edit Profile Photo</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.username}>Username:</Text>
                            <TextInput placeholder="Enter username" style={styles.name} value={newUsername} onChangeText={setNewUsername} />
                        </View>
                        <View style={styles.passwordContainer}>
                            <Text style={styles.password}>Password:</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter Password"
                                    secureTextEntry={!showPassword1}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword1(!showPassword1)}
                                    style={styles.eyeButton}
                                >
                                    <Icon
                                        name={showPassword1 ? 'eye' : 'eye-off'} // Change the icon based on the state
                                        size={24}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.saveBtnContainer}>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                            <Text style={styles.saveTxt}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default EditProfileScreen;

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
    profileContainer: {
        marginHorizontal: 5,
        width: "40%",
    },
    photo: {
        width: 65,
        height: 65,
        borderRadius: 50,
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
    scrollViewContainer: {
        flex: 1,
        flexDirection: "column",
    },
    backContainer: {
        paddingLeft: "5%",
        paddingTop: "5%",
    },
    back: {
    },
    infoContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    imgContainer: {
        marginTop: 10,
        marginBottom: 20,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
    },
    img: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    imgTxt: {
        marginTop: 10,
        color: "#2B63CB",
    },
    usernameContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        marginBottom: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
    name: {
        backgroundColor: "#fff",
        width: "60%",
        paddingLeft: 10,
        borderRadius: 20,
        marginLeft: 10,
        elevation: 8,
        height: '100%',
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        position: "relative",
    },
    password: {
        fontSize: 20,
        fontWeight: "bold",
        width: 100,
    },
    passwordInputContainer: {
        width: "60%",
        borderColor: "#ddd",
        borderRadius: 25,
        backgroundColor: "#fff",
        marginLeft: 10,
        elevation: 3,
        position: "relative",
        height: 40
    },
    passwordInput: {
        paddingLeft: 10,
        height: '100%',
    },
    eyeButton: {
        position: "absolute",
        right: 10,
        justifyContent: "center",
        height: "100%",
    },
    saveBtnContainer: {
        position: 'relative',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: "5%",
    },
    saveBtn: {
        backgroundColor: "#1F79A7",
        borderRadius: 25,
        paddingVertical: 10,
        width: "80%",
        justifyContent: "center",
    },
    saveTxt: {
        color: "#fff",
        fontSize: 22,
        textAlign: "center",
    },
});