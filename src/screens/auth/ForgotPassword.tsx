import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import MyTextInput from "@/components/MyTextInput";
import AppColors from "@/constants/color";
import { useThemeContext } from "@/context/ThemeContext";
import AppFontSizes from "@/constants/font-size";
import { AppCommon } from "@/constants/common";
import { resetPassword } from "@/store/features/auth/auth-service";
import AppRoutes from "@/constants/route";
import useAlert from "@/hooks/useAlert";

const ForgotPassword = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Quên mật khẩu",
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerTitleAlign: navigation.canGoBack() ? "center" : "left",
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerShown: navigation.canGoBack(),
    });
  }, [navigation]);

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";
  const _alert = useAlert();

  const onPressForgotPassword = async () => {
    if (!email) {
      return _alert.show("Vui lòng nhập email");
    }

    if (!AppCommon.EMAIL_REGEX.test(email)) {
      return _alert.show("Email không hợp lệ");
    }

    setLoading(true);
    await resetPassword(email)
      .then((res) => {
        if (res.success) {
          _alert.show(
            "Chúng tôi đã gửi mật khẩu tạm thời đến email của bạn.Vui lòng kiểm tra email của bạn"
          );
          navigation.navigate(AppRoutes.SIGNIN);
        } else {
          _alert.show(res.message);
        }
      })
      .catch((error) => {
        _alert.show(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <MyTextInput
        label="Email"
        placeholder="Nhập email được đăng ký trong tài khoản của bạn"
        autoFocus
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: isDarkMode
              ? AppColors.darkMode.primary
              : AppColors.primary,
            opacity: loading ? 0.5 : 1,
          },
        ]}
        disabled={loading}
        onPress={onPressForgotPassword}
      >
        {loading && <ActivityIndicator />}
        <Text
          style={[
            styles.btnText,
            {
              color: isDarkMode
                ? AppColors.darkMode.onPrimary
                : AppColors.onPrimary,
            },
          ]}
        >
          Lấy lại mật khẩu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  btn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
