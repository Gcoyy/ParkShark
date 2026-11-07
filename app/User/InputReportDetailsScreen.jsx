import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from '../../supabase';
import { format } from 'date-fns';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

const InputDetailsScreen = ({ navigation, route }) => {
  const { photo, latitude, longitude } = route.params || {};
  const [licensePlate, setLicensePlate] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          const { data, error } = await supabase
            .from('UserProfile')
            .select('User_ID')
            .eq('Username', storedUsername)
            .single();

          if (error) {
            return;
          }

          setUserId(data.User_ID);
        }
      } catch (error) {
        return;
      }
    };

    retrieveUserData();
  }, []);

  useEffect(() => {
    const retrieveInputDetails = async () => {
      try {
        const storedLicensePlate = await AsyncStorage.getItem('licensePlate');
        const storedDescription = await AsyncStorage.getItem('description');
        if (storedLicensePlate) setLicensePlate(storedLicensePlate);
        if (storedDescription) setDescription(storedDescription);
      } catch (error) {
        console.error("Error retrieving input details:", error);
      }
    };
  
    retrieveInputDetails();
  }, []);

  const getCurrentDateTimeFormatted = () => {
    return format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
  };

  const handleSave = async () => {
  try {
    if (!photo || !licensePlate || !description ||( !latitude && !longitude)) {
      alert("Please enter license plate, description, and location.");
      return;
    }
    const uploadedPath = await uploadFileToSupabase(photo);
    if (!uploadedPath) {
      return;
    }

    const { data: existingReport, error: existingReportError } = await supabase
      .from('Report')
      .select('PlateNo')
      .eq('PlateNo', licensePlate)

      console.log(existingReport);

    if (existingReportError) {
      alert("Error: " + existingReportError.message);
      return;
    }

    if (existingReport.length > 0) {
      alert("License plate number already exists. Please try another one.");
      return;
    }

    const { data, error } = await supabase
      .from('Report')
      .insert([{
        Picture: uploadedPath,
        PlateNo: licensePlate,
        Details: description,
        Latitude: latitude || '0.00',
        Longitude: longitude || '0.00',
        Status: "Unresolved",
        TimeStamp: getCurrentDateTimeFormatted(),
        User_ID: userId
        
      }]);

      const { data: reportId, error: reportIdError } = await supabase
      .from('Report')
      .select('Report_ID')
      .eq('PlateNo', licensePlate)
      .single();

    if (reportIdError) {
      console.error("Error fetching report ID:", reportIdError);
      alert("Error fetching report ID");
      return null;
    }

    if (error) {
      return;
    } else {
      await AsyncStorage.removeItem('licensePlate');
      await AsyncStorage.removeItem('description');
      navigation.navigate("SuccessMessage", {Report_ID: reportId.Report_ID});
    }
  } catch (error) {
    return;
  }
};

const uploadFileToSupabase = async (photo) => {
  try {
    setUploading(true);
    const fileUri = photo;

    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileBuffer = decode(fileData);
    const contentType = 'image/jpeg';

    const { data, error } = await supabase.storage
      .from("report-pictures")
      .upload(`${Date.now()}-report.jpeg`, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: contentType,
      });

    if (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
      setUploading(false);
      return null;
    }

    setUploading(false);
    return data.path;
  } catch (error) {
    console.error("Error uploading file:", error);
    setUploading(false);
    return null;
  }
};

const handleNavigateToMap = async () => {
  try {
    await AsyncStorage.setItem('licensePlate', licensePlate);
    await AsyncStorage.setItem('description', description);
    navigation.navigate('Map', { photo });
  } catch (error) {
    console.error("Error saving input details:", error);
  }
};

  return (

    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../../assets/Back Button.png")} style={styles.backImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Input Report Details</Text>
      </View>
      <View style={styles.pictureContainer}>
        <View style={styles.pictureFrame}>
          <Image source={photo ? { uri: photo } : require("../../assets/Image PlaceHolder.png")} style={styles.picture}/>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>License Plate Number:</Text>
        <TextInput
          placeholder='Enter License Plate Number'
          style={styles.input}
          value={licensePlate}
          onChangeText={setLicensePlate}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          placeholder='Enter Description'
          style={styles.multiLineInput}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          scrollEnabled={true}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.mapWrapper}>
        <Text style={styles.label}>Pin Location</Text>
        <TouchableOpacity onPress={handleNavigateToMap} style={styles.mapButton}>
          <Image source={require("../../assets/Map Placeholder.png")} style={styles.mapImage} />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapText}>Go to Maps</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.submitWrapper}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default InputDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F6FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  backImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pictureContainer: {
    alignItems: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
},
pictureFrame: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    height: 200,
    elevation: 10,
},
picture: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
},
  inputWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  multiLineInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    height: 100,
  },
  mapWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    width: '100%',
  },
  mapButton: {
    borderWidth: 1,
    width: '100%',
    height: 152,
    borderRadius: 5,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    elevation: 10,
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    backgroundColor: '#7DCEFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
  },
  mapText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  submitWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    // borderWidth: 2
  },
  submitButton: {
    backgroundColor: '#355162',
    borderRadius: 50,
    paddingVertical: 10,
    elevation: 4,
    width: '100%',
  },
  submitText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});


