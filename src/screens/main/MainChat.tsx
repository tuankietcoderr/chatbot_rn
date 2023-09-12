import { getAnswer } from "@/bot/bot-service";
import ChatItem from "@/components/ChatItem";
import GeneratingAnswer from "@/components/GeneratingAnswer";
import InitialChatbot from "@/components/InitialChatbot";
import { MainHeaderRight, MainHeaderTitle } from "@/components/MainHeader";
import Related from "@/components/Related";
import RelatedText from "@/components/RelatedText";
import { AppCommon } from "@/constants/common";
import { State } from "@/constants/state";
import { useBotDataContext } from "@/context/BotDataContext";
import { useDeadRoomContext } from "@/context/DeadRoomContext";
import { useThemeContext } from "@/context/ThemeContext";
import { randomUUID } from "@/lib/random";
import { IChatItem } from "@/schema/client/chat-item";
import { IAnswer } from "@/schema/server/answer";
import { selectChat } from "@/store/features/chat/chat-selector";
import {
  getChatsOfRoomThunk,
  sendChatThunk,
} from "@/store/features/chat/chat-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import AppColors from "@constants/color";
import AppFonts from "@constants/font";
import AppFontSizes from "@constants/font-size";
import AppRoutes from "@constants/route";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_ITEM_PER_PAGE = 7;
const SCROLL_UP_THRESHOLD = 500;

const MainChat = ({ navigation }: NativeStackScreenProps<any>) => {
  const dispatch = useAppDispatch();
  const { chats, status: chatStatus } = useAppSelector(selectChat);
  const isChatLoading = chatStatus === State.LOADING;
  const params = useRoute<any>();
  const roomId = params?.params?.roomId;
  const [chatsState, setChatsState] = useState<IChatItem[]>([]);
  const {
    chosenRelated,
    relatedQ,
    setRelatedQ,
    setChosenRelated,
    relatedTthc,
    setRelatedTthc,
  } = useBotDataContext();
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";
  const { dead, setDead, setCurrentRoomId, currentRoomId } =
    useDeadRoomContext();

  useFocusEffect(
    useCallback(() => {
      (async function () {
        const token = await AsyncStorage.getItem(AppCommon.ACCESS_TOKEN);
        if (!token) {
          navigation.replace(AppRoutes.SIGNIN);
          return;
        }
      })();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerRight: () => (
        <MainHeaderRight navigation={navigation} showChatList />
      ),
      headerTitle: () => <MainHeaderTitle />,
      headerTitleStyle: {
        fontFamily: AppFonts.bold,
        fontSize: AppFontSizes.h4,
      },
    });
  }, []);

  useEffect(() => {
    setRelatedQ([]);
    setRelatedTthc([]);
    setDisableChat(false);
    setChosenRelated(["q", "tthc"]);
    setChatsState([]);
  }, [roomId]);

  useEffect(() => {
    (async function () {
      if (!roomId) return;
      dispatch(getChatsOfRoomThunk(roomId));
      if (currentRoomId !== roomId) {
        setDead(true);
      }
    })();
  }, [roomId]);

  useEffect(() => {
    (async function () {
      if (dead) {
        await getAnswer({
          dead: true,
          roomId: currentRoomId,
        })
          .then(() => {
            setCurrentRoomId(roomId);
          })
          .finally(() => {
            setDead(false);
          });
      }
    })();
  }, [dead]);

  useEffect(() => {
    if (chats && chats.length > 0) {
      setChatsState(chats);
    }
  }, [chats]);

  const [message, setMessage] = React.useState<string>("");
  const [disableChat, setDisableChat] = React.useState<boolean>(false);

  const flatListRef = React.useRef<FlatList>(null);

  const onInputChange = (text: string) => {
    setMessage(text);
  };

  const onPressSend = async (_message: string) => {
    if (_message.length === 0) return;
    setMessage("");
    setChatsState((prev) => [
      ...prev,
      {
        _id: randomUUID(),
        question: _message,
        roomId,
      },
    ]);

    onSend().then(async () => {
      await onResponse(_message);
    });
  };

  const onSend = async () => {
    setDisableChat(true);
  };

  const onResponse = async (_message: string) => {
    const answerRes = await getAnswer({
      question: _message,
      database: chosenRelated,
      dead: false,
      roomId,
    });
    if (answerRes instanceof AxiosError) {
      alert(answerRes.message);
      setDisableChat(false);
      setChatsState((prev) => {
        const newPrev = [...prev];
        newPrev.pop();
        return newPrev;
      });
      return;
    }
    const { answer, ref, related_q, related_tthc, question } =
      answerRes as IAnswer;
    answer && setChosenRelated(null);
    setRelatedQ(related_q);
    setRelatedTthc(related_tthc);
    dispatch(
      sendChatThunk({
        question,
        answer: answer || "Xin lỗi, tôi không hiểu câu hỏi của bạn",
        roomId,
        reference: ref,
      })
    ).finally(() => {
      setDisableChat(false);
    });
  };

  const renderRelated =
    JSON.stringify(chosenRelated) === JSON.stringify(["q"])
      ? relatedQ
      : relatedTthc;

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        {!isChatLoading ? (
          <FlatList
            // initialNumToRender={MAX_ITEM_PER_PAGE}
            ref={flatListRef}
            onContentSizeChange={(w, h) => {
              setTimeout(() => {
                flatListRef.current &&
                  flatListRef.current?.scrollToOffset({
                    offset: h,
                    animated: false,
                  });
              }, 100);
            }}
            ListEmptyComponent={() => <InitialChatbot />}
            data={chatsState.length > 0 ? [...chatsState, {} as IChatItem] : []}
            renderItem={({ item }) => <ChatItem chat={item} />}
            contentContainerStyle={{
              gap: 10,
              padding: 16,
            }}
            keyExtractor={(item) => item._id + randomUUID()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View
                style={{
                  marginBottom: disableChat ? 120 : 80,
                }}
              >
                <GeneratingAnswer visible={disableChat} />
                <RelatedText
                  visible={
                    !!(
                      !disableChat &&
                      chatsState.length > 0 &&
                      chatsState[chatsState.length - 1].answer &&
                      chosenRelated === null &&
                      renderRelated.length > 0
                    )
                  }
                />
                <Related
                  data={renderRelated}
                  callback={onPressSend}
                  visible={
                    !!(
                      !disableChat &&
                      chatsState.length > 0 &&
                      chatsState[chatsState.length - 1].answer &&
                      chosenRelated !== null
                    )
                  }
                />
              </View>
            }
          />
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </View>
      {/* {disableChat && (
        <TouchableOpacity style={styles.stopBtn} onPress={onPressStop}>
          <Ionicons name="stop-outline" size={24} color="black" />
          <Text style={styles.text}>Stop generating</Text>
        </TouchableOpacity>
      )} */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDarkTheme
              ? AppColors.darkMode.white
              : AppColors.white,
            borderWidth: isDarkTheme ? 0 : StyleSheet.hairlineWidth,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkTheme
                ? AppColors.darkMode.white
                : AppColors.white,
              color: isDarkTheme ? AppColors.darkMode.black : AppColors.black,
            },
          ]}
          placeholder={disableChat ? "Đang trả lời..." : "Nhập câu hỏi của bạn"}
          placeholderTextColor={
            isDarkTheme ? AppColors.darkMode.gray : AppColors.gray
          }
          onChangeText={onInputChange}
          value={message}
          multiline
          editable={!disableChat}
          maxLength={150}
          onFocus={() => {
            if (chatsState.length > 0) {
              flatListRef.current?.scrollToIndex({
                index: chatsState.length,
              });
            }
          }}
        />
        <TouchableOpacity
          onPress={() => onPressSend(message)}
          style={{
            opacity: message.length > 0 ? 1 : 0.5,
          }}
          disabled={message.length === 0}
        >
          <Image
            source={require("@assets/icons/send.png")}
            style={{
              width: 30,
              height: 30,
              padding: 16,
              tintColor: isDarkTheme
                ? AppColors.darkMode.black
                : AppColors.primary,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingBottom: 16,
  },
  text: {
    fontFamily: AppFonts.regular,
    color: AppColors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    paddingRight: 12,
    gap: 10,
    // elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.gray,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: AppFonts.regular,
    backgroundColor: AppColors.white,
  },
  relatedBtn: {
    backgroundColor: AppColors.onPrimary,
    padding: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.primary,
  },
  relatedText: {
    color: AppColors.primary,
    fontFamily: AppFonts.regular,
  },
  scrollToBottom: {
    padding: 16,
    alignSelf: "center",
    borderRadius: 100,
  },
  stopBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 8,
  },
});
