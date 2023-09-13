import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import React, { PropsWithChildren } from "react";

type Props = {
  visible: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
};

const Overlay = ({ children, visible, style }: Props) => {
  return visible ? (
    <View style={[styles.overlay, style]}>{children}</View>
  ) : null;
};

export default Overlay;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    flex: 1,
    justifyContent: "center",
  },
});
