import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../supabase';
import * as FileSystem from 'expo-file-system';


const ViewMyReportsScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [reports, setReports] = useState([]);
  const [localPath, setLocalPath] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername); // This triggers the `username` dependency to update.
        }
      } catch (error) {
        console.error('Error fetching username from AsyncStorage:', error);
      }
    };
  
    fetchUsername();
  }, []); // Only runs once when the component mounts.
  
  useEffect(() => {
    const fetchReportsAndDownloadImages = async () => {
      if (!username) return; // Exit early if `username` is not yet set.
  
      try {
        // Fetch user ID
        const { data: userData, error: userError } = await supabase
          .from('UserProfile')
          .select('User_ID')
          .eq('Username', username);
  
        if (userError) throw userError;
  
        const userId = userData[0]?.User_ID;
  
        if (!userId) {
          console.error('No user ID found for the username.');
          return;
        }
  
        // Fetch report data
        const { data: reportsData, error: reportsError } = await supabase
          .from('Report')
          .select('Report_ID, PlateNo, Details, Picture')
          .eq('User_ID', userId);
  
        if (reportsError) throw reportsError;
  
        if (!reportsData || reportsData.length === 0) {
          console.warn('No reports found for the user.');
          return;
        }
  
        // console.log('Reports Data:', reportsData);
  
        const downloadedImages = []; // To store image paths and link them with reports
  
        for (const report of reportsData) {
          if (!report.Picture) {
            console.warn(`Report ${report.Report_ID} does not have a Picture field.`);
            downloadedImages.push({ ...report, localPath: null }); // Add with no image path
            continue;
          }
  
          // Get the public URL for the picture
          const { data: imageData, error: imageError } = await supabase.storage
            .from("report-pictures")
            .getPublicUrl(report.Picture);
  
          if (imageError) {
            console.error(`Error fetching image URL for report ${report.Report_ID}:`, imageError);
            downloadedImages.push({ ...report, localPath: null }); // Add with no image path
            continue;
          }
  
          // Download the image
          const localFilename = `${report.Report_ID}-picture.jpg`;
          const localUri = `${FileSystem.documentDirectory}${localFilename}`;
  
          try {
            const { uri } = await FileSystem.downloadAsync(imageData.publicUrl, localUri);
            downloadedImages.push({ ...report, localPath: uri }); // Add image path to the report
          } catch (downloadError) {
            console.error(`Error downloading image for report ${report.Report_ID}:`, downloadError);
            downloadedImages.push({ ...report, localPath: null }); // Add with no image path
          }
        }
  
        // Update the state with reports including image paths
        setReports(downloadedImages);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
  
    fetchReportsAndDownloadImages();
  }, [username]);
  
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
        const localFilename = `${username}-profile.jpg`;
        const localUri = `${FileSystem.documentDirectory}${localFilename}`;

        const { uri } = await FileSystem.downloadAsync(data.publicUrl, localUri);
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
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello, {username}!</Text>
          </View>
          <Text style={styles.editProfile}>Edit Profile</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/Back Button.png')} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>My Reports</Text>
          </View>
        </View>
        <View style={styles.reportsContainer}>
          {reports.length > 0 ? (
            reports.map((report) => (
              <TouchableOpacity
                style={styles.reportCard}
                key={report.Report_ID}
                onPress={() => navigation.navigate('Report Details', { Report_ID: report.Report_ID, Picture: report.localPath })}
              >
                <View style={styles.imageContainer}>
                  {report.localPath ? (
                    <Image source={{ uri: report.localPath }} style={styles.reportImage} />
                  ) : (
                    <Image source={require('../../assets/Image PlaceHolder.png')} style={styles.reportImage} />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.reportNumber}>Report No.: {report.Report_ID}</Text>
                  <Text style={styles.plateNumber}>Plate No.: {report.PlateNo}</Text>
                  <Text style={styles.description}>
                    {report.Details.length > 20 ? `${report.Details.substring(0, 17)}...` : report.Details}
                  </Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Image source={require('../../assets/Arrow to Right.png')} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noReports}>You have no reports</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewMyReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF3',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#49B4F5',
    alignItems: 'center',
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
    width: '40%',
  },
  greeting: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFAF3',
  },
  greetingText: {
    color: '#FFFAF3',
  },
  editProfile: {
    color: '#FFFAF3',
  },
  logoContainer: {
    marginLeft: 'auto',
    backgroundColor: '#FFFAF3',
    borderRadius: 40,
    padding: 2.5,
  },
  logo: {
    width: 70,
    height: 70,
  },
  body: {
    flex: 1,
    backgroundColor: '#FFFAF3',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButtonContainer: {
    // dimensions can be added if necessary
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  backIcon: {
    // dimensions can be added if necessary
  },
  titleContainer: {
    // styles can be added if necessary
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reportsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  reportCard: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    width: '85%',
    borderRadius: 10,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  reportImage: {
    width: 90,
    height: 60,
    borderRadius: 5,
  },
  textContainer: {
    justifyContent: 'center',
    paddingLeft: 5,
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  arrowIcon: {
    // dimensions can be added if necessary
  },
});

