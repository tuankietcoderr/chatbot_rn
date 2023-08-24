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
import ReadMore from "@fawazahmed/react-native-read-more";
import MyReadMoreText from "./MyReadMoreText";
import { Ionicons } from "@expo/vector-icons";
import { AppCommon } from "@/constants/common";

type Props = {
  chat: IChatItem;
};

const ChatItem = ({ chat }: Props) => {
  const { content, isBotChat, reference, isSaved } = chat;
  const [showReference, setShowReference] = useState(true);
  const { isVisible, onModalClose, onModalOpen } = useModalContext();
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
      <View
        style={[
          styles.container,
          {
            backgroundColor: isBotChat ? AppColors.white : AppColors.primary,
            alignSelf: isBotChat ? "flex-start" : "flex-end",
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPressChatItem}
          disabled={!isBotChat}
          onLongPress={onLongPressChatItem}
          style={{
            maxWidth: AppCommon.SCREEN_WIDTH * 0.6,
          }}
        >
          <MyReadMoreText
            numberOfLines={8}
            style={[
              styles.text,
              {
                color: isBotChat ? AppColors.black : AppColors.onPrimary,
              },
            ]}
          >
            {content}
          </MyReadMoreText>
        </TouchableOpacity>
        {isSaved && (
          <Ionicons
            name="ios-bookmark"
            size={18}
            color={AppColors.primaryLight}
            style={{
              transform: [{ translateY: -14 }],
            }}
          />
        )}
      </View>
      {showReference && content !== CHATBOT_INITIAL_STATE && isBotChat && (
        <Text style={styles.referenceContainer}>
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
      <SavedModal {...chat} />
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
  },
  text: {
    fontFamily: AppFonts.regular,
  },
  referenceLink: {
    color: AppColors.primary,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
  },
  referenceContainer: {
    fontFamily: AppFonts.regular,
    padding: 10,
    backgroundColor: AppColors.onPrimary,
    alignSelf: "flex-start",
    borderRadius: 8,
    maxWidth: AppCommon.SCREEN_WIDTH * 0.7,
    marginTop: 10,
  },
});
