import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';


const SavedMessageScreen = ({ navigation}) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.body}>
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/Logo.png")} style={styles.logo}/>
                </View>
                <View style={styles.messageContainer}>
                    <Text style={styles.messageTxt}>
                        Changes have been saved.
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

export default SavedMessageScreen;

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