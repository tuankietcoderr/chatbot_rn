import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import OnboardingScreen from "@screens/onboarding/Onboarding";
import AppRoutes from "@constants/route";
import React from "react";
import MainChat from "@screens/main/MainChat";
import ChatList from "@screens/chats/ChatList";
import { BotDataProvider } from "@/context/BotDataContext";
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    console.log("fontsLoaded");
  }

  const initialRouteName = AppRoutes.ONBOARDING;

  return (
    <BotDataProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
              animation: "fade",
            }}
          >
            <Stack.Screen
              name={AppRoutes.ONBOARDING}
              component={OnboardingScreen}
            />
            <Stack.Screen name={AppRoutes.MAIN} component={MainChat} />
            <Stack.Screen name={AppRoutes.CHATS} component={ChatList} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </BotDataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
