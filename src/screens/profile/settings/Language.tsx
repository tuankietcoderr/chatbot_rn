import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { TLanguages } from "@/schema/client/setting";
const Language = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Change language",
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
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<TLanguages>("English");

  const onPress = (language: TLanguages) => {
    setSelectedLanguage(language);
  };

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={() => onPress("English")}>
        <Text style={styles.text}>English</Text>
        {selectedLanguage === "English" && (
          <Ionicons name="checkmark" size={20} color="black" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onPress("Vietnamese")}
      >
        <Text style={styles.text}>Vietnamese</Text>
        {selectedLanguage === "Vietnamese" && (
          <Ionicons name="checkmark" size={20} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Language;

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
