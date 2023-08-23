import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppFonts from "@/constants/font";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import MainLayout from "@/layout/MainLayout";
import AppColors from "@/constants/color";
import NewChatButton from "@/components/NewChatButton";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectRoom } from "@/store/features/room/room-selector";
import ChatListItem from "@/components/ChatListItem";
import { ModalProvider } from "@/context/ModalContext";
import { randomUUID } from "@/lib/random";
import { getRoomsThunk } from "@/store/features/room/room-thunk";
import { State } from "@/constants/state";
import Empty from "@/components/Empty";
import { IRoom } from "@/schema/client/room";
import { MainHeaderRight } from "@/components/MainHeader";

const ChatList = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chats",
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
      headerTitleAlign: navigation.canGoBack() ? "center" : "left",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            display: navigation.canGoBack() ? "flex" : "none",
          }}
        >
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => <MainHeaderRight navigation={navigation} />,
    });
  }, []);

  const { rooms, status } = useAppSelector(selectRoom);
  const isLoading = status === State.LOADING;
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getRoomsThunk()).finally(() => {
      setRefreshing(false);
    });
  };

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
            ListEmptyComponent={<Empty content="Nothing here" />}
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
