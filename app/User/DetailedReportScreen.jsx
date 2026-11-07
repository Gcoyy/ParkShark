import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import supabase from '../../supabase';

const DetailedReportScreen = ({  navigation, route }) => {
    const [status, setStatus] = useState("Resolved");
    const [plateNo, setPlateNo] = useState('');
    const [details, setDetails] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const { Report_ID } = route.params || {};
    const { Picture } = route.params || {};

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const { data, error } = await supabase
                    .from('Report')
                    .select('PlateNo, Details, Latitude, Longitude, Status')
                    .eq('Report_ID', Report_ID)
                    .single();

                if (error) throw error;

                setPlateNo(data.PlateNo);
                setDetails(data.Details);
                setLatitude(data.Latitude);
                setLongitude(data.Longitude);
                setStatus(data.Status);
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchReportData();
    }, [Report_ID]);

    const getBackgroundColor = () => {
        switch (status) {
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.firstrowContainer}>
                <View style={styles.backContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Image source={require("../../assets/Back Button.png")} style={styles.back}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>Report Details</Text>
                </View>
            </View>
            <View style={styles.pictureContainer}>
                <View style={styles.pictureFrame}>
                    <Image source={Picture ? { uri: Picture } : require("../../assets/Image PlaceHolder.png")} style={styles.picture}/>
                </View>
            </View>
            <View style={styles.platenoContainer}>
                <Text style={styles.platenoTxt}>License Plate Number:</Text>
                <TextInput placeholder='Enter License Plate Number' style={styles.platenoInput} value={plateNo}/>
            </View>
            <View style={styles.descContainer}>
                <Text style={styles.descTxt}>Description:</Text>
                <TextInput placeholder='Enter Description (Vehicle Color, Vehicle Model, Specific Location, etc.)' style={styles.descInput} value={details}/>
            </View>
            <View style={styles.mapContainer}>
                <Text style={styles.mapTxt}>Pin Location</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Location', { latitude, longitude })} style={styles.mapBtn}>
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
                <Text style={[styles.reportStatus, { backgroundColor: getBackgroundColor() }]}>
                    {status}
                </Text>
            </View>
        </ScrollView>
    );
};

export default DetailedReportScreen;

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
    },
    backBtn: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 10,
        elevation: 2,
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
        top: '50%', 
        left: '50%',
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }], 
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
    reportStatus: {
        fontSize: 18,
        backgroundColor: "#A80000",
        marginBottom: 10,
        textAlign: 'center',
        padding: 5,
        borderRadius: 20,
    },
});

