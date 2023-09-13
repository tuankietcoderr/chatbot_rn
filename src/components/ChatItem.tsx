import AppColors from "@/constants/color";
import { AppCommon } from "@/constants/common";
import AppFonts from "@/constants/font";
import { randomUUID } from "@/lib/random";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { IChatItem } from "@schema/client/chat-item";
import React, { memo, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  addSaveThunk,
  removeSaveByMessageIdThunk,
} from "@/store/features/save/save-thunk";
import Toast from "react-native-root-toast";
import { selectUser } from "@/store/features/auth/auth-selector";
import ChatbotIcon from "./ChatbotIcon";
import { useThemeContext } from "@/context/ThemeContext";
import useAlert from "@/hooks/useAlert";

type Props = {
  chat: IChatItem;
};

const ChatItem = ({ chat }: Props) => {
  const { question, answer, reference, isSaved, _id } = chat;
  const [isSavedState, setIsSavedState] = useState(isSaved);
  const _alert = useAlert();

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
            Toast.show("Lưu thành công");
          } else {
            _alert.show(res.payload.message);
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
            Toast.show("Bỏ lưu thành công");
            setIsSavedState(false);
          } else {
            _alert.show(res.payload.message);
          }
        }
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  const onCopyToClipboard = async () => {
    setIsCopying(true);
    await Clipboard.setStringAsync(answer || "")
      .then(() => {
        setIsCopying(false);
        Toast.show("Đã sao chép vào khay nhớ tạm", {
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

  const CANT_UNDERSTAND = "Xin lỗi, tôi không hiểu câu hỏi của bạn";
  const HELLO_RESPONSE =
    "Xin chào! Bạn có câu hỏi hoặc vấn đề gì tôi có thể giúp bạn?";
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";

  return (
    <View
      style={{
        gap: 10,
      }}
    >
      {question ? (
        <View
          style={{
            width: "100%",
          }}
        >
          <View
            style={[
              styles.container,
              {
                // backgroundColor: AppColors.primary,
                alignSelf: "flex-start",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={isDarkTheme ? AppColors.darkMode.gray : AppColors.gray}
                style={{
                  alignSelf: "flex-start",
                }}
              />
              <Text
                style={[
                  styles.text,
                  {
                    maxWidth: AppCommon.SCREEN_WIDTH - 100,
                    color: isDarkTheme
                      ? AppColors.darkMode.black
                      : AppColors.black,
                  },
                ]}
              >
                {question}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      <View
        style={{
          opacity: answer ? 1 : 0,
          height: answer ? "auto" : 0,
        }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDarkTheme
                ? AppColors.darkMode.white
                : AppColors.white,
              borderWidth: isDarkTheme ? 0 : StyleSheet.hairlineWidth,
              borderColor: "#ADC4CE",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <ChatbotIcon />
            <Text
              style={[
                styles.text,
                {
                  color: isDarkTheme
                    ? AppColors.darkMode.black
                    : AppColors.black,
                  maxWidth: AppCommon.SCREEN_WIDTH - 100,
                },
              ]}
            >
              {answer}
            </Text>
          </View>
          {answer &&
            answer !== CANT_UNDERSTAND &&
            answer !== HELLO_RESPONSE && (
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[
                    styles.actionWithIcon,
                    {
                      backgroundColor: isSavedState
                        ? isDarkTheme
                          ? AppColors.darkMode.primary
                          : AppColors.primary
                        : isDarkTheme
                        ? AppColors.darkMode.white
                        : AppColors.white,
                      borderColor: isSavedState
                        ? AppColors.primary
                        : AppColors.gray,
                      borderWidth:
                        isDarkTheme && isSavedState
                          ? 0
                          : StyleSheet.hairlineWidth,
                    },
                  ]}
                  onPress={isSavedState ? onPressUnsave : onPressSave}
                >
                  <Ionicons
                    name={
                      isSavedState ? "ios-bookmark" : "ios-bookmark-outline"
                    }
                    size={16}
                    color={
                      isSavedState
                        ? isDarkTheme
                          ? AppColors.darkMode.onPrimary
                          : AppColors.onPrimary
                        : isDarkTheme
                        ? AppColors.darkMode.black
                        : AppColors.black
                    }
                  />
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isSavedState
                          ? isDarkTheme
                            ? AppColors.darkMode.onPrimary
                            : AppColors.onPrimary
                          : isDarkTheme
                          ? AppColors.darkMode.black
                          : AppColors.black,
                      },
                    ]}
                  >
                    {isLoadingSave
                      ? isSavedState
                        ? "Đang bỏ lưu..."
                        : "Đang lưu..."
                      : isSavedState
                      ? "Bỏ lưu"
                      : "Lưu"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionWithIcon, {}]}
                  onPress={onCopyToClipboard}
                >
                  <Ionicons
                    name="ios-copy-outline"
                    size={16}
                    color={
                      isDarkTheme ? AppColors.darkMode.black : AppColors.black
                    }
                  />
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDarkTheme
                          ? AppColors.darkMode.black
                          : AppColors.black,
                      },
                    ]}
                  >
                    {isCopying === null
                      ? "Sao chép"
                      : isCopying === true
                      ? "Đang sao chép..."
                      : "Đã sao chép"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

        {reference && reference?.length > 0 && answer && (
          <View
            style={[
              styles.referenceContainer,
              {
                backgroundColor: isDarkTheme
                  ? AppColors.darkMode.white
                  : AppColors.white,
                borderWidth: isDarkTheme ? 0 : StyleSheet.hairlineWidth,
              },
            ]}
          >
            <EvilIcons
              name="link"
              size={30}
              color="gray"
              style={{
                alignSelf: "flex-start",
              }}
            />
            <Text style={styles.referenceTextContainer}>
              {reference && reference.length > 0
                ? reference.map((ref) => (
                    <Text
                      key={ref.link + ref.title + randomUUID()}
                      onPress={() => {
                        Linking.openURL(ref.link).catch((err) =>
                          console.error("Couldn't load page", err)
                        );
                      }}
                      style={[
                        styles.referenceLink,
                        {
                          color: isDarkTheme
                            ? AppColors.darkMode.primary
                            : AppColors.primary,
                        },
                      ]}
                    >
                      {ref.title}
                    </Text>
                  ))
                : "Không thể tìm thấy liên kết"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ChatItem);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    // flexDirection: "row",
    // elevation: 8,
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
    padding: 10,
    backgroundColor: AppColors.onPrimary,
    alignSelf: "flex-start",
    borderRadius: 8,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ADC4CE",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  referenceTextContainer: {
    fontFamily: AppFonts.regular,
    maxWidth: AppCommon.SCREEN_WIDTH - 100,
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
