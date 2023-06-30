/* ==== REACT IMPORTS ==== */
import React from "react";
import { View,StyleSheet, Text } from "react-native";
/* ==== EXPO IMPORTS ==== */
import Checkbox from "expo-checkbox";
/* ==== CUSTOM ==== */
import { styles } from '../utilities/style'


const CheckboxSection = ({ label, value, onChange }) => {
    return (
        /* rootContainer */
        <View style={s.rootContainer}>
            {/* checkbox */}
            <Checkbox
                style={s.checkbox}
                value={value}
                onValueChange={onChange}
                color={styles.colorPalette.button_save}
            />
            {/* text */}
            <Text style={s.text}>
                {label}
            </Text>
        </View>
    );
};

const s = StyleSheet.create({
    rootContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        margin: 10,
    },
    text: {
        fontSize: styles.textStyle.font_size_sm,
        color: styles.colorPalette.button_save,
    },
});

export default CheckboxSection;