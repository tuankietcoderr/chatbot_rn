import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import AppRoutes from "./constants/route";
import { useThemeContext } from "./context/ThemeContext";
import ForgotPassword from "./screens/auth/ForgotPassword";
import Signin from "./screens/auth/Signin";
import Signup from "./screens/auth/Signup";
import ChatList from "./screens/chats/ChatList";
import MainChat from "./screens/main/MainChat";
import OnboardingScreen from "./screens/onboarding/Onboarding";
import Profile from "./screens/profile/Profile";
import Save from "./screens/profile/Save";
import EditProfile from "./screens/profile/EditProfile";
import ChangePassword from "./screens/profile/ChangePassword";
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
          name={AppRoutes.FORGOT_PASSWORD}
          component={ForgotPassword}
        />

        <Stack.Screen
          name={AppRoutes.ONBOARDING}
          component={OnboardingScreen}
        />
        <Stack.Screen name={AppRoutes.MAIN} component={MainChat} />
        <Stack.Screen name={AppRoutes.CHATS} component={ChatList} />
        <Stack.Screen name={AppRoutes.PROFILE} component={Profile} />
        <Stack.Screen name={AppRoutes.SAVED} component={Save} />
        <Stack.Screen name={AppRoutes.EDIT_PROFILE} component={EditProfile} />
        <Stack.Screen
          name={AppRoutes.CHANGE_PASSWORD}
          component={ChangePassword}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
