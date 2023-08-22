import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { IChatItem } from "@schema/client/chat-item";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import { IData } from "@/schema/server/data";
import { useBotDataContext } from "@/context/BotDataContext";

type Props = {
  chat: IChatItem;
};

const ChatItem = ({ chat }: Props) => {
  const { width } = useWindowDimensions();
  const { content, id, isBotChat, roomId } = chat;
  const { chosenRelated, setChosenRelated, related } = useBotDataContext();

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          backgroundColor: isBotChat ? AppColors.white : AppColors.primary,
          alignSelf: isBotChat ? "flex-start" : "flex-end",
          padding: 10,
          maxWidth: width * 0.7,
          borderRadius: 8,
        }}
      >
        <Text
          style={[
            styles.text,
            {
              color: isBotChat ? AppColors.black : AppColors.onPrimary,
            },
          ]}
        >
          {content}
        </Text>
      </View>
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  text: {
    fontFamily: AppFonts.regular,
  },
});
