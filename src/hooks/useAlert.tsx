import { Alert } from "react-native";

export default function useAlert() {
  return {
    show: (message: string) =>
      Alert.alert(
        "",
        message,
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      ),
  };
}
