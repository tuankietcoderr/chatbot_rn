import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { useNavigation } from "@react-navigation/core";

type Props = {
  icon?: any;
  title: string;
  subTitle?: string;
  to: string;
};

const InProfileItem = ({ title, to, icon, subTitle }: Props) => {
  const navigate = useNavigation<any>();

  const onPress = () => {
    navigate.navigate(to);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default InProfileItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.gray,
  },
  title: {
    fontFamily: AppFonts.semiBold,
  },
  subTitle: {
    fontFamily: AppFonts.regular,
    color: AppColors.gray,
    fontSize: AppFontSizes.small,
  },
});
