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
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "@/Navigation";
import { BotDataProvider } from "@/context/BotDataContext";
import { DataProvider } from "@/context/DataContext";
import { DeadRoomProvider } from "@/context/DeadRoomContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { store } from "@/store/store";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();
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

  return (
    <RootSiblingParent>
      <Provider store={store}>
        <ThemeProvider>
          <DataProvider>
            <BotDataProvider>
              <DeadRoomProvider>
                <SafeAreaProvider>
                  <Navigation />
                  <StatusBar style="auto" />
                </SafeAreaProvider>
              </DeadRoomProvider>
            </BotDataProvider>
          </DataProvider>
        </ThemeProvider>
      </Provider>
      <StatusBar style="auto" />
    </RootSiblingParent>
  );
}
