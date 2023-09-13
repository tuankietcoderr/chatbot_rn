import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import { useModalContext } from "@/context/ModalContext";
import { IRoom } from "@/schema/client/room";
import { modifyRoomInfoThunk } from "@/store/features/room/room-thunk";
import { useAppDispatch } from "@/store/hook";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import MyModal from "./MyModal";
import MyTextInput from "./MyTextInput";
import { useThemeContext } from "@/context/ThemeContext";

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
            Toast.show("Cập nhật phòng thành công", {
              position: Toast.positions.CENTER,
            });
            onModalClose();
          } else {
            alert("Cập nhật phòng thất bại");
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { theme } = useThemeContext();
  const isDarkMode = theme === "dark";

  return (
    <MyModal
      isVisible={isVisible}
      onClose={onModalClose}
      title="Chỉnh sửa thông tin phòng"
      containerStyle={{
        height: "60%",
        backgroundColor: isDarkMode
          ? AppColors.darkMode.white
          : AppColors.white,
      }}
    >
      <View>
        <MyTextInput
          label="Tiêu đề"
          placeholder="Nhập tiêu đề mới"
          value={editForm.title}
          onChangeText={(text) => onInputChange(text, "title")}
          containerStyle={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: AppColors.gray,
          }}
        />
        <MyTextInput
          label="Mô tả ngắn"
          placeholder="Nhập mô tả ngắn"
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
              backgroundColor: isDarkMode
                ? AppColors.darkMode.primary
                : AppColors.primary,
            },
          ]}
          disabled={isLoading}
          onPress={onPressSubmit}
        >
          {isLoading && <ActivityIndicator color={AppColors.white} />}
          <Text
            style={[
              styles.editBtnText,
              {
                color: isDarkMode
                  ? AppColors.darkMode.onPrimary
                  : AppColors.onPrimary,
              },
            ]}
          >
            Lưu
          </Text>
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
