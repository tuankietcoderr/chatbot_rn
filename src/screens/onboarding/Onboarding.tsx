import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useCallback } from "react";
import AppColors from "@constants/color";
import AppFontSizes from "@constants/font-size";
import AppFonts from "@constants/font";
import Onboarding, { Page } from "react-native-onboarding-swiper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/core";
import * as SplashScreen from "expo-splash-screen";
import AppRoutes from "@constants/route";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppCommon } from "@/constants/common";
import { useAppDispatch } from "@/store/hook";
import { getCurrentUserThunk } from "@/store/features/auth/auth-thunk";

const OnboardingScreen = ({ navigation }: NativeStackScreenProps<any>) => {
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      (async function () {
        try {
          const isFirstTime = await AsyncStorage.getItem(
            AppCommon.IS_FIRST_TIME
          );
          const token = await AsyncStorage.getItem(AppCommon.ACCESS_TOKEN);
          if (token) {
            dispatch(getCurrentUserThunk()).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                const success = res.payload.success;
                if (success) {
                  navigation.replace(AppRoutes.CHATS);
                  setTimeout(() => {
                    SplashScreen.hideAsync();
                  }, 1000);
                } else {
                  AsyncStorage.removeItem(AppCommon.ACCESS_TOKEN);
                }
              }
            });
          } else {
            if (isFirstTime === "true") {
              // ! replace with true
              navigation.replace(AppRoutes.SIGNIN);
              setTimeout(() => {
                SplashScreen.hideAsync();
              }, 1000);
            } else {
              SplashScreen.hideAsync();
            }
          }
        } catch {
          SplashScreen.hideAsync();
        }
      })();
    }, [])
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const { width, height } = useWindowDimensions();
  const imageWidth = width;
  const imageHeight = height / 3;

  const onboardingData: Page[] = [
    {
      subtitle: "",
      image: (
        <Image
          source={require("@assets/logo/logo_4x.png")}
          style={{ width: imageWidth * 0.5, height: imageHeight }}
          resizeMode="contain"
        />
      ),
      title: <Text style={styles.title}>Welcome to our Chatbot!</Text>,
      backgroundColor: "transparent",
    },
    {
      subtitle: (
        <Text style={styles.text}>
          Get ready to experience a seamless and intelligent conversation with
          our state-of-the-art Chatbot. We're here to assist and provide answers
          to your queries.
        </Text>
      ),
      image: (
        <Image
          source={require("@assets/images/onboarding_1.png")}
          style={{ width: imageWidth, height: imageHeight }}
          resizeMode="contain"
        />
      ),
      title: <Text style={styles.title}>Experience</Text>,
      backgroundColor: "transparent",
    },
    {
      subtitle: (
        <Text style={styles.text}>
          Say hello to our intelligent Chatbot designed to make your life
          easier. We're here to help you with any questions or problems you
          might have. Let's get started on this exciting journey!,
        </Text>
      ),
      image: (
        <Image
          source={require("@assets/images/onboarding_2.png")}
          style={{ width: imageWidth, height: imageHeight }}
          resizeMode="contain"
        />
      ),
      title: <Text style={styles.title}>Intelligence</Text>,
      backgroundColor: "transparent",
    },
  ];

  const [showStartButton, setShowStartButton] = React.useState(false);

  const onPressStart = async () => {
    await AsyncStorage.setItem(AppCommon.IS_FIRST_TIME, "true").then(() => {
      navigation.navigate(AppRoutes.SIGNIN);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <Onboarding
        pageIndexCallback={(index) => {
          setShowStartButton(index === 2);
        }}
        NextButtonComponent={undefined}
        showDone={false}
        showSkip={false}
        containerStyles={{
          flex: 1,
          justifyContent: "center",
        }}
        DotComponent={({ selected }) => (
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              marginHorizontal: 3,
              backgroundColor: selected ? AppColors.primary : AppColors.gray,
            }}
          />
        )}
        nextLabel=""
        bottomBarHighlight={false}
        pages={onboardingData}
      />
      {showStartButton && (
        <TouchableOpacity style={styles.btn} onPress={onPressStart}>
          <Text
            style={{
              color: AppColors.white,
              fontFamily: AppFonts.bold,
              fontSize: AppFontSizes.body,
              textAlign: "center",
            }}
          >
            Start
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: AppFontSizes.h3,
    fontFamily: AppFonts.bold,
    color: AppColors.primary,
    textAlign: "center",
  },
  text: {
    color: AppColors.black,
    fontSize: AppFontSizes.body,
    textAlign: "center",
    fontFamily: AppFonts.regular,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    textAlign: "center",
    fontSize: AppFontSizes.body,
    fontFamily: AppFonts.regular,
  },
});
