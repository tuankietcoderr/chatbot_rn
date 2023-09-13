import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useThemeContext } from "@/context/ThemeContext";

type Props = {
  title: string;
  isVisible?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  containerStyle?: ViewStyle;
};

const MyModal = ({
  isVisible,
  children,
  onClose,
  title,
  containerStyle,
}: Props) => {
  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <TouchableOpacity
        onPress={onClose}
        style={[
          styles.overlay,
          {
            backgroundColor: isDarkMode
              ? AppColors.darkMode.black
              : AppColors.black,
            opacity: isDarkMode ? 0.1 : 0.5,
          },
        ]}
      />
      <View style={[styles.modalContent, containerStyle]}>
        <View
          style={[
            styles.titleContainer,
            {
              backgroundColor: isDarkMode
                ? AppColors.darkMode.white
                : AppColors.white,
            },
          ]}
        >
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
          <Pressable onPress={onClose}>
            <MaterialIcons
              name="close"
              color={isDarkMode ? AppColors.darkMode.black : AppColors.black}
              size={24}
            />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default MyModal;

const styles = StyleSheet.create({
  modalContent: {
    height: "40%",
    width: "100%",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
    backgroundColor: AppColors.white,
    elevation: 5,
  },
  titleContainer: {
    height: 60,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray,
  },
  title: {
    fontFamily: AppFonts.semiBold,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.black,
    opacity: 0.5,
  },
});
