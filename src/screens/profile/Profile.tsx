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
import {
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
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
import { useThemeContext } from "@/context/ThemeContext";

const Profile = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Hồ sơ",
      headerTitleAlign: "center",
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerRight: ({ tintColor }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <TouchableOpacity onPress={onPressRefresh}>
            <Ionicons name="ios-refresh" size={30} color={tintColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressLogout}>
            <Ionicons
              name="log-out-outline"
              size={30}
              color={AppColors.primary}
            />
          </TouchableOpacity>
        </View>
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

  function onPressRefresh() {
    dispatch(getCurrentUserThunk());
  }

  async function onPressLogout() {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất chứ?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          dispatch(signOutThunk()).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              navigation.replace(AppRoutes.SIGNIN);
              navigation.reset({
                index: 0,
                routes: [{ name: AppRoutes.SIGNIN }],
              });
            } else {
              alert("Không thể đăng xuất");
            }
          });
        },
      },
    ]);
  }

  const { theme, toggleTheme } = useThemeContext();
  const isDarkMode = theme === "dark";

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    toggleTheme(newTheme);
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={[
            styles.info,
            {
              backgroundColor: isDarkMode ? "transparent" : AppColors.white,
            },
          ]}
        >
          <Image
            source={require("@assets/logo/logo_4x.png")}
            style={{
              width: 140,
              height: 140,
            }}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.fullName,
              {
                color: isDarkMode ? AppColors.darkMode.black : AppColors.black,
              },
            ]}
          >
            {user?.fullName}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
          <Text style={styles.username}>
            {user?.is_email_verified ? "Đã" : "Chưa"} xác thực email
          </Text>
          <TouchableOpacity
            style={[
              styles.editProfileBtn,
              {
                backgroundColor: isDarkMode
                  ? AppColors.darkMode.primary
                  : AppColors.primary,
              },
            ]}
            onPress={() => navigation.navigate(AppRoutes.EDIT_PROFILE)}
          >
            <Text
              style={[
                styles.editProfileBtnText,
                {
                  color: isDarkMode
                    ? AppColors.darkMode.onPrimary
                    : AppColors.onPrimary,
                },
              ]}
            >
              Sửa hồ sơ
            </Text>
            <FontAwesome
              name="angle-right"
              size={24}
              color={
                isDarkMode ? AppColors.darkMode.onPrimary : AppColors.onPrimary
              }
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>Nội dung</Text>
          <InProfileItem
            title="Câu trả lời đã lưu"
            to={AppRoutes.SAVED}
            icon={
              <Ionicons
                name="ios-bookmarks-outline"
                size={24}
                color={isDarkMode ? AppColors.darkMode.black : AppColors.black}
              />
            }
          />
        </View>
        <View>
          <Text style={styles.title}>Tùy chỉnh</Text>
          <InProfileItem
            title="Chế độ tối"
            icon={
              <Ionicons
                name="moon-outline"
                size={24}
                color={isDarkMode ? AppColors.darkMode.black : AppColors.black}
              />
            }
            type="switch"
            toggleCb={changeTheme}
            switchValue={isDarkMode}
          />
        </View>
      </View>
      <Text style={styles.version}>
        Phiên bản{" "}
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
    justifyContent: "space-between",
  },
  title: {
    fontFamily: AppFonts.semiBold,
    color: AppColors.gray,
    marginHorizontal: 16,
    marginVertical: 12,
    fontSize: AppFontSizes.small,
  },
  info: {
    alignItems: "center",
    backgroundColor: AppColors.white,
    paddingVertical: 16,
    gap: 8,
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
  editProfileBtnText: {
    fontFamily: AppFonts.semiBold,
    color: AppColors.onPrimary,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
});
