import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppRoutes from "./constants/route";
import Signin from "./screens/auth/Signin";
import Signup from "./screens/auth/Signup";
import OnboardingScreen from "./screens/onboarding/Onboarding";
import MainChat from "./screens/main/MainChat";
import ChatList from "./screens/chats/ChatList";
import Profile from "./screens/profile/Profile";
import Save from "./screens/profile/Save";
import Font from "./screens/profile/settings/Font";
import Language from "./screens/profile/settings/Language";
import { useThemeContext } from "./context/ThemeContext";
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const initialRouteName = AppRoutes.ONBOARDING;
  const { theme } = useThemeContext();
  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          animation: "fade",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name={AppRoutes.SIGNIN} component={Signin} />
        <Stack.Screen name={AppRoutes.SIGNUP} component={Signup} />
        <Stack.Screen
          name={AppRoutes.ONBOARDING}
          component={OnboardingScreen}
        />
        <Stack.Screen name={AppRoutes.MAIN} component={MainChat} />
        <Stack.Screen name={AppRoutes.CHATS} component={ChatList} />
        <Stack.Screen name={AppRoutes.PROFILE} component={Profile} />
        <Stack.Screen name={AppRoutes.SAVED} component={Save} />
        <Stack.Screen name={AppRoutes.FONT} component={Font} />
        <Stack.Screen name={AppRoutes.LANGUAGE} component={Language} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
