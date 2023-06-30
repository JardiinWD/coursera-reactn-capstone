/* ==== REACT IMPORTS ==== */
import React, { useState, useContext, useRef } from "react";
import { View, Image, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Text, Pressable } from "react-native";
import PagerView from "react-native-pager-view";
import { AuthContext } from "../contexts/AuthContext";
/* ==== EXPO IMPORTS ==== */
import Constants from "expo-constants";
/* ==== CUSTOM IMPORTS ==== */
import { checkUserEmail, checkUserName } from "../utilities";
import { styles } from '../utilities/style'
import FormPage from "../components/FormPage";

export default function Onboarding({ onLayout }) {
  // Destructuring from Context
  const { onboard } = useContext(AuthContext);
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const isEmailValid = checkUserEmail(email);
  const isFirstNameValid = checkUserName(firstName);
  const isLastNameValid = checkUserName(lastName);
  const viewPagerRef = useRef(PagerView);

  return (
    <>
      {/* rootContainer */}
      <KeyboardAvoidingView
        style={s.rootContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        onLayout={onLayout}
      >
        {/* headerContainer */}
        <View style={s.headerContainer}>
          {/* logoImage */}
          <Image
            style={s.logoImage}
            source={require("../img/littleLemonLogo.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon"}
          />
        </View>
        {/* onboardingText */}
        <Text style={s.onboardingText}> 
          Let us get to know you
        </Text>
        {/* viewPager */}
        <PagerView
          ref={viewPagerRef}
          style={s.viewPager}
          scrollEnabled={false}
          initialPage={0}
        >
            <View style={styles.page} key="1">
              <View style={styles.pageContainer}>
                <Text style={styles.text}>First Name</Text>
                <TextInput
                  style={styles.inputBox}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={"First Name"}
                />
              </View>
              <View style={styles.pageIndicator}>
                <View style={[styles.pageDot, styles.pageDotActive]}></View>
                <View style={styles.pageDot}></View>
                <View style={styles.pageDot}></View>
              </View>
              <Pressable
                style={[styles.btn, isFirstNameValid ? "" : styles.btnDisabled]}
                onPress={() => viewPagerRef.current.setPage(1)}
                disabled={!isFirstNameValid}
              >
                <Text style={styles.btntext}>Next</Text>
            </Pressable>
            </View>
            <View style={styles.page} key="2">
              <View style={styles.pageContainer}>
                <Text style={styles.text}>Last Name</Text>
                <TextInput
                  style={styles.inputBox}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={"Last Name"}
                />
              </View>
              <View style={styles.pageIndicator}>
                <View style={styles.pageDot}></View>
                <View style={[styles.pageDot, styles.pageDotActive]}></View>
                <View style={styles.pageDot}></View>
              </View>
              <View style={styles.buttons}>
                <Pressable
                  style={styles.halfBtn}
                  onPress={() => viewPagerRef.current.setPage(0)}
                >
                  <Text style={styles.btntext}>Back</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.halfBtn,
                    isLastNameValid ? "" : styles.btnDisabled,
                  ]}
                  onPress={() => viewPagerRef.current.setPage(2)}
                  disabled={!isLastNameValid}
                >
                  <Text style={styles.btntext}>Next</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.page} key="3">
              <View style={styles.pageContainer}>
                <Text style={styles.text}>Email</Text>
                <TextInput
                  style={styles.inputBox}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={"Email"}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.pageIndicator}>
                <View style={styles.pageDot}></View>
                <View style={styles.pageDot}></View>
                <View style={[styles.pageDot, styles.pageDotActive]}></View>
              </View>
              <View style={styles.buttons}>
                <Pressable
                  style={styles.halfBtn}
                  onPress={() => viewPagerRef.current.setPage(1)}
                >
                  <Text style={styles.btntext}>Back</Text>
                </Pressable>
                <Pressable
                  style={[styles.halfBtn, isEmailValid ? "" : styles.btnDisabled]}
                  onPress={() => onboard({ firstName, lastName, email })}
                  disabled={!isEmailValid}
                >
                  <Text style={styles.btntext}>Submit</Text>
                </Pressable>
              </View>
            </View>
        </PagerView>
      </KeyboardAvoidingView>
    </>
  )
}
const s = StyleSheet.create({
  rootContainer: {
    backgroundColor: styles.colorPalette.primary_white,
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  logoImage: {
    height: styles.commonDimensions.height_50,
    width: styles.commonDimensions.width_150,
    resizeMode: "contain"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
    padding: 12
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingText: {
    paddingVertical: 58,
    textAlign: "center",
    fontSize: styles.textStyle.font_size_xxl,
    fontFamily: styles.fontFamily.MarkaziText_Medium,
    color: styles.colorPalette.button_save,
  },
  text: {
    fontSize: styles.textStyle.font_size_xl,
    fontFamily: styles.fontFamily.Karla_ExtraBold,
    color: styles.colorPalette.button_save,
  },
  inputBox: {
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
    fontFamily: styles.fontFamily.Karla_Medium,
  },
  btn: {
    padding: 10,
    alignSelf: "stretch",
    marginHorizontal: 18,
    marginBottom: 58,
    borderWidth: 1,
    backgroundColor: styles.colorPalette.button_primary,
    borderColor: styles.colorPalette.button_primary,
    borderRadius: 9,
  },
  btnDisabled: {
    backgroundColor: "#f1f4f7",
  },
  buttons: {
    display: "flex",
    marginLeft: 18,
    marginBottom: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfBtn: {
    flex: 1,
    marginRight: 18,
    padding: 10,
    borderRadius: 10,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: styles.colorPalette.button_primary,
    backgroundColor: styles.colorPalette.button_primary,
  },
  btnText: {
    fontSize: styles.textStyle.font_size_xl,
    color: "#333",
    fontFamily: styles.fontFamily.Karla_Bold,
    alignSelf: "center",
  },
  pageIndicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  pageDot: {
    backgroundColor: "#67788a",
    marginHorizontal: 10,
    borderRadius: 11,
    width: styles.commonDimensions.width_22,
    height: styles.commonDimensions.height_22,
  },
  pageDotActive: {
    backgroundColor: styles.colorPalette.button_primary,
    width: styles.commonDimensions.width_22,
    height: styles.commonDimensions.height_22,
    borderRadius: 11,
  },
});
