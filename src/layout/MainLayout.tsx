import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
});
