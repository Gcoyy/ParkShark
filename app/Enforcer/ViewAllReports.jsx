import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../supabase';
import * as FileSystem from 'expo-file-system';


const ViewAllReportsScreen = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState(null); // State for the current location
  const [hasLocationPermission, setHasLocationPermission] = useState(false); // State to check permission
  const [reports, setReports] = useState([]); // State for the reports
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
  const fetchReportsAndDownloadImages = async () => {
    if (!username) return;

    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('Report')
        .select('Report_ID, PlateNo, Details, Picture, Latitude, Longitude')
        .or(`Status.eq.Unresolved,Status.eq.In Progress`);

      if (reportsError) throw reportsError;

      if (!reportsData || reportsData.length === 0) {
        console.warn('No reports found for the user.');
        return;
      }


      const downloadedImages = [];

      for (const report of reportsData) {
        if (!report.Picture) {
          console.warn(`Report ${report.Report_ID} does not have a Picture field.`);
          downloadedImages.push({ ...report, localPath: null });
          continue;
        }

        const { data: imageData, error: imageError } = await supabase.storage
          .from("report-pictures")
          .getPublicUrl(report.Picture);

        if (imageError) {
          console.error(`Error fetching image URL for report ${report.Report_ID}:`, imageError);
          downloadedImages.push({ ...report, localPath: null }); path
          continue;
        }

        // Download the image
        const localFilename = `${report.Report_ID}-picture.jpg`;
        const localUri = `${FileSystem.documentDirectory}${localFilename}`;

        try {
          const { uri } = await FileSystem.downloadAsync(imageData.publicUrl, localUri);
          downloadedImages.push({ ...report, localPath: uri });
        } catch (downloadError) {
          console.error(`Error downloading image for report ${report.Report_ID}:`, downloadError);
          downloadedImages.push({ ...report, localPath: null });
        }
      }

      setReports(downloadedImages);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  fetchReportsAndDownloadImages();
}, [username]);

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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={require("../../assets/Back Button.png")} />
        </TouchableOpacity>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
      <View style={styles.bottomContainer}>
        <View style={styles.innerBottomContainer}>
            <Text style={styles.bottomTxt}>REPORTS</Text>
            <ScrollView style={styles.reportsContainer} contentContainerStyle={{ 
    alignItems: 'center', // Centers the child elements horizontally
    paddingBottom: 20,   // Adds space at the bottom>
            }}>
            {reports.length > 0 ? (
            reports.map((report) => (
              <TouchableOpacity
                style={styles.reportCard}
                key={report.Report_ID}
                onPress={() => navigation.navigate('Update', { Report_ID: report.Report_ID, Picture: report.localPath, Photo })}
              >
                <View style={styles.imageContainer}>
                {report.localPath ? (
                    <Image source={{ uri: report.localPath }} style={styles.reportImage} />
                  ) : (
                    <Image source={require('../../assets/Image PlaceHolder.png')} style={styles.reportImage} />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.reportNumber}>Report No: {report.Report_ID}</Text>
                  <Text style={styles.plateNumber}>Plate No: {report.PlateNo}</Text>
                  <Text style={styles.description}>Details: 
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
            </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default ViewAllReportsScreen;

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
    position: "relative",
    zIndex: 2,
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
  backBtn: {
    position: "absolute",
    top: "13%",
    left: "5%",
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    zIndex: 2,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: '35%',
    backgroundColor: "#B1E2FF", 
    justifyContent: 'flex-end',
    alignItems: 'center', 
    borderTopRightRadius: 50, 
    borderTopLeftRadius: 50, 
  },
  
  innerBottomContainer: {
    backgroundColor: "#EFF9FF",
    height: "90%",
    width: "95%",
    borderTopRightRadius:40,
    borderTopLeftRadius: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  bottomTxt: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportsContainer: {
    width: "100%",
  },
  reportContainer: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    width: "85%",
    borderRadius: 10,
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
imgContainer: {
    width: "20%",
    height: 55,
    marginRight: 10,
    justifyContent: 'center',
},
img: {
    width: "100%",
    height: "100%",
},
textContainer: {
    justifyContent: 'center',
    paddingLeft: 5,
},
arrowContainer: {
    justifyContent: "center",
    marginLeft: 'auto',
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
