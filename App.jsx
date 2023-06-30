/* ==== REACT IMPORTS ==== */
import { Alert } from "react-native";
import { useCallback, useReducer, useEffect, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";
/* ==== SCREENS IMPORTS ==== */
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
import Homescreen from "./screens/Homescreen";
import { AuthContext } from "./contexts/AuthContext";
/* ==== EXPO IMPORTS ==== */
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font'

export default function App({ navigation }) {

  // FONTS
  const [fontsLoaded] = useFonts({
    "Karla-Medium": require("./fonts/Karla-Medium.ttf"),
    "Karla-Regular": require("./fonts/Karla-Regular.ttf"),
    "Karla-Bold": require("./fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("./fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Medium": require("./fonts/MarkaziText-Medium.ttf"),
    "MarkaziText-Regular": require("./fonts/MarkaziText-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "onboard":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
        default:
          return prevState; // Restituisci lo stato precedente per azioni non riconosciute
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );

  useEffect(() => {
    (async () => {
      let profileData = [];
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        if (getProfile !== null) {
          profileData = getProfile;
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (Object.keys(profileData).length != 0) {
          dispatch({ type: "onboard", isOnboardingCompleted: true });
        } else {
          dispatch({ type: "onboard", isOnboardingCompleted: false });
        }
      }
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async data => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: true });
      },
      update: async data => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        Alert.alert("Success", "Successfully saved changes!");
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: false });
      },
    }),
    []
  );

  if (!fontsLoaded) {
    return <SplashScreen />;
  }


  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen
                name="Home"
                component={Homescreen}
                options={{ headerShown: false }}
                onLayout={onLayoutRootView}
              />
              <Stack.Screen 
                name="Profile" 
                component={Profile}
                onLayout={onLayoutRootView} 
              />
            </>
          ) : (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
              onLayout={onLayoutRootView}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
