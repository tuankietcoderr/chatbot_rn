import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AppCommon } from "@/constants/common";
import { useBotDataContext } from "@/context/BotDataContext";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import { useThemeContext } from "@/context/ThemeContext";

type Props = {
  data: string[];
  callback: (item: string) => void;
  visible?: boolean;
};

const Related = ({ data, callback, visible }: Props) => {
  const {
    chosenRelated,
    relatedQ,
    setRelatedQ,
    setChosenRelated,
    relatedTthc,
    setRelatedTthc,
  } = useBotDataContext();
  const onPressQ = () => {
    setChosenRelated(["q"]);
  };

  const onPressAP = () => {
    setChosenRelated(["tthc"]);
  };
  const onPressQoAP = (item: string) => {
    callback(item);
  };
  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";
  return visible ? (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: AppCommon.SCREEN_WIDTH * 0.8,
        gap: 6,
      }}
    >
      {data.map((item, index) => (
        <TouchableOpacity
          style={styles.relatedBtn}
          onPress={() => onPressQoAP(item)}
          key={item + index.toString()}
        >
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      ))}
      {!(chosenRelated?.includes("q") && chosenRelated?.includes("tthc")) && (
        <TouchableOpacity
          style={[
            styles.relatedBtn,
            {
              backgroundColor: isDarkMode
                ? AppColors.darkMode.primary
                : AppColors.primary,
            },
          ]}
          onPress={
            JSON.stringify(chosenRelated) === JSON.stringify(["q"])
              ? onPressAP
              : onPressQ
          }
        >
          <Text
            style={[
              styles.text,
              {
                color: isDarkMode
                  ? AppColors.darkMode.onPrimary
                  : AppColors.onPrimary,
              },
            ]}
          >
            {JSON.stringify(chosenRelated) === JSON.stringify(["q"])
              ? "Thủ tục hành chính"
              : "Câu hỏi"}{" "}
            liên quan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

export default Related;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingBottom: 16,
  },
  text: {
    fontFamily: AppFonts.regular,
    color: AppColors.primary,
  },
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
