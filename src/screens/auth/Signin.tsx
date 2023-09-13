import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import MyTextInput from "@/components/MyTextInput";
import AppColors from "@/constants/color";
import AppRoutes from "@/constants/route";
import { EvilIcons } from "@expo/vector-icons";
import { AppCommon } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectAuth } from "@/store/features/auth/auth-selector";
import { State } from "@/constants/state";
import { signInThunk } from "@/store/features/auth/auth-thunk";
import { useThemeContext } from "@/context/ThemeContext";

const Signin = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerShown: navigation.canGoBack(),
    });
  }, [navigation]);

  type SigninForm = {
    first_value: string;
    password: string;
  };

  const [form, setForm] = React.useState<SigninForm>({
    first_value: "",
    password: "",
  });

  const onInputChange = (text: string, name: keyof SigninForm) => {
    setForm({
      ...form,
      [name]: text,
    });
  };

  const onPressSignUpNow = () => {
    navigation.navigate(AppRoutes.SIGNUP);
  };

  const validateForm = (): boolean => {
    const { first_value, password } = form;
    if (!first_value) {
      alert("Tên người dùng/email là bắt buộc");
      return false;
    }
    if (!password) {
      alert("Mật khẩu là bắt buộc");
      return false;
    }
    return true;
  };

  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuth);
  const isLoading = status === State.LOADING;
  const onPressLetsGo = async () => {
    if (!validateForm()) return;
    dispatch(signInThunk(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const success = res.payload.success;
        if (success) {
          navigation.replace(AppRoutes.CHATS);
          navigation.reset({
            index: 0,
            routes: [{ name: AppRoutes.CHATS }],
          });
        } else {
          alert(res.payload.message);
        }
      }
    });
  };

  const onPressForgotPassword = () => {
    navigation.navigate(AppRoutes.FORGOT_PASSWORD);
  };

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          style={[
            styles.titleText,
            {
              color: isDarkMode ? AppColors.darkMode.black : AppColors.black,
            },
          ]}
        >
          Đăng nhập
        </Text>
        <View>
          <MyTextInput
            label="Tên người dùng/email"
            value={form.first_value}
            onChangeText={(text) => onInputChange(text, "first_value")}
            placeholder="Nhập tên người dùng/email của bạn"
            autoFocus
          />
          <MyTextInput
            label="Mật khẩu"
            value={form.password}
            onChangeText={(text) => onInputChange(text, "password")}
            placeholder="Nhập mật khẩu của bạn"
            keyboardType="default"
            isPassword
            secureTextEntry
          />
        </View>
        <TouchableOpacity onPress={onPressForgotPassword}>
          <Text
            style={[
              styles.text,
              {
                color: isDarkMode
                  ? AppColors.darkMode.primary
                  : AppColors.primary,
                textAlign: "right",
                marginRight: 20,
                textDecorationColor: isDarkMode
                  ? AppColors.darkMode.primary
                  : AppColors.primary,
                textDecorationLine: "underline",
              },
            ]}
          >
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.signinBtn,
            {
              opacity: isLoading ? 0.5 : 1,
              backgroundColor: isDarkMode
                ? AppColors.darkMode.primary
                : AppColors.primary,
            },
          ]}
          disabled={isLoading}
          onPress={onPressLetsGo}
        >
          {isLoading && <ActivityIndicator />}
          <Text
            style={[
              styles.signinBtnText,
              {
                color: isDarkMode
                  ? AppColors.darkMode.onPrimary
                  : AppColors.onPrimary,
              },
            ]}
          >
            Khám phá ngay
          </Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text
            style={[
              styles.text,
              {
                color: isDarkMode ? AppColors.darkMode.black : AppColors.black,
              },
            ]}
          >
            Chưa có tài khoản?{" "}
          </Text>
          <TouchableOpacity onPress={onPressSignUpNow}>
            <Text
              style={[
                styles.signupText,
                {
                  color: isDarkMode
                    ? AppColors.darkMode.primary
                    : AppColors.primary,
                },
              ]}
            >
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    gap: 20,
    minHeight: AppCommon.SCREEN_HEIGHT,
  },
  titleText: {
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.h3,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: AppFonts.regular,
  },
  signupText: {
    fontFamily: AppFonts.regular,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
    color: AppColors.primary,
  },
  signinBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signinBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
