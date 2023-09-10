import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome } from "@expo/vector-icons";
import { Switch } from "react-native-switch";

type Props = {
  icon?: any;
  title: string;
  subTitle?: string;
  to?: string;
  initialValue?: string;
  type?: "switch" | "default";
};

const InProfileItem = ({
  title,
  to,
  icon,
  subTitle,
  type = "default",
  initialValue,
}: Props) => {
  const navigate = useNavigation<any>();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const onPress = () => {
    to && navigate.navigate(to);
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <TouchableOpacity
      style={styles.container}
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
          <Text style={styles.title}>{title}</Text>
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
            <FontAwesome name="angle-right" size={24} color="black" />
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
            backgroundActive={AppColors.primary}
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
