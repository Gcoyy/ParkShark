import * as React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from 'react-native';

const Button = ({ icon, size, color, style, onPress}) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <MaterialIcons name={icon} size={size? size : 28} color={color? color : '#f1f1f1'} />
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});