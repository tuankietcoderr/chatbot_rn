import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppFonts from "@/constants/font";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import MainLayout from "@/layout/MainLayout";
import AppColors from "@/constants/color";
import NewChatButton from "@/components/NewChatButton";

const ChatList = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "Chats",
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <MainLayout>
        <Text>ChatList</Text>
      </MainLayout>
      <NewChatButton />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: AppFonts.regular,
  },
});
