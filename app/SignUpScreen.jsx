import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Feather';
import supabase from '../supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';


const SignUpScreen = ({ navigation }) => {
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };
  
  const uploadFileToSupabase = async (profileImage) => {
    try {
        setUploading(true);
        const fileUri = profileImage.uri;

        // converting binary data into text
        const fileData = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // reconversion from text to binary data
        const fileBuffer = decode(fileData);
        const contentType = 'image/jpeg';

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from("user-photos")
            .upload(`${username}.jpeg`, fileBuffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: contentType,
            });

        if (error) {
            console.error("Error uploading file:", error);
            setMessage("Upload failed");
            setUploading(false);
            return null;
        }

        setUploading(false);
        return data.path;
    } catch (error) {
        console.log("Error uploading file:", error);
        setUploading(false);
        return null;
    }
  };


  const handleSignUp = async () => {
    if (password != confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!profileImage || !username || !password) {
      alert("Username, password, and profile image are required");
      return;
    }

    const { data: existingUser, error: userErr } = await supabase
      .from("UserProfile")
      .select("Username")
      .eq("Username", username)
      .single();
      console.log(existingUser);
    if (existingUser) {
      alert("Profile with that username already exists");
      return;
    }
    else {
    const path = await uploadFileToSupabase(profileImage);
    if (!path) {
      setMessage("Upload failed");
      return;
    }
    const { data: user, error: userError } = await supabase
      .from("UserProfile")
      .insert([
        {
          "Username": username,
          "Password": password,
          "Photo": path,
        },
      ]);
    if (userError) {
      console.log(userError.message);
    } else {
      alert("Sign up successful");
      navigation.navigate("Login");
      return;
    }
  }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.  scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/Back Button.png")} style={styles.icon} />
        </TouchableOpacity>
        
        <Text style={styles.header}>Sign Up</Text>

        <View style={styles.profileSection}>
        <Image
            source={profileImage ? { uri: profileImage.uri } : require("../assets/Profile PlaceHolder.png")}
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handlePickImage}>
            <Text style={styles.addPhotoText}>Add Profile Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible1}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible1(!passwordVisible1)}
              style={styles.eyeButton}
            >
              <Icon 
                name={passwordVisible1 ? 'eye' : 'eye-off'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!passwordVisible2}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible2(!passwordVisible2)}
              style={styles.eyeButton}
            >
              <Icon 
                name={passwordVisible2 ? 'eye' : 'eye-off'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.signupContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7eaff",
  },
  scrollContent: {
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: '5%',
    marginLeft: '5%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    flexDirection: "flex-start",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  addPhotoText: {
    fontSize: 16,
    color: "#2B63CB",
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    elevation: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: 45,
  },
  passwordInput: {
    width: "85%",
    paddingLeft: 10,
    height: "100%",
  },
  
  eyeButton: {
    position: "absolute",
    right: 10,
    justifyContent: "center",
    height: "100%",
    paddingLeft: 10,
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 20,
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom:'5%',
  },
  signUpButton: {
    position: "relative",
    alignSelf: "center",
    backgroundColor: "#00aaff",
    borderRadius: 25,
    paddingVertical: 10,
    width: "80%",
  },
  signUpText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
  },
});