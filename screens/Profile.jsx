/* ==== REACT IMPORTS ==== */
import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, TextInput, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
/* ==== EXPO IMPORTS ==== */
import * as ImagePicker from "expo-image-picker";
/* ==== CUSTOM ==== */
import { checkUserEmail, getInitials } from "../utilities/utils";
import { AuthContext } from "../contexts/AuthContext";
import InputField from "../components/InputField";
import CheckboxSection from "../components/CheckboxSection";
import {styles} from '../utilities/style'



const Profile = ({onLayout}) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [discard, setDiscard] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);

  const validateName = name => {
    if (name.length > 0) {
      return name.match(/[^a-zA-Z]/);
    } else {
      return true;
    }
  };

  const validateNumber = number => {
    if (isNaN(number)) {
      return false;
    } else if (number.length == 10) {
      return true;
    }
  };

  const { update, logout } = useContext(AuthContext);

  const updateProfile = (key, value) => {
    setProfile(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };


  const getIsFormValid = () => {
    return (
      !validateName(profile.firstName) &&
      !validateName(profile.lastName) &&
      checkUserEmail(profile.email) &&
      checkUserEmail(profile.phoneNumber)
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prevState => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    }
  };

  const removeImage = () => {
    setProfile(prevState => ({
      ...prevState,
      ["image"]: "",
    }));
  };

  return (
    /* container  */
    <KeyboardAvoidingView
      style={s.rootContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayout}
    >
      {/* header */}
      <View style={s.header}>
        <Image style={s.logo} source={require("../img/littleLemonLogo.png")} accessible={true} accessibilityLabel={"Logo"} />
      </View>
      {/* viewScroll */}
      <ScrollView style={s.viewScroll}>
        {/* headertext */}
        <Text style={s.headertext}>Personal information</Text>
        {/* text */}
        <Text style={s.text}>Avatar</Text>
        {/* avatarContainer */}
        <View style={s.avatarContainer}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={s.avatarImage} />
          ) : (
            <View style={s.avatarEmpty}>
              <Text style={s.avatarEmptyText}>
                {getInitials(profile.firstName, profile.lastName)}
              </Text>
            </View>
          )}
          {/* avatarButtons */}
          <View style={s.avatarButtons}>
            {/* changeBtn */}
            <Pressable style={s.changeBtn} title="Change Image" onPress={pickImage}>
              <Text style={s.saveBtnText}>Change</Text>
            </Pressable>
            {/* removeBtn */}
            <Pressable style={s.removeBtn} title="Remove Image" onPress={removeImage}>
              <Text style={s.discardBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
        {/* Input Field - FirstName */}
        <InputField
          label="First Name"
          value={profile.firstName}
          onChangeText={updateValue => updateProfile("firstName", updateValue)}
          validate={validateName}
          keyboardType="default"
        />    
        {/* Input Field - Lastname */}
        <InputField
          label="Last Name"
          value={profile.lastName}
          onChangeText={updateValue => updateProfile("lastName", updateValue)}
          validate={validateName}
          keyboardType="default"
        />    
        {/* Input Field - Email */} 
        <InputField
          label="Email"
          value={profile.email}
          onChangeText={updateValue => updateProfile("email", updateValue)}
          validate={validateEmail}
          keyboardType="email-address"
        />    
        {/* Input Field - PhoneNumber */} 
        <InputField
          label="Phone number (10 digit)"
          value={profile.phoneNumber}
          onChangeText={updateValue => updateProfile("phoneNumber", updateValue)}
          validate={validateNumber}
          keyboardType="phone-pad"
        />
        {/* headertext */}
        <Text style={s.headertext}>Email notifications</Text>
        {/* section */}
        <CheckboxSection
          label="Order statuses"
          value={profile.orderStatuses}
          onChange={updateValue => updateProfile("orderStatuses", updateValue)}
        />
        <CheckboxSection
          label="Password changes"
          value={profile.passwordChanges}
          onChange={updateValue => updateProfile("passwordChanges", updateValue)}
        />
        <CheckboxSection
          label="Special offers"
          value={profile.specialOffers}
          onChange={updateValue => updateProfile("specialOffers", updateValue)}
        />
        <CheckboxSection
          label="Newsletter"
          value={profile.newsletter}
          onChange={updateValue => updateProfile("newsletter", updateValue)}
        />
        {/* btn */}
        <Pressable style={s.btn} onPress={() => logout()}>
          <Text style={s.btntext}>Log out</Text>
        </Pressable>
        {/* buttons */}
        <View style={s.buttons}>
          <Pressable style={s.discardBtn} onPress={() => setDiscard(true)}>
            <Text style={s.discardBtnText}>Discard changes</Text>
          </Pressable>
          <Pressable
            style={[s.saveBtn, getIsFormValid() ? "" : s.btnDisabled]}
            onPress={() => update(profile)}
            disabled={!getIsFormValid()}
          >
            <Text style={s.saveBtnText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: styles.colorPalette.primary_white,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  logo: {
    height: styles.commonDimensions.height_50,
    width: styles.commonDimensions.width_150,
    resizeMode: "contain",
  },
  viewScroll: {
    flex: 1,
    padding: 10,
  },
  headertext: {
    fontSize: styles.textStyle.font_size_xl,
    paddingBottom: 10,
    fontFamily: styles.fontFamily.Karla_ExtraBold,
  },

  btn: {
    backgroundColor: styles.colorPalette.button_primary,
    marginVertical: 18,
    padding: 10,
    borderRadius: 9,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: styles.colorPalette.button_primary,
  },
  btnDisabled: {
    backgroundColor: styles.colorPalette.button_disabled,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 60,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: styles.colorPalette.button_save,
    borderRadius: 9,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: styles.colorPalette.button_save,
  },
  saveBtnText: {
    fontSize: styles.textStyle.font_size_l,
    color: styles.colorPalette.primary_white,
    fontFamily: styles.fontFamily.Karla_Bold,
    alignSelf: "center",
  },
  discardBtn: {
    flex: 1,
    backgroundColor: styles.colorPalette.primary_white,
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: styles.colorPalette.primary_white,
  },
  discardBtnText: {
    fontSize: styles.textStyle.font_size_l,
    color: styles.colorPalette.button_discard,
    fontFamily: styles.fontFamily.Karla_Bold,
    alignSelf: "center",
  },
  btntext: {
    fontSize: styles.textStyle.font_size_xl,
    fontFamily: styles.fontFamily.Karla_Bold,
    color: styles.colorPalette.button_discard,
    alignSelf: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: styles.textStyle.font_size_sm,
  },
  checkbox: {
    margin: 8,
  },
  error: {
    color: styles.colorPalette.primary_error,
    fontFamily: styles.fontFamily.Karla_Bold,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: styles.commonDimensions.width_80,
    height: styles.commonDimensions.height_80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: styles.commonDimensions.width_80,
    height: styles.commonDimensions.height_80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    backgroundColor: styles.colorPalette.primary_success,
  },
  avatarEmptyText: {
    fontSize: styles.textStyle.font_size_xxl,
    color: styles.colorPalette.primary_white,
    fontFamily: styles.fontFamily.Karla_Bold,
  },
  avatarButtons: {
    flexDirection: "row",
  },
  changeBtn: {
    backgroundColor: styles.colorPalette.button_save,
    borderWidth: 1,
    borderColor: styles.colorPalette.button_save,
    borderRadius: 9,
    marginHorizontal: 18,
    padding: 10,
  },
  removeBtn: {
    backgroundColor: styles.colorPalette.primary_white,
    borderColor: styles.colorPalette.primary_white,
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: styles.textStyle.font_size_sm,
    fontFamily: styles.fontFamily.Karla_Medium,
    marginBottom: 5,
},
});

export default Profile;