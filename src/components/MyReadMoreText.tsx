import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import ReadMore, { ReadMoreProps } from "@fawazahmed/react-native-read-more";

const MyReadMoreText = (props: ReadMoreProps) => {
  return (
    <ReadMore
      numberOfLines={props.numberOfLines || 3}
      seeMoreStyle={styles.moreLess}
      seeLessStyle={styles.moreLess}
      {...props}
    >
      {props.children}
    </ReadMore>
  );
};

export default MyReadMoreText;

const styles = StyleSheet.create({
  moreLess: {
    fontFamily: AppFonts.bold,
    color: AppColors.primary,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
  },
});
