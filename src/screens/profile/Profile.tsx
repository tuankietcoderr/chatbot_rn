import InProfileItem from "@/components/InProfileItem";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import AppRoutes from "@/constants/route";
import MainLayout from "@/layout/MainLayout";
import { selectUser } from "@/store/features/auth/auth-selector";
import {
  getCurrentUserThunk,
  signOutThunk,
} from "@/store/features/auth/auth-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserThunk());
    }
  }, []);

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
        <View
          style={{
            gap: 8,
          }}
        >
          <InProfileItem
            title="Saved answers"
            to={AppRoutes.SAVED}
            subTitle="All you saved answers"
            icon={
              <Ionicons name="ios-bookmarks-outline" size={24} color="black" />
            }
          />
          <InProfileItem
            title="Settings"
            to={AppRoutes.SETTING}
            subTitle="Customize your experience"
            icon={
              <Ionicons name="ios-settings-outline" size={24} color="black" />
            }
          />
        </View>
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
