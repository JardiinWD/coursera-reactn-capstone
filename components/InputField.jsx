/* ==== REACT IMPORTS ==== */
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
/* ==== CUSTOM ==== */
import { styles } from '../utilities/style'

const InputField = ({ label, value, onChangeText, validate, keyboardType }) => {

    const showError = !validate(value);

    return (
        <View>
            <Text style={[s.text, showError ? s.error : ""]}>{label}</Text>
            <TextInput
                style={s.inputBox}
                value={value}
                onChangeText={onChangeText}
                placeholder={label}
                keyboardType={keyboardType}
            />
        </View>
    );
};

const s = StyleSheet.create({
    text: {
        fontSize: styles.textStyle.font_size_sm,
        fontFamily: styles.fontFamily.Karla_Medium,
        marginBottom: 5,
    },
    inputBox: {
        alignSelf: "stretch",
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        fontSize: styles.textStyle.font_size_sm,
        borderRadius: 9,
        borderColor: "#dfdfe5",
    },
    error: {
        color: styles.colorPalette.primary_error,
        fontFamily: styles.fontFamily.Karla_Bold,
    },
});

export default InputField;