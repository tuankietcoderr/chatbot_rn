import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { IRoom } from "@/schema/client/room";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import AppRoutes from "@/constants/route";
import MyModal from "./MyModal";
import MyTextInput from "./MyTextInput";
import { useModalContext } from "@/context/ModalContext";
import UpdateRoomModal from "./UpdateRoomModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  createRoomThunk,
  deleteRoomThunk,
} from "@/store/features/room/room-thunk";
import { selectRoom } from "@/store/features/room/room-selector";
import Toast from "react-native-root-toast";

const ChatListItem = (room: IRoom) => {
  const { _id, title, shortDescription } = room;
  const navigation = useNavigation<any>();
  const { onModalOpen } = useModalContext();
  const dispatch = useAppDispatch();

  const onPressItem = () => {
    navigation.navigate(AppRoutes.MAIN, { roomId: _id });
  };

  const onPressEdit = () => {
    onModalOpen();
  };

  const onPressDelete = () => {
    Alert.alert("Are you sure?", "Delete room will delete all messages", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await deleteRoom();
        },
      },
    ]);
  };

  const [deleting, setDeleting] = useState(false);

  const deleteRoom = async () => {
    setDeleting(true);
    dispatch(deleteRoomThunk(_id!))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            Toast.show(res.payload.message, {
              position: Toast.positions.CENTER,
            });
          } else {
            alert("Delete room failed");
          }
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          opacity: deleting ? 0.5 : 1,
        },
      ]}
      onPress={onPressItem}
      disabled={deleting}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={styles.title}>{deleting ? "Deleting..." : title}</Text>
        {shortDescription && (
          <Text style={styles.text} numberOfLines={2}>
            {shortDescription}
          </Text>
        )}
      </View>
      <View style={styles.toolbarContainer}>
        <TouchableOpacity onPress={onPressDelete} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressEdit} style={styles.iconBtn}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <UpdateRoomModal {...room} />
    </TouchableOpacity>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.gray,
  },
  title: {
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
  },
  text: {
    fontFamily: AppFonts.regular,
    fontSize: AppFontSizes.small,
    color: AppColors.gray,
  },
  toolbarContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconBtn: {
    zIndex: 9,
  },
});
