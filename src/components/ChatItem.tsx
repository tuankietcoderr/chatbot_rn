import AppColors from "@/constants/color";
import { AppCommon } from "@/constants/common";
import AppFonts from "@/constants/font";
import { CHATBOT_INITIAL_STATE } from "@/constants/state";
import { randomUUID } from "@/lib/random";
import { Ionicons } from "@expo/vector-icons";
import { IChatItem } from "@schema/client/chat-item";
import React, { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAppDispatch } from "@/store/hook";
import {
  addSaveThunk,
  removeSaveByMessageIdThunk,
} from "@/store/features/save/save-thunk";
import Toast from "react-native-root-toast";

type Props = {
  chat: IChatItem;
};

const ChatItem = ({ chat }: Props) => {
  const { content, isBotChat, reference, isSaved, _id } = chat;
  const [showReference, setShowReference] = useState(true);
  const [isSavedState, setIsSavedState] = useState(isSaved);
  const onPressChatItem = () => {
    setShowReference((prev) => !prev);
  };

  const dispatch = useAppDispatch();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isCopying, setIsCopying] = useState<boolean | null>(null);

  const onPressSave = async () => {
    setIsLoadingSave(true);
    dispatch(addSaveThunk(_id!))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            setIsSavedState(true);
            Toast.show("Saved successfully");
          } else {
            alert(res.payload.message);
          }
        }
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  const onPressUnsave = async () => {
    setIsLoadingSave(true);
    dispatch(removeSaveByMessageIdThunk(_id!))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            Toast.show("Unsaved successfully");
            setIsSavedState(false);
          } else {
            alert(res.payload.message);
          }
        }
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  const onCopyToClipboard = async () => {
    setIsCopying(true);
    await Clipboard.setStringAsync(content)
      .then(() => {
        setIsCopying(false);
        Toast.show("Copied to clipboard", {
          position: Toast.positions.CENTER,
        });
        setTimeout(() => {
          setIsCopying(null);
        }, 3000);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const isAnswered =
    content !== "Sorry, no answer found for your question" &&
    content !== "Hi, you can ask me anything.";

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
          style={{
            maxWidth: AppCommon.SCREEN_WIDTH,
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

          {isAnswered && isBotChat && (
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.actionWithIcon,
                  {
                    backgroundColor: isSavedState
                      ? AppColors.primary
                      : AppColors.white,
                    borderColor: isSavedState
                      ? AppColors.primary
                      : AppColors.gray,
                  },
                ]}
                onPress={isSavedState ? onPressUnsave : onPressSave}
              >
                <Ionicons
                  name={isSavedState ? "ios-bookmark" : "ios-bookmark-outline"}
                  size={16}
                  color={isSavedState ? AppColors.onPrimary : AppColors.black}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color: isSavedState
                        ? AppColors.onPrimary
                        : AppColors.black,
                    },
                  ]}
                >
                  {isLoadingSave
                    ? isSavedState
                      ? "Unsaving..."
                      : "Saving..."
                    : isSavedState
                    ? "Unsave"
                    : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionWithIcon}
                onPress={onCopyToClipboard}
              >
                <Ionicons name="ios-copy-outline" size={16} color="black" />
                <Text style={styles.text}>
                  {isCopying === null
                    ? "Copy"
                    : isCopying === true
                    ? "Copying..."
                    : "Copied"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {showReference && content !== CHATBOT_INITIAL_STATE && isBotChat && (
        <Text style={styles.referenceContainer}>
          Reference:{" "}
          {reference && reference.length > 0
            ? reference.map((ref) => (
                <Text
                  key={ref.link + ref.title + randomUUID()}
                  onPress={() => {
                    Linking.openURL(ref.link).catch((err) =>
                      console.error("Couldn't load page", err)
                    );
                  }}
                  style={styles.referenceLink}
                >
                  {ref.title}
                </Text>
              ))
            : "No reference"}
        </Text>
      )}
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    elevation: 8,
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
    maxWidth: AppCommon.SCREEN_WIDTH,
    width: "auto",
    marginTop: 10,
    elevation: 8,
  },
  actionContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  actionWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.gray,
    padding: 6,
    borderRadius: 6,
  },
});
