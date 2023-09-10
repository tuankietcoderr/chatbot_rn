import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome } from "@expo/vector-icons";
import { Switch } from "react-native-switch";
import { useThemeContext } from "@/context/ThemeContext";

type Props = {
  icon?: any;
  title: string;
  subTitle?: string;
  to?: string;
  initialValue?: string;
  type?: "switch" | "default";
  toggleCb?: () => void;
  switchValue?: boolean;
};

const InProfileItem = ({
  title,
  to,
  icon,
  subTitle,
  type = "default",
  initialValue,
  toggleCb = () => {},
  switchValue = false,
}: Props) => {
  const navigate = useNavigation<any>();
  const [isEnabled, setIsEnabled] = React.useState(switchValue);
  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";
  const onPress = () => {
    to && navigate.navigate(to);
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggleCb();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? AppColors.darkMode.white
            : AppColors.white,
        },
      ]}
      onPress={onPress}
      disabled={!!!to}
    >
      {icon}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? AppColors.darkMode.black : AppColors.black,
              },
            ]}
          >
            {title}
          </Text>
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>
        {type === "default" ? (
          <TouchableOpacity
            onPress={onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {initialValue && (
              <Text style={styles.initialValue}>{initialValue}</Text>
            )}
            <FontAwesome
              name="angle-right"
              size={24}
              color={isDarkMode ? AppColors.darkMode.black : AppColors.black}
            />
          </TouchableOpacity>
        ) : (
          <Switch
            onValueChange={toggleSwitch}
            value={isEnabled}
            circleSize={20}
            circleBorderWidth={StyleSheet.hairlineWidth}
            backgroundInactive={AppColors.gray}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={
              isDarkMode ? AppColors.darkMode.primary : AppColors.primary
            }
            barHeight={20}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default InProfileItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontFamily: AppFonts.semiBold,
  },
  subTitle: {
    fontFamily: AppFonts.regular,
    color: AppColors.gray,
    fontSize: AppFontSizes.small,
  },
  initialValue: {
    fontFamily: AppFonts.regular,
    color: AppColors.gray,
    fontSize: AppFontSizes.small,
  },
});
