import React from "react";
import { Image, StyleSheet, ImageStyle } from "react-native";

const ChatbotIcon = ({ style }: { style?: ImageStyle }) => {
  return (
    <Image
      source={require("@assets/logo/logo_4x.png")}
      style={{
        width: 30,
        height: 30,
        alignSelf: "flex-start",
        ...style,
      }}
      resizeMode="contain"
    />
  );
};

export default ChatbotIcon;

const styles = StyleSheet.create({});
