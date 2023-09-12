import ChatListItem from "@/components/ChatListItem";
import Empty from "@/components/Empty";
import { MainHeaderRight } from "@/components/MainHeader";
import NewChatButton from "@/components/NewChatButton";
import AppFonts from "@/constants/font";
import AppRoutes from "@/constants/route";
import { State } from "@/constants/state";
import { ModalProvider } from "@/context/ModalContext";
import MainLayout from "@/layout/MainLayout";
import { randomUUID } from "@/lib/random";
import { resetChat } from "@/store/features/chat/chat-slice";
import { selectRoom } from "@/store/features/room/room-selector";
import { getRoomsThunk } from "@/store/features/room/room-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { EvilIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ChatList = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Cuộc trò chuyện",
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerTitleAlign: navigation.canGoBack() ? "center" : "left",
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            display: navigation.canGoBack() ? "flex" : "none",
          }}
        >
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerRight: () => <MainHeaderRight navigation={navigation} />,
    });
  }, []);

  const { rooms, status, trigger } = useAppSelector(selectRoom);
  const isLoading = status === State.LOADING;
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getRoomsThunk()).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    if (trigger) {
      if (rooms.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: AppRoutes.CHATS }],
        });
      }
      dispatch(resetChat());
    }
  }, [trigger]);

  return (
    <View style={styles.container}>
      <MainLayout>
        {!isLoading ? (
          <FlatList
            data={rooms}
            renderItem={({ item }) => (
              <ModalProvider>
                <ChatListItem {...item} />
              </ModalProvider>
            )}
            ListEmptyComponent={<Empty content="Trống" />}
            keyExtractor={(item) => item?._id || randomUUID()}
            contentContainerStyle={{ marginTop: 16, rowGap: 8 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </MainLayout>
      <NewChatButton />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: AppFonts.regular,
  },
});
