import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TypingAnimation } from "react-native-typing-animation";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import ChatbotIcon from "./ChatbotIcon";

const GeneratingAnswer = ({ visible }: { visible: boolean }) => {
  return (
    visible && (
      <View
        style={{
          flexDirection: "row",
          gap: 40,
        }}
      >
        <TypingAnimation
          dotColor={AppColors.gray}
          dotMargin={6}
          dotX={14}
          dotSpeed={0.25}
        />
        <Text
          style={{
            fontFamily: AppFonts.semiBold,
            color: AppColors.gray,
          }}
        >
          Đang trả lời...
        </Text>
      </View>
    )
  );
};

export default GeneratingAnswer;

const styles = StyleSheet.create({});
