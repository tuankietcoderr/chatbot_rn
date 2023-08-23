import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ISave } from "@/schema/client/save";
import moment from "moment";
import { useAppDispatch } from "@/store/hook";
import { removeSaveThunk } from "@/store/features/save/save-thunk";
import Toast from "react-native-root-toast";
import { afterRemoveSave } from "@/store/features/chat/chat-slice";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import ReadMore from "@fawazahmed/react-native-read-more";
import MyReadMoreText from "./MyReadMoreText";

const SavedItem = ({ _id, createdAt, roomId, chat }: ISave) => {
  const dispatch = useAppDispatch();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const onPressUnsave = async () => {
    setIsLoadingSave(true);
    dispatch(removeSaveThunk(_id!))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            Toast.show("Unsaved successfully");
            dispatch(afterRemoveSave({ _id: res.payload.data.chat }));
          } else {
            alert(res.payload.message);
          }
        }
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={styles.title}>{moment(createdAt).format("llll")}</Text>
        <MyReadMoreText style={styles.content}>{chat.content}</MyReadMoreText>
      </View>
      <TouchableOpacity
        onPress={onPressUnsave}
        style={{
          opacity: isLoadingSave ? 0.5 : 1,
        }}
        disabled={isLoadingSave}
      >
        <Ionicons name="ios-bookmark" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SavedItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    backgroundColor: AppColors.white,
    borderRadius: 8,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: AppFonts.bold,
  },
  content: {
    fontFamily: AppFonts.regular,
    color: AppColors.black,
  },
});
