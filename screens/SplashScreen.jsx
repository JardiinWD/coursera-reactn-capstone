import React from "react"
import { View, StyleSheet, Image } from "react-native"

const SplashScreen = () => {
  return (
    <View style={s.rootContainer}>
      <Image
        style={s.lemonLogo}
        source={require("../img/littleLemonLogo.png")}
      />
    </View>
  );
};

const s = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  lemonLogo: {
    height: 100,
    width: "90%",
    resizeMode: "contain",
  },
});

export default SplashScreen;
