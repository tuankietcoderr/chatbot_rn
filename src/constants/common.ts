import { Dimensions } from "react-native";

export const AppCommon = {
  IS_FIRST_TIME: "IS_FIRST_TIME",
  ACCESS_TOKEN: "ACCESS_TOKEN",
  SCREEN_WIDTH: Dimensions.get("window").width,
  SCREEN_HEIGHT: Dimensions.get("window").height,
  MAX_TIME_TO_LIVE: 60 * 60 * 30, // 30 minutes
  EMAIL_REGEX: new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
  ),
  PASSWORD_REGEX: new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  ),
  USERNAME_REGEX: new RegExp(/^[a-z0-9_]{5,}[a-z]+[0-9]*$/),
};
