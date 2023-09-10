import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ChatbotIcon from "./ChatbotIcon";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import { AppCommon } from "@/constants/common";

const InitialChatbot = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: AppColors.white,
        padding: 10,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ADC4CE",
      }}
    >
      <ChatbotIcon />
      <Text
        style={{
          color: AppColors.black,
          fontFamily: AppFonts.regular,
          maxWidth: AppCommon.SCREEN_WIDTH - 100,
        }}
      >
        Tôi là robot hỏi đáp dịch vụ công. Tôi có thể giúp gì cho bạn
      </Text>
    </View>
  );
};

export default InitialChatbot;

const styles = StyleSheet.create({});
