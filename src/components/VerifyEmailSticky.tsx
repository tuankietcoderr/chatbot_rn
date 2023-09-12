import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useThemeContext } from "@/context/ThemeContext";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth-selector";
import { sendVerifyEmail } from "@/store/features/auth/auth-service";

const VerifyEmailSticky = () => {
  const user = useAppSelector(selectUser);
  const onPressVerify = async () => {
    sendVerifyEmail(user?.email || "")
      .then((res) => {
        if (res.success) {
          alert(
            "Vui lòng kiểm tra email của bạn. Nếu không thấy, vui lòng kiểm tra thư mục Spam"
          );
        } else {
          alert(res.message);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return !user?.is_email_verified ? (
    <View style={[styles.container]}>
      <Text style={[styles.text]}>Email của bạn vẫn chưa được xác thực. </Text>
      <TouchableOpacity onPress={onPressVerify}>
        <Text style={[styles.verify]}>Xác thực ngay</Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

export default VerifyEmailSticky;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFADD",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: AppFonts.regular,
    color: AppColors.primary,
  },
  verify: {
    fontFamily: AppFonts.bold,
    color: AppColors.primary,
    textDecorationLine: "underline",
  },
});
