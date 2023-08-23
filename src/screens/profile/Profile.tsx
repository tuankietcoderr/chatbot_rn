import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppRoutes from "@/constants/route";
import { signOutThunk } from "@/store/features/auth/auth-thunk";
import { useEffect } from "react";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import { selectUser } from "@/store/features/auth/auth-selector";
import AppFontSizes from "@/constants/font-size";
import AppColors from "@/constants/color";
import InProfileItem from "@/components/InProfileItem";
import MainLayout from "@/layout/MainLayout";
import appData from "../../../app.json";

const Profile = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerRight: () => (
        <TouchableOpacity onPress={onPressLogout}>
          <Ionicons
            name="log-out-outline"
            size={30}
            color={AppColors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  async function onPressLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          dispatch(signOutThunk()).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              navigation.replace(AppRoutes.SIGNIN);
              navigation.reset({
                index: 0,
                routes: [{ name: AppRoutes.SIGNIN }],
              });
            } else {
              alert("Logout failed");
            }
          });
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Image
          source={require("@assets/logo/logo_4x.png")}
          style={{
            width: 140,
            height: 140,
          }}
          resizeMode="contain"
        />
        <Text style={styles.fullName}>{user?.fullName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>
      <MainLayout>
        <InProfileItem
          title="Saved answers"
          to={AppRoutes.SAVED}
          subTitle="All you saved answers"
          icon={
            <Ionicons name="ios-bookmarks-outline" size={24} color="black" />
          }
        />
      </MainLayout>
      <Text style={styles.version}>
        Version{" "}
        <Text
          style={{
            fontFamily: AppFonts.semiBold,
          }}
        >
          {appData.expo.version}
        </Text>
      </Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  info: {
    alignItems: "center",
  },
  fullName: {
    fontSize: AppFontSizes.medium,
    fontFamily: AppFonts.bold,
  },
  username: {
    fontSize: AppFontSizes.normal,
    fontFamily: AppFonts.semiBold,
    color: AppColors.gray,
  },
  version: {
    fontFamily: AppFonts.regular,
    textAlign: "center",
    color: AppColors.gray,
    marginBottom: 10,
  },
});
