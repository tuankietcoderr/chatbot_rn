import { Dimensions } from "react-native";

export const AppCommon = {
  IS_FIRST_TIME: "IS_FIRST_TIME",
  ACCESS_TOKEN: "ACCESS_TOKEN",
  SCREEN_WIDTH: Dimensions.get("window").width,
  SCREEN_HEIGHT: Dimensions.get("window").height,
};
