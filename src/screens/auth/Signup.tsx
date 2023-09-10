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
import { IUser } from "@/schema/client/user";
import { AppCommon } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { signUpThunk } from "@/store/features/auth/auth-thunk";
import { selectAuth } from "@/store/features/auth/auth-selector";
import { State } from "@/constants/state";
import { useThemeContext } from "@/context/ThemeContext";

const Signup = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerShown: navigation.canGoBack(),
    });
  }, [navigation]);

  type SignupForm = IUser & {
    confirmPassword: string;
  };

  const [form, setForm] = React.useState<SignupForm>({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const onInputChange = (text: string, name: keyof SignupForm) => {
    setForm({
      ...form,
      [name]: text,
    });
  };

  const onPressSignInNow = () => {
    navigation.replace(AppRoutes.SIGNIN);
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoutes.SIGNIN }],
    });
  };

  const validateForm = (): boolean => {
    const { fullName, username, password, confirmPassword } = form;

    if (!fullName) {
      alert("Tên đầy đủ là bắt buộc");
      return false;
    }

    if (!username) {
      alert("Tên người dùng là bắt buộc");
      return false;
    }

    if (username.length < 6) {
      alert("Tên người dùng phải có ít nhất 6 ký tự");
      return false;
    }

    const usernameRegex = new RegExp("^\\w[\\w.]{2,18}\\w$");
    if (!usernameRegex.test(username)) {
      alert("Tên người dùng không hợp lệ");
      return false;
    }

    if (!password) {
      alert("Mật khẩu là bắt buộc");
      return false;
    }

    const passwordRegex = new RegExp(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
    );

    if (!passwordRegex.test(password)) {
      alert(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
      return false;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuth);
  const isLoading = status === State.LOADING;

  const onPressSignUp = async () => {
    if (!validateForm()) return;
    dispatch(signUpThunk(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.success) {
          alert("Đăng ký thành công. Đăng nhập ngay!");
          navigation.replace(AppRoutes.SIGNIN);
          navigation.reset({
            index: 0,
            routes: [{ name: AppRoutes.SIGNIN }],
          });
        } else {
          alert(res.payload.message);
        }
      } else {
        alert("Đăng ký thất bại");
      }
    });
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
          Đăng ký
        </Text>
        <View>
          <MyTextInput
            label="Tên đầy đủ"
            value={form.fullName}
            onChangeText={(text) => onInputChange(text, "fullName")}
            placeholder="Nhập tên đầy đủ của bạn"
            autoFocus
            autoComplete="name"
          />
          <MyTextInput
            label="Tên người dùng"
            value={form.username}
            onChangeText={(text) => onInputChange(text, "username")}
            placeholder="Nhập tên người dùng của bạn"
            autoComplete="username"
            keyboardType="default"
          />
          <MyTextInput
            label="Mật khẩu"
            value={form.password}
            onChangeText={(text) => onInputChange(text, "password")}
            placeholder="Nhập mật khẩu của bạn"
            secureTextEntry
            autoComplete="password"
            keyboardType="default"
            isPassword
          />
          <MyTextInput
            label="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChangeText={(text) => onInputChange(text, "confirmPassword")}
            placeholder="Nhập lại mật khẩu để xác nhận"
            secureTextEntry
            keyboardType="default"
            isPassword
          />
        </View>
        <TouchableOpacity
          style={[
            styles.signupBtn,
            {
              opacity: isLoading ? 0.5 : 1,
              backgroundColor: isDarkMode
                ? AppColors.darkMode.primary
                : AppColors.primary,
            },
          ]}
          onPress={onPressSignUp}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator />}
          <Text
            style={[
              styles.signupBtnText,
              {
                color: isDarkMode
                  ? AppColors.darkMode.onPrimary
                  : AppColors.onPrimary,
              },
            ]}
          >
            Trở thành người dùng của Chatbot
          </Text>
        </TouchableOpacity>
        <View style={styles.signinContainer}>
          <Text
            style={[
              styles.text,
              {
                color: isDarkMode ? AppColors.darkMode.black : AppColors.black,
              },
            ]}
          >
            Đã có tài khoản?{" "}
          </Text>
          <TouchableOpacity onPress={onPressSignInNow} disabled={isLoading}>
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
              Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;

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
    marginHorizontal: 20,
  },
  signinContainer: {
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
  signupBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signupBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
