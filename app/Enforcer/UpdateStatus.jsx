import { View, Image, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useState} from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import supabase from '../../supabase';


const UpdateStatusScreen = ({  navigation, route }) => {
    const [reportStatus, setReportStatus] = useState("unresolved"); // State for dropdown
    const [photo, setPhoto] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const { Report_ID, Picture, Photo } = route.params || {};


    const getBackgroundColor = () => {
        switch (reportStatus) {
            case 'Unresolved':
                return '#A80000'; // Light red
            case 'In Progress':
                return '#FFD700'; // Light yellow
            case 'Resolved':
                return '#22A800'; // Light green
            default:
                return 'white'; // Default color
        }
    };

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const { data, error } = await supabase
                    .from('Report')
                    .select('Picture, PlateNo, Details, Latitude, Longitude')
                    .eq('Report_ID', Report_ID) // Replace with actual Report ID
                    .single();

                if (error) throw error;

                setPhoto(data.Picture);
                setLicensePlate(data.PlateNo);
                setDescription(data.Details);
                setLatitude(data.Latitude);
                setLongitude(data.Longitude);
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchReportData();
    }, []);

useEffect(() => {
    const updateReportStatus = async () => {
        try {
            const { error } = await supabase
                .from('Report')
                .update({ Status: reportStatus })
                .eq('Report_ID', Report_ID);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating report status:', error);
        }
    };

    if (Report_ID) {
        updateReportStatus();
    }
}, [reportStatus]); // Run effect when reportStatus changes

    return (
        <ScrollView style={styles.container}>
            <View style={styles.firstrowContainer}>
                <View style={styles.backContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Image source={require("../../assets/Back Button.png")} style={styles.back}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>Report Number: {Report_ID}</Text>
                </View>
            </View>
            <View style={styles.pictureContainer}>
                <View style={styles.pictureFrame}>
                    <Image source={Picture ? {uri : Picture} : require("../../assets/Image PlaceHolder.png")} style={styles.picture}/>
                </View>
            </View>
            <View style={styles.platenoContainer}>
                <Text style={styles.platenoTxt}>License Plate Number:</Text>
                <Text style={styles.platenoInput}>{licensePlate}</Text>
            </View>
            <View style={styles.descContainer}>
                <Text style={styles.descTxt}>Description:</Text>
                <Text style={styles.descInput}>{description}</Text>
            </View>
            <View style={styles.mapContainer}>
                <Text style={styles.mapTxt}>Pin Location</Text>
                <TouchableOpacity onPress={() => navigation.navigate('GPS', { latitude, longitude, Photo })} style={styles.mapBtn}>
                    <Image source={require("../../assets/Map Placeholder.png")} style={styles.map}/>
                    <View style={styles.mapInnerBtn}>
                        <Text style={styles.mapInnerTxt}>
                            Go to Maps
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.reportStatusContainer}>
                <Text style={styles.reportStatusTxt}>
                    Report Status
                </Text>
                <View style={[styles.pickerContainer, { backgroundColor: getBackgroundColor() }]}>
                    <Picker
                        selectedValue={reportStatus}
                        onValueChange={(itemValue) => setReportStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Unresolved" value="Unresolved" />
                        <Picker.Item label="In Progress" value="In Progress" />
                        <Picker.Item label="Resolved" value="Resolved" />
                    </Picker>
                </View>
            </View>
        </ScrollView>
    );
};

export default UpdateStatusScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E7F6FF',
    },
    firstrowContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    backContainer: {
        // width: 50,
        // height: 50,
    },
    backBtn: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 10,
        elevation: 2,
    },
    back: {
        // height: "50%", width: ,
    },
    titleContainer: {
        //
    },
    titleTxt: {
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
    platenoContainer: {
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
    platenoTxt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    platenoInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 10,
    },
    descContainer: {
        paddingVertical: 5,
        paddingHorizontal: 40,
    },
    descTxt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 10,
        height: 100,
    },
    mapContainer: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        width: "100%",
    },
    mapTxt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,

    },
    mapBtn: {
        borderWidth: 1,
        width: "100%",
        height: 152,
        borderRadius: 5,
    },
    map: {
        width: "100%",
        height: "100%",
        elevation: 10,
    },
    mapInnerBtn: {
        position: "absolute",
        top: '50%', // Adjust the position as needed
        left: '50%',
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }], // Center the button
        backgroundColor: '#7DCEFF',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 2,
    },
    reportStatusContainer: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        width: "100%",
    },
    reportStatusTxt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 40, // Make it curved
        overflow: 'hidden', // Ensures content inside respects the border radius
        elevation: 10, // Add shadow for Android
        borderWidth: 1, // Optional: add border for iOS
        borderColor: '#ccc', // Optional: define border color
    },
    picker: {
        height: 50, // Adjust height as needed
        width: '100%', // Take full width of the container
        color: 'white',
        fontWeight: 'bold',
    },
});