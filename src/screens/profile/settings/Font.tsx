import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { TFontSize } from "@/schema/client/setting";
const Font = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Change font size",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
    });
  }, []);
  const [selectedFontSize, setSelectedFontSize] =
    React.useState<TFontSize>("Default");

  const sizes = ["Default", "Small", "Medium", "Large"];

  const onPress = (size: TFontSize) => {
    setSelectedFontSize(size);
  };

  return (
    <View>
      {sizes.map((size) => {
        return (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onPress(size as TFontSize)}
            key={size}
          >
            <Text style={styles.text}>{size}</Text>
            {selectedFontSize === size && (
              <Ionicons name="checkmark" size={20} color="black" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Font;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: AppFonts.semiBold,
  },
});
