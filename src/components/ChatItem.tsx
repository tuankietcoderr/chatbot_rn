import {
  Linking,
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
import { useState } from "react";
import { CHATBOT_INITIAL_STATE } from "@/constants/state";
import { useModalContext } from "@/context/ModalContext";
import SavedModal from "./SavedModal";

type Props = {
  chat: IChatItem;
};

const ChatItem = ({ chat }: Props) => {
  const { width } = useWindowDimensions();
  const { content, isBotChat, reference } = chat;
  const [showReference, setShowReference] = useState(false);
  const { isVisible, onModalClose, onModalOpen } = useModalContext();
  console.log({ isVisible });
  const onPressChatItem = () => {
    setShowReference((prev) => !prev);
  };

  const onLongPressChatItem = () => {
    onModalOpen();
  };

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <SavedModal {...chat} />
      <TouchableOpacity
        style={{
          backgroundColor: isBotChat ? AppColors.white : AppColors.primary,
          alignSelf: isBotChat ? "flex-start" : "flex-end",
          padding: 10,
          maxWidth: width * 0.7,
          borderRadius: 8,
        }}
        onPress={onPressChatItem}
        disabled={!isBotChat}
        onLongPress={onLongPressChatItem}
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
      </TouchableOpacity>
      {showReference && content !== CHATBOT_INITIAL_STATE && isBotChat && (
        <Text
          style={{
            fontFamily: AppFonts.regular,
            padding: 10,
            backgroundColor: AppColors.onPrimary,
            alignSelf: "flex-start",
            borderRadius: 8,
            maxWidth: width * 0.7,
            marginVertical: 10,
          }}
        >
          Reference:{" "}
          {reference && Object.values(reference).every((value) => value) ? (
            <Text
              onPress={() => {
                Linking.openURL(reference.link).catch((err) =>
                  console.error("Couldn't load page", err)
                );
              }}
              style={styles.referenceLink}
            >
              {reference.title}
            </Text>
          ) : (
            "No reference"
          )}
        </Text>
      )}
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  text: {
    fontFamily: AppFonts.regular,
  },
  referenceLink: {
    color: AppColors.primary,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
  },
});
