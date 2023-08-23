import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ISave } from "@/schema/client/save";
import moment from "moment";

const SavedItem = ({ content, _id, createdAt, roomId }: ISave) => {
  return (
    <View>
      <Text>{moment(createdAt).format("DD/MM/YYYY")}</Text>
    </View>
  );
};

export default SavedItem;

const styles = StyleSheet.create({});
