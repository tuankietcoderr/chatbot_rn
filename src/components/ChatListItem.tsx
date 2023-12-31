import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import AppRoutes from "@/constants/route";
import { useModalContext } from "@/context/ModalContext";
import { useThemeContext } from "@/context/ThemeContext";
import { IRoom } from "@/schema/client/room";
import { resetTrigger } from "@/store/features/room/room-slice";
import { deleteRoomThunk } from "@/store/features/room/room-thunk";
import { useAppDispatch } from "@/store/hook";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import UpdateRoomModal from "./UpdateRoomModal";
import { getSavesThunk } from "@/store/features/save/save-thunk";
import useAlert from "@/hooks/useAlert";
import { getAnswer } from "@/bot/bot-service";

const ChatListItem = (room: IRoom) => {
  const { _id, title, shortDescription, index } = room;
  const navigation = useNavigation<any>();
  const { onModalOpen } = useModalContext();
  const dispatch = useAppDispatch();
  const onPressItem = () => {
    navigation.navigate(AppRoutes.MAIN, { roomId: _id, index });
  };

  const onPressEdit = () => {
    onModalOpen();
  };

  const onPressDelete = () => {
    Alert.alert(
      "Bạn chắc chứ?",
      "Xóa phòng sẽ xóa tất cả hội thoại trong phòng",
      [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteRoom();
          },
        },
      ]
    );
  };

  const [deleting, setDeleting] = useState(false);
  const _alert = useAlert();

  const deleteRoom = async () => {
    setDeleting(true);
    dispatch(deleteRoomThunk(_id!))
      .then(async (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            Toast.show("Xóa phòng thành công", {
              position: Toast.positions.CENTER,
            });
            dispatch(resetTrigger());
            dispatch(getSavesThunk());
            await getAnswer({
              roomId: _id!,
              dead: true,
            });
          } else {
            _alert.show("Xóa phòng thất bại");
          }
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          opacity: deleting ? 0.5 : 1,
          backgroundColor: isDarkTheme
            ? AppColors.darkMode.white
            : AppColors.white,
          borderWidth: isDarkTheme ? 0 : StyleSheet.hairlineWidth,
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
        <Text
          style={[
            styles.title,
            {
              color: isDarkTheme ? AppColors.darkMode.black : AppColors.black,
            },
          ]}
        >
          {deleting ? "Đang xóa..." : title}
        </Text>
        {shortDescription && (
          <Text style={styles.text} numberOfLines={2}>
            {shortDescription}
          </Text>
        )}
      </View>
      <View style={styles.toolbarContainer}>
        <TouchableOpacity onPress={onPressDelete} style={styles.iconBtn}>
          <Ionicons
            name="trash-outline"
            size={24}
            color={isDarkTheme ? AppColors.darkMode.primary : AppColors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressEdit} style={styles.iconBtn}>
          <AntDesign
            name="edit"
            size={24}
            color={isDarkTheme ? AppColors.darkMode.black : AppColors.black}
          />
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
