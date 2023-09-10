import { Theme } from "@react-navigation/native";

const commonColor = {
  colors: {
    commonWhite: "#FFFFFF",
    commonBlack: "#000000",
  },
};

const light = {
  colors: {
    primary: "#FFF",
    background: "#FFF",
    card: "#FFF",
    text: "#FFF",
    border: "#FFF",
    notification: "#FFF",
  },
} as Theme;

const dark = {
  colors: {
    primary: "#000000",
    background: "#000000",
    card: "#000000",
    text: "#FFFFFF",
    border: "#000000",
    notification: "#000000",
  },
} as Theme;

export default { light, dark };
