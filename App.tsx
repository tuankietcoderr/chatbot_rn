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
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BotDataProvider } from "@/context/BotDataContext";
import { DataProvider } from "@/context/DataContext";
import Signin from "@/screens/auth/Signin";
import Signup from "@/screens/auth/Signup";
import Profile from "@/screens/profile/Profile";
import Save from "@/screens/profile/Save";
import { store } from "@/store/store";
import AppRoutes from "@constants/route";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatList from "@screens/chats/ChatList";
import MainChat from "@screens/main/MainChat";
import OnboardingScreen from "@screens/onboarding/Onboarding";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import Font from "@/screens/profile/settings/Font";
import Language from "@/screens/profile/settings/Language";
import Theme from "@/constants/theme";
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
  const theme = useColorScheme();
  console.log({ theme });
  if (!fontsLoaded) {
    return null;
  } else {
    console.log("fontsLoaded");
  }

  const initialRouteName = AppRoutes.ONBOARDING;
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <DataProvider>
          <BotDataProvider>
            <SafeAreaProvider>
              <NavigationContainer
              // theme={theme === "dark" ? Theme.dark : Theme.light}
              >
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
                  <Stack.Screen
                    name={AppRoutes.LANGUAGE}
                    component={Language}
                  />
                </Stack.Navigator>
              </NavigationContainer>
              <StatusBar style="auto" />
            </SafeAreaProvider>
          </BotDataProvider>
        </DataProvider>
      </Provider>
    </RootSiblingParent>
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
