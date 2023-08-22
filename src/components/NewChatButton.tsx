import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useNavigation } from "@react-navigation/core";
import AppRoutes from "@/constants/route";

const NewChatButton = () => {
  const navigate = useNavigation<any>();
  const onPressNewChat = () => {
    navigate.navigate(AppRoutes.MAIN);
  };
  return (
    <TouchableOpacity style={styles.addBtn} onPress={onPressNewChat}>
      <AntDesign name="plus" size={24} color={AppColors.onPrimary} />
      <Text
        style={{
          fontFamily: AppFonts.semiBold,
          color: AppColors.onPrimary,
        }}
      >
        New chat
      </Text>
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
});
