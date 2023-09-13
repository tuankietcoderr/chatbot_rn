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
import AppFontSizes from "@/constants/font-size";
import { useThemeContext } from "@/context/ThemeContext";
import { changePassword } from "@/store/features/auth/auth-service";
import { AppCommon } from "@/constants/common";
import useAlert from "@/hooks/useAlert";

const ChangePassword = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đổi mật khẩu",
      headerTitleAlign: "center",
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
    });
  }, []);

  type ChangePasswordForm = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const [form, setForm] = React.useState<ChangePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";

  const onInputChange = (text: string, name: keyof ChangePasswordForm) => {
    setForm({
      ...form,
      [name]: text,
    });
  };
  const _alert = useAlert();

  const onPressSave = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      _alert.show("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!AppCommon.PASSWORD_REGEX.test(form.newPassword)) {
      _alert.show("Mật khẩu mới không hợp lệ");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      _alert.show("Mật khẩu không trùng khớp");
      return;
    }
    setIsLoading(true);
    changePassword({
      newPassword: form.newPassword,
      oldPassword: form.oldPassword,
    })
      .then((res) => {
        if (res.success) {
          _alert.show("Đổi mật khẩu thành công");
          navigation.goBack();
        } else {
          _alert.show(res.message);
        }
      })
      .catch((err) => {
        _alert.show(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View>
      <MyTextInput
        label="Mật khẩu cũ"
        value={form.oldPassword}
        onChangeText={(text) => onInputChange(text, "oldPassword")}
        isPassword
        keyboardType="default"
        autoFocus
        placeholder="Nhập mật khẩu cũ"
      />
      <MyTextInput
        label="Mật khẩu mới"
        value={form.newPassword}
        onChangeText={(text) => onInputChange(text, "newPassword")}
        isPassword
        keyboardType="default"
        placeholder="Nhập mật khẩu mới"
      />
      <MyTextInput
        label="Xác nhận mật khẩu"
        value={form.confirmPassword}
        onChangeText={(text) => onInputChange(text, "confirmPassword")}
        isPassword
        keyboardType="default"
        placeholder="Nhập lại mật khẩu mới"
      />
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
    </View>
  );
};

export default ChangePassword;

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
