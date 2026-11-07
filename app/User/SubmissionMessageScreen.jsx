import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import supabase from '../../supabase';


const SubmissionMessageScreen = ({ navigation, route }) => {
    const { Report_ID } = route.params || {};

useEffect(() => {
    const insertDeliveryRecords = async () => {
        try {
            // Fetch all enforcer IDs from the Enforcer table
            const { data: enforcers, error: fetchError } = await supabase
                .from('Traffic Enforcer')
                .select('Enforcer_ID');

            if (fetchError) throw fetchError;

            if (enforcers && enforcers.length > 0) {
                // Insert Report_ID and each enforcer_ID into the Delivery table
                const { error: insertError } = await supabase
                    .from('Delivery')
                    .insert(enforcers.map(({ Enforcer_ID }) => ({ Report_ID, Enforcer_ID })));

                if (insertError) throw insertError;
            }
        } catch (error) {
            console.error('Error inserting into Delivery table:', error);
        }
    };

    insertDeliveryRecords();
}, [Report_ID]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.body}>
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/Logo.png")} style={styles.logo}/>
                </View>
                <View style={styles.messageContainer}>
                    <Text style={styles.messageTxt}>
                        Thank You for Submitting a Report!
                    </Text>
                    <Image source={require("../../assets/Checkmark.png")} style={styles.checkmark}/>
                </View>
                <View style={styles.okContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('User')} style={styles.okBtn}>
                        <Text style={styles.okTxt}>
                            OKAY
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SubmissionMessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6A9FBF',
    },
    body: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "20%",
    },
    logoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 100,
        marginBottom: 30,
    },
    logo: {
        width: 140,
        height: 140,
        borderRadius: 50,
    },
    messageContainer: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 70,
        borderRadius: 30,
        marginBottom: 20,
        width: "70%",
    },
    messageTxt: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    okContainer: {
    },
    okBtn: {
        backgroundColor: "#C6E9FF",
        width: "70%",
        paddingVertical: 5,
        borderRadius: 25,
    },
    okTxt: {
        textAlign: 'center',
        fontSize: 24,
    },
});