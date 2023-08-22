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
import React, { useEffect } from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";

const MainChat = ({ navigation }: NativeStackScreenProps<any>) => {
  const HeaderRight = () => {
    const onPress = () => {
      navigation.navigate(AppRoutes.CHATS);
    };
    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("@assets/icons/chat_list.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerRight: () => <HeaderRight />,
      headerShadowVisible: false,
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("@assets/logo/logo_4x.png")}
            style={{
              width: 40,
              height: 40,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: AppFonts.bold,
              fontSize: AppFontSizes.h4,
              color: AppColors.primary,
            }}
          >
            Chatbot
          </Text>
        </View>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.bold,
        fontSize: AppFontSizes.h4,
      },
    });
  }, []);
  const test: IChatItem = {
    id: "1",
    roomId: "1",
    content: "Hi, you can ask me anything.",
    isBotChat: true,
  };

  const example_response: IAnswer = {
    id: "1",
    answer: "test",
    ref: {
      link: "https://www.google.com",
      title: "Google",
    },
    relatedQ: ["Test1", "Test2", "Test3", "Test4"],
    relatedTthc: ["Test1", "Test2", "Test3", "Test4"],
  };

  const [message, setMessage] = React.useState<string>("");
  const [disableChat, setDisableChat] = React.useState<boolean>(false);
  const { chosenRelated, related, setRelated, setChosenRelated } =
    useBotDataContext();
  const flatListRef = React.useRef<FlatList>(null);

  const onInputChange = (text: string) => {
    setMessage(text);
  };

  const onPressSend = async (_message: string) => {
    if (_message.length === 0) return;
    setMessage("");
    setChats((prev) => {
      return [
        ...prev,
        {
          id: prev[prev.length - 1].id + 1 + "",
          roomId: "1",
          content: _message,
          isBotChat: false,
        },
      ];
    });
    setDisableChat(true);
    setTimeout(() => {
      onResponse();
      setDisableChat(false);
    }, 3000);
  };

  const onResponse = async () => {
    setChats((prev) => {
      return [
        ...prev,
        {
          id: prev[prev.length - 1].id + 1 + "",
          roomId: "1",
          content: example_response.answer,
          isBotChat: true,
        },
      ];
    });
    setChosenRelated("all");
  };

  const [chats, setChats] = React.useState<IChatItem[]>([test]);

  useEffect(() => {
    if (chats.length > 0) {
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
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() => {
            flatListRef.current && flatListRef.current?.scrollToEnd();
          }}
          data={chats}
          renderItem={({ item }) => <ChatItem chat={item} />}
          contentContainerStyle={{
            gap: 10,
            marginTop: 10,
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View
              style={{
                marginBottom: 40,
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
              {chats[chats.length - 1].isBotChat && chats.length > 1 && (
                <Text
                  style={{
                    fontFamily: AppFonts.regular,
                    padding: 10,
                    backgroundColor: AppColors.onPrimary,
                    alignSelf: "flex-start",
                    borderRadius: 8,
                    maxWidth: width * 0.7,
                    marginBottom: 10,
                  }}
                >
                  Reference:{" "}
                  <Text
                    onPress={() => {
                      Linking.openURL(example_response.ref.link).catch((err) =>
                        console.error("Couldn't load page", err)
                      );
                    }}
                    style={{
                      color: AppColors.primary,
                      textDecorationColor: AppColors.primary,
                      textDecorationLine: "underline",
                    }}
                  >
                    {example_response.ref.title}
                  </Text>
                </Text>
              )}
              {chats[chats.length - 1].isBotChat && chosenRelated === "all" && (
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
                    <Text style={styles.relatedText}>Related questions</Text>
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
              {chats[chats.length - 1].isBotChat &&
                chosenRelated !== "all" &&
                chosenRelated !== null && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      maxWidth: width * 0.7,
                      gap: 10,
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
      </MainLayout>
      {disableChat && (
        <TouchableOpacity style={styles.stopBtn} onPress={onPressStop}>
          <Ionicons name="stop-outline" size={24} color="black" />
          <Text style={styles.text}>Stop generating</Text>
        </TouchableOpacity>
      )}
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
            flatListRef.current?.scrollToIndex({
              index: chats.length - 1,
            });
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
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
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
