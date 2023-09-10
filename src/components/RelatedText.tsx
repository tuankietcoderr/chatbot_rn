import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useBotDataContext } from "@/context/BotDataContext";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import { useThemeContext } from "@/context/ThemeContext";

type Props = {
  visible: boolean;
};

const RelatedText = ({ visible }: Props) => {
  const { setChosenRelated } = useBotDataContext();
  const onPressQ = () => {
    setChosenRelated(["q"]);
  };

  const onPressAP = () => {
    setChosenRelated(["tthc"]);
  };

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        display: visible ? "flex" : "none",
      }}
    >
      <TouchableOpacity
        style={[
          styles.relatedBtn,
          {
            backgroundColor: isDarkMode
              ? AppColors.darkMode.black
              : AppColors.primary,
          },
        ]}
        onPress={onPressQ}
      >
        <Text style={styles.relatedText}>Câu hỏi liên quan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.relatedBtn,
          {
            backgroundColor: isDarkMode
              ? AppColors.darkMode.black
              : AppColors.onPrimary,
          },
        ]}
        onPress={onPressAP}
      >
        <Text style={styles.relatedText}>Thủ tục hành chính liên quan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RelatedText;

const styles = StyleSheet.create({
  relatedBtn: {
    backgroundColor: AppColors.onPrimary,
    padding: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.primary,
  },
  relatedText: {
    color: AppColors.primary,
    fontFamily: AppFonts.regular,
  },
});
