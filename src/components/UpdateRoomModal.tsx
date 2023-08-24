import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import MyModal from "./MyModal";
import MyTextInput from "./MyTextInput";
import { IRoom } from "@/schema/client/room";
import AppColors from "@/constants/color";
import { useModalContext } from "@/context/ModalContext";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { useAppDispatch } from "@/store/hook";
import { modifyRoomInfoThunk } from "@/store/features/room/room-thunk";
import Toast from "react-native-root-toast";

const UpdateRoomModal = (room: IRoom) => {
  const { isVisible, onModalClose } = useModalContext();
  const [editForm, setEditForm] = React.useState<IRoom>(room);

  const onInputChange = (text: string, name: keyof IRoom) => {
    setEditForm({
      ...editForm,
      [name]: text,
    });
  };
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const onPressSubmit = async () => {
    setIsLoading(true);
    dispatch(modifyRoomInfoThunk(editForm))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            Toast.show("Update room successfully", {
              position: Toast.positions.CENTER,
            });
            onModalClose();
          } else {
            alert("Update room failed");
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <MyModal
      isVisible={isVisible}
      onClose={onModalClose}
      title="Edit room information"
      containerStyle={{
        height: "60%",
      }}
    >
      <View>
        <MyTextInput
          label="Title"
          placeholder="Enter new title"
          value={editForm.title}
          onChangeText={(text) => onInputChange(text, "title")}
          containerStyle={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: AppColors.gray,
          }}
        />
        <MyTextInput
          label="Short description"
          placeholder="Enter new short description"
          value={editForm.shortDescription}
          onChangeText={(text) => onInputChange(text, "shortDescription")}
          containerStyle={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: AppColors.gray,
          }}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.editBtn,
            {
              opacity: isLoading ? 0.5 : 1,
            },
          ]}
          disabled={isLoading}
          onPress={onPressSubmit}
        >
          {isLoading && <ActivityIndicator color={AppColors.white} />}
          <Text style={styles.editBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </MyModal>
  );
};

export default UpdateRoomModal;

const styles = StyleSheet.create({
  signupText: {
    fontFamily: AppFonts.regular,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
    color: AppColors.primary,
  },
  editBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  editBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
