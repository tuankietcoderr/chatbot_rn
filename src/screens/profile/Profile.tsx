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

const Profile = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Hồ sơ",
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
        <TouchableOpacity style={styles.editProfileBtn}>
          <Text style={styles.editProfileBtnText}>Sửa hồ sơ</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color={AppColors.onPrimary}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>Nội dung</Text>
        <InProfileItem
          title="Câu trả lời đã lưu"
          to={AppRoutes.SAVED}
          icon={
            <Ionicons name="ios-bookmarks-outline" size={24} color="black" />
          }
        />
      </View>
      <View>
        <Text style={styles.title}>Tùy chỉnh</Text>
        <InProfileItem
          title="Chế độ tối"
          icon={<Ionicons name="moon-outline" size={24} color="black" />}
          type="switch"
        />
      </View>
      {/* <Text style={styles.version}>
        Version{" "}
        <Text
          style={{
            fontFamily: AppFonts.semiBold,
          }}
        >
          {appData.expo.version}
        </Text>
      </Text> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
