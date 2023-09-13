import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import MyModal from "./MyModal";
import { useModalContext } from "@/context/ModalContext";
import { IChatItem } from "@/schema/client/chat-item";
import AppFonts from "@/constants/font";
import AppColors from "@/constants/color";
import { useAppDispatch } from "@/store/hook";
import {
  addSaveThunk,
  removeSaveThunk,
} from "@/store/features/save/save-thunk";
import Toast from "react-native-root-toast";
import * as Clipboard from "expo-clipboard";
import { afterAddSave } from "@/store/features/chat/chat-slice";
import useAlert from "@/hooks/useAlert";

const SavedModal = ({ _id, isSaved, answer }: IChatItem) => {
  const { isVisible, onModalClose } = useModalContext();
  const dispatch = useAppDispatch();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const _alert = useAlert();

  const onPressSave = async () => {
    setIsLoadingSave(true);
    dispatch(addSaveThunk(_id!))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            dispatch(afterAddSave(res.payload.data.chat));
            onModalClose();
            Toast.show("Saved successfully");
          } else {
            _alert.show(res.payload.message);
          }
        }
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  const onCopyToClipboard = async () => {
    await Clipboard.setStringAsync(answer || "")
      .then(() => {
        Toast.show("Copied to clipboard", {
          position: Toast.positions.CENTER,
        });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <MyModal
      title="Action"
      isVisible={isVisible}
      containerStyle={{
        height: "auto",
      }}
      onClose={onModalClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.copyBtn} onPress={onCopyToClipboard}>
          <Text
            style={[
              styles.text,
              {
                color: AppColors.primary,
              },
            ]}
          >
            Copy to clipboard
          </Text>
        </TouchableOpacity>
        {!isSaved && (
          <TouchableOpacity
            style={[
              styles.saveBtn,
              {
                opacity: isLoadingSave ? 0.5 : 1,
              },
            ]}
            onPress={onPressSave}
            disabled={isLoadingSave}
          >
            {!isSaved && isLoadingSave && (
              <ActivityIndicator size={"small"} color={AppColors.onPrimary} />
            )}
            <Text style={styles.text}>
              {isSaved ? "Saved" : "Save"}
              {isLoadingSave ? "..." : ""}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </MyModal>
  );
};

export default SavedModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    marginVertical: 20,
  },
  text: {
    fontFamily: AppFonts.semiBold,
    color: AppColors.onPrimary,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: AppColors.primary,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  copyBtn: {
    backgroundColor: AppColors.white,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
});
