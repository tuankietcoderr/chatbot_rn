import ChatItem from "@/components/ChatItem";
import { useBotDataContext } from "@/context/BotDataContext";
import MainLayout from "@/layout/MainLayout";
import { IChatItem } from "@/schema/client/chat-item";
import { IAnswer } from "@/schema/server/answer";
import AppColors from "@constants/color";
import AppFonts from "@constants/font";
import AppFontSizes from "@constants/font-size";
import AppRoutes from "@constants/route";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TypingAnimation } from "react-native-typing-animation";
import { useFocusEffect, useRoute } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppCommon } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth-selector";
import { Ionicons } from "@expo/vector-icons";
import { MainHeaderRight, MainHeaderTitle } from "@/components/MainHeader";
import { selectRoom } from "@/store/features/room/room-selector";
import { State } from "@/constants/state";
import { createRoomThunk } from "@/store/features/room/room-thunk";
import {
  getChatsOfRoomThunk,
  sendChatThunk,
} from "@/store/features/chat/chat-thunk";
import { selectChat } from "@/store/features/chat/chat-selector";
import { ModalProvider } from "@/context/ModalContext";
import { randomUUID } from "@/lib/random";
import { getAnswer } from "@/bot/bot-service";
import { AxiosError } from "axios";

const MAX_ITEM_PER_PAGE = 7;
const SCROLL_UP_THRESHOLD = 500;

const MainChat = ({ navigation }: NativeStackScreenProps<any>) => {
  const dispatch = useAppDispatch();
  const { chats, status: chatStatus } = useAppSelector(selectChat);
  const isChatLoading = chatStatus === State.LOADING;
  const params = useRoute<any>();
  const roomId = params?.params?.roomId;
  const numberOfPage = Math.ceil(chats.length / MAX_ITEM_PER_PAGE);
  const [page, setPage] = useState(1);
  const [firstScroll, setFirst] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const currrentY = useRef(null);
  const [chatsState, setChatsState] = useState<IChatItem[]>([]);
  const {
    chosenRelated,
    relatedQ,
    setRelatedQ,
    setChosenRelated,
    relatedTthc,
    setRelatedTthc,
  } = useBotDataContext();

  const onScroll = (event) => {
    if (firstScroll === null) {
      setFirst(event.nativeEvent.contentOffset.y);
    }
    currrentY.current = event.nativeEvent.contentOffset.y;
  };
  const onScrollENd = (event) => {
    if (firstScroll && event.nativeEvent.contentOffset.y < firstScroll) {
      if (page < numberOfPage) {
        setIsUploading(true);
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setIsUploading(false);
        }, SCROLL_UP_THRESHOLD);
      }
    }
  };

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
    setPage(1);
    setRelatedQ([]);
    setRelatedTthc([]);
    setDisableChat(false);
    setChosenRelated(["q", "tthc"]);
  }, [roomId]);

  useEffect(() => {
    (async function () {
      if (!roomId) return;
      dispatch(getChatsOfRoomThunk(roomId));
    })();
  }, [roomId]);

  useEffect(() => {
    if (chats && chats.length > 0) {
      setChatsState(
        chats.slice(Math.max(chats.length - MAX_ITEM_PER_PAGE, 0), chats.length)
      );
      setTimeout(() => {
        flatListRef.current && flatListRef.current?.scrollToEnd();
      }, 1000);
    }
  }, [chats]);

  useEffect(() => {
    setChatsState((prev) => [
      ...chats.slice(
        Math.max(chats.length - MAX_ITEM_PER_PAGE * page, 0),
        Math.max(chats.length - MAX_ITEM_PER_PAGE * (page - 1), 0)
      ),
      ...prev,
    ]);
  }, [page]);

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

    onSend(_message).then(async () => {
      await onResponse(_message);
    });
  };

  const onSend = async (message: string) => {
    setDisableChat(true);
  };

  const onResponse = async (_message: string) => {
    // setDisableChat(true);

    const answerRes = await getAnswer({
      question: _message,
      database: chosenRelated,
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
        answer: answer || "Sorry, no answer found for your question",
        roomId,
        reference: ref,
      })
    ).finally(() => {
      flatListRef.current && flatListRef.current?.scrollToEnd();
      setDisableChat(false);
    });
  };

  const onPressQ = () => {
    setChosenRelated(["q"]);
  };

  const onPressAP = () => {
    setChosenRelated(["tthc"]);
  };

  const onPressQoAP = (item: string) => {
    onPressSend(item);
  };

  const onPressStop = () => {
    setDisableChat(false);
  };

  const { width } = useWindowDimensions();
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
            ListHeaderComponent={() => isUploading && <ActivityIndicator />}
            onScrollEndDrag={onScrollENd}
            onScroll={onScroll}
            ref={flatListRef}
            onContentSizeChange={() => {
              // flatListRef.current && flatListRef.current?.scrollToEnd();
            }}
            data={chatsState}
            renderItem={({ item }) => (
              <ModalProvider>
                <ChatItem chat={item} />
              </ModalProvider>
            )}
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
                {disableChat && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 40,
                    }}
                  >
                    <TypingAnimation
                      dotColor={AppColors.gray}
                      dotMargin={6}
                      dotX={14}
                      dotSpeed={0.25}
                    />
                    <Text
                      style={{
                        ...styles.text,
                        color: AppColors.gray,
                      }}
                    >
                      Generating answer
                    </Text>
                  </View>
                )}
                {!disableChat &&
                  chatsState.length > 0 &&
                  chatsState[chatsState.length - 1].answer &&
                  chosenRelated === null && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.relatedBtn}
                        onPress={onPressQ}
                      >
                        <Text style={styles.relatedText}>
                          Related questions
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.relatedBtn}
                        onPress={onPressAP}
                      >
                        <Text style={styles.relatedText}>
                          Related administrative procedures
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                {!disableChat &&
                  chatsState.length > 0 &&
                  chatsState[chatsState.length - 1].answer &&
                  chosenRelated !== null && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        maxWidth: width * 0.8,
                        gap: 6,
                      }}
                    >
                      {renderRelated.map((item, index) => (
                        <TouchableOpacity
                          style={styles.relatedBtn}
                          onPress={() => onPressQoAP(item)}
                          key={item + index.toString()}
                        >
                          <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                      {!(
                        chosenRelated.includes("q") &&
                        chosenRelated.includes("tthc")
                      ) && (
                        <TouchableOpacity
                          style={[
                            styles.relatedBtn,
                            {
                              backgroundColor: AppColors.primary,
                            },
                          ]}
                          onPress={
                            JSON.stringify(chosenRelated) ===
                            JSON.stringify(["q"])
                              ? onPressAP
                              : onPressQ
                          }
                        >
                          <Text
                            style={[
                              styles.text,
                              {
                                color: AppColors.onPrimary,
                              },
                            ]}
                          >
                            Related{" "}
                            {JSON.stringify(chosenRelated) ===
                            JSON.stringify(["q"])
                              ? "administrative procedures"
                              : "questions"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={
            disableChat ? "Waiting for answer..." : "Enter your message"
          }
          onChangeText={onInputChange}
          value={message}
          multiline
          editable={!disableChat}
          maxLength={150}
          onFocus={() => {
            if (chatsState.length > 0) {
              flatListRef.current?.scrollToIndex({
                index: chatsState.length - 1,
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
    elevation: 8,
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
    elevation: 8,
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
