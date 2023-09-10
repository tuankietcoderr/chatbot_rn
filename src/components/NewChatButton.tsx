import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useNavigation } from "@react-navigation/core";
import AppRoutes from "@/constants/route";
import { useAppDispatch } from "@/store/hook";
import { createRoomThunk } from "@/store/features/room/room-thunk";
import { useThemeContext } from "@/context/ThemeContext";

const NewChatButton = () => {
  const navigate = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const onPressNewChat = () => {
    setIsLoading(true);
    dispatch(createRoomThunk({}))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            navigate.navigate(AppRoutes.MAIN, { roomId: res.payload.data._id });
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.addBtn,
        {
          opacity: isLoading ? 0.5 : 1,
          backgroundColor: isDarkMode
            ? AppColors.darkMode.primary
            : AppColors.primary,
        },
      ]}
      onPress={onPressNewChat}
      disabled={isLoading}
    >
      {!isLoading ? (
        <>
          <AntDesign
            name="plus"
            size={24}
            color={
              isDarkMode ? AppColors.darkMode.onPrimary : AppColors.onPrimary
            }
          />
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
            Cuộc trò chuyện mới
          </Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="small" color={AppColors.onPrimary} />
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
            Đang tạo...
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default NewChatButton;

const styles = StyleSheet.create({
  addBtn: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    margin: 16,
  },
  btnText: {
    fontFamily: AppFonts.semiBold,
    color: AppColors.onPrimary,
  },
});
