import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppFontSizes from "@/constants/font-size";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";

type Props = {
  content: string;
};
const Empty = ({ content }: Props) => {
  return (
    <View>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  content: {
    fontFamily: AppFonts.regular,
    fontSize: AppFontSizes.body,
    textAlign: "center",
    color: AppColors.gray,
  },
});
