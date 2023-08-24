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
import React, { useCallback, useEffect, useState } from "react";
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

const example_response: IAnswer = {
  id: "1",
  answer:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  ref: {
    link: "https://www.google.com",
    title: "Google",
  },
  relatedQ: ["Test1", "Test2", "Test3", "Test4"],
  relatedTthc: ["Test1", "Test2", "Test3", "Test4"],
};

const MainChat = ({ navigation }: NativeStackScreenProps<any>) => {
  const dispatch = useAppDispatch();
  const { chats, status: chatStatus } = useAppSelector(selectChat);
  const isChatLoading = chatStatus === State.LOADING;
  const params = useRoute<any>();
  const roomId = params?.params?.roomId;
  const [refreshing, setRefreshing] = useState(false);
  const { chosenRelated, related, setRelated, setChosenRelated } =
    useBotDataContext();

  const onRefresh = async () => {
    dispatch(getChatsOfRoomThunk(roomId))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            setRefreshing(false);
          }
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
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
    setRelated([]);
    setChosenRelated(null);
    (async function () {
      if (!roomId) return;
      dispatch(getChatsOfRoomThunk(roomId)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
          }
        }
      });
    })();
  }, [roomId]);

  const [message, setMessage] = React.useState<string>("");
  const [disableChat, setDisableChat] = React.useState<boolean>(false);

  const flatListRef = React.useRef<FlatList>(null);

  const onInputChange = (text: string) => {
    setMessage(text);
  };

  const onPressSend = async (_message: string) => {
    if (_message.length === 0) return;
    setMessage("");

    onSend(_message).then(async () => {
      await onResponse();
    });
  };

  const onSend = async (message: string) => {
    dispatch(
      sendChatThunk({
        content: message,
        isBotChat: false,
        roomId,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.success) {
          setDisableChat(true);
        }
      }
    });
  };

  const onResponse = async () => {
    // setDisableChat(true);
    dispatch(
      sendChatThunk({
        content: example_response.answer,
        isBotChat: true,
        roomId,
        reference: {
          link: example_response.ref.link,
          title: example_response.ref.title,
        },
      })
    )
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            setChosenRelated("all");
          }
        }
      })
      .finally(() => {
        setDisableChat(false);
      });
  };

  useEffect(() => {
    if (chats && chats.length > 0) {
      flatListRef.current && flatListRef.current?.scrollToEnd();
    }
  }, []);

  const onPressQ = () => {
    setChosenRelated("q");
    setRelated(example_response.relatedQ);
  };

  const onPressAP = () => {
    setChosenRelated("tthc");
    setRelated(example_response.relatedTthc);
  };

  const onPressQoAP = (item: string) => {
    onPressSend(item);
  };

  const onPressStop = () => {
    setDisableChat(false);
  };

  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <MainLayout>
        {!isChatLoading ? (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            ref={flatListRef}
            onContentSizeChange={() => {
              flatListRef.current && flatListRef.current?.scrollToEnd();
            }}
            data={chats}
            renderItem={({ item }) => (
              <ModalProvider>
                <ChatItem chat={item} />
              </ModalProvider>
            )}
            contentContainerStyle={{
              gap: 10,
              marginTop: 10,
            }}
            keyExtractor={(item) => item._id}
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
                  chats.length > 0 &&
                  chats[chats.length - 1].isBotChat &&
                  chosenRelated === "all" && (
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
                  chats.length > 0 &&
                  chats[chats.length - 1].isBotChat &&
                  chosenRelated !== "all" &&
                  chosenRelated !== null && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        maxWidth: width * 0.7,
                        gap: 6,
                      }}
                    >
                      {related.map((item, index) => (
                        <TouchableOpacity
                          style={styles.relatedBtn}
                          onPress={() => onPressQoAP(item)}
                          key={item + index.toString()}
                        >
                          <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
              </View>
            }
          />
        ) : (
          <ActivityIndicator />
        )}
      </MainLayout>
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
            if (chats.length > 0) {
              flatListRef.current?.scrollToIndex({
                index: chats.length - 1,
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
    fontSize: AppFontSizes.small,
    color: AppColors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginHorizontal: 16,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    paddingRight: 12,
    gap: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.primary,
  },
  relatedText: {
    color: AppColors.primary,
    fontFamily: AppFonts.regular,
    fontSize: AppFontSizes.small,
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
