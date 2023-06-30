/* ==== REACT IMPORTS ==== */
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
/* ==== CUSTOM ==== */
import { styles } from '../utilities/style'

const Filters = ({ onChange, selections, sections }) => {
  
  const handleSelection = (i) => {
    onChange(i);
  };

  return (
    <View style={styles.filtersContainer}>
      {
      sections.map((section, index) => (
        <TouchableOpacity key={index} onPress={() => handleSelection(index)}  style={[styles.touchableItem,
            {
              flex: 1 / sections.length,
              backgroundColor: selections[index] ? styles.colorPalette.button_save : "#edefee",
            },
          ]}>
          <Text
            style={{ fontFamily: styles.fontFamily.Karla_ExtraBold,
              color: selections[index] ? "#edefee" : styles.colorPalette.button_save,
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Filters;


const s = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
  },
  touchableItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 9,
    marginRight: 15,
  }
});

