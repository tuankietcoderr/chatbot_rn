import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { Feather } from "@expo/vector-icons";
import AppColors from "@/constants/color";

type Props = TextInputProps & {
  label: string;
  labelVisible?: boolean;
  labelStyle?: TextStyle;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
};

const MyTextInput = ({
  label,
  labelVisible = true,
  labelStyle,
  isPassword,
  containerStyle,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const onPressEye = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {labelVisible && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.wrap}>
        <TextInput
          style={styles.input}
          {...props}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword &&
          (showPassword ? (
            <Feather
              name="eye"
              size={24}
              color={AppColors.gray}
              onPress={onPressEye}
            />
          ) : (
            <Feather
              name="eye-off"
              size={24}
              color={AppColors.gray}
              onPress={onPressEye}
            />
          ))}
      </View>
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    fontFamily: AppFonts.regular,
  },
  label: {
    fontFamily: AppFonts.regular,
    fontSize: AppFontSizes.small,
    color: AppColors.primary,
  },
  input: {
    fontFamily: AppFonts.regular,
    flex: 1,
    paddingTop: 4,
  },
  wrap: {
    flexDirection: "row",
    gap: 10,
  },
});
