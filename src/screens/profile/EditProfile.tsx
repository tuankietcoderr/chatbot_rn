import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import MyTextInput from "@/components/MyTextInput";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth-selector";
import { IUser } from "@/schema/client/user";
import AppColors from "@/constants/color";
import { useThemeContext } from "@/context/ThemeContext";
import AppFontSizes from "@/constants/font-size";
import { AppCommon } from "@/constants/common";
import { updateUserThunk } from "@/store/features/auth/auth-thunk";
import AppRoutes from "@/constants/route";
import useAlert from "@/hooks/useAlert";

const EditProfile = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Sửa hồ sơ",
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerShown: navigation.canGoBack(),
      headerRight: ({ tintColor }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(AppRoutes.CHANGE_PASSWORD)}
        >
          <Text
            style={{
              fontFamily: AppFonts.semiBold,
              color: tintColor,
            }}
          >
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const user = useAppSelector(selectUser);
  const _alert = useAlert();

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";

  const [userState, setUserState] = React.useState<IUser>({
    username: user?.username || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    is_email_verified: user?.is_email_verified || false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  const onInputChange = (text: string, name: keyof IUser) => {
    setUserState((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const onPressSave = () => {
    if (userState.fullName === "" || userState.username === "")
      return _alert.show("Vui lòng điền đầy đủ thông tin");
    if (!AppCommon.USERNAME_REGEX.test(userState.username))
      return _alert.show("Tên người dùng không hợp lệ");

    setIsLoading(true);
    dispatch(updateUserThunk(userState))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled" && res.payload.success) {
          _alert.show("Cập nhật thành công");
          navigation.goBack();
        } else {
          _alert.show("Cập nhật thất bại");
        }
      })
      .catch((err) => {
        _alert.show("Cập nhật thất bại");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView>
      <View>
        <MyTextInput
          containerStyle={{
            opacity: 0.5,
          }}
          label="Email"
          value={userState?.email}
          editable={false}
        />
        <MyTextInput
          label="Họ và tên"
          value={userState?.fullName}
          onChangeText={(text) => onInputChange(text, "fullName")}
        />
        <MyTextInput
          label="Tên người dùng"
          value={userState?.username}
          keyboardType="default"
          autoComplete="username"
          onChangeText={(text) => onInputChange(text, "username")}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.saveBtn,
          {
            opacity: isLoading ? 0.5 : 1,
            backgroundColor: isDarkMode
              ? AppColors.darkMode.primary
              : AppColors.primary,
          },
        ]}
        onPress={onPressSave}
        disabled={isLoading}
      >
        {isLoading && <ActivityIndicator />}
        <Text
          style={[
            styles.saveBtnText,
            {
              color: isDarkMode
                ? AppColors.darkMode.onPrimary
                : AppColors.onPrimary,
            },
          ]}
        >
          Lưu
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  saveBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
