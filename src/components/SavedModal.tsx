import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MyModal from "./MyModal";
import { useModalContext } from "@/context/ModalContext";
import { IChatItem } from "@/schema/client/chat-item";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useAppDispatch } from "@/store/hook";
import { addSaveThunk } from "@/store/features/save/save-thunk";
import Toast from "react-native-root-toast";

const SavedModal = ({ content, roomId }: IChatItem) => {
  const { isVisible, onModalClose } = useModalContext();
  const dispatch = useAppDispatch();

  const onPressSave = async () => {
    dispatch(
      addSaveThunk({
        content,
        roomId,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.success) {
          onModalClose();
          Toast.show("Saved successfully");
        }
      }
    });
  };
  return (
    <MyModal
      title="Save this answer?"
      isVisible={isVisible}
      containerStyle={{
        height: 160,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={onPressSave}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
      </View>
    </MyModal>
  );
};

export default SavedModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontFamily: AppFonts.semiBold,
    color: AppColors.onPrimary,
    textAlign: "center",
  },
  btn: {
    backgroundColor: AppColors.primary,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
  },
});
