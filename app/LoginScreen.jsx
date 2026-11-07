import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Feather";
import supabase from "../supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../assets/fonts/Poppins-ExtraBold.ttf"),
      });
    };

    loadFonts();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
          if (!username || !password) {
      alert("Username and password cannot be empty.");
      return;
    }

    const { data: user, error: userError } = await supabase
      .from("UserProfile")
      .select("*")
      .eq("Username", username)
      .single();

    if (userError) {
      const { data: enforcer, error: enforcerError } = await supabase
        .from("Traffic Enforcer")
        .select("*")
        .eq("Name", username)
        .single();

      if (enforcerError || !enforcer) {
        alert("User not found. Please check your credentials.");
        return;
      }

      if (password !== enforcer.Password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      await AsyncStorage.setItem("Name", username);
      navigation.navigate("Enforcer");
      return;
    }

    if (password !== user.Password) {
      alert("Incorrect password. Please try again.");
      return;
    }

    await AsyncStorage.setItem("username", username);
    navigation.navigate("User");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#c7eaff" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <Image source={require("../assets/Back Button.png")} style={styles.backButton} />
      </TouchableOpacity>
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Log In</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter Password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
              <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C7EAFF",
    padding: 20,
    justifyContent: "space-between",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#fff",
    width: "80%",
  },
  passwordInput: {
    borderWidth: 0,
    flex: 1,
    marginVertical: -.5,
  },
  iconContainer: {
    padding: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  button: {
    backgroundColor: "#00AAFF",
    borderRadius: 30,
    paddingVertical: 10,
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
  },
});

