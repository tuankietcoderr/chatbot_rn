import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import { FlatList } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectSave } from "@/store/features/save/save-selector";
import SavedItem from "@/components/SavedItem";
import { randomUUID } from "@/lib/random";
import Empty from "@/components/Empty";
import { getSavesThunk } from "@/store/features/save/save-thunk";
import { State } from "@/constants/state";
import { ActivityIndicator } from "react-native";

const Save = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đã lưu",
      headerTitleAlign: "center",
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color={tintColor} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
    });
  }, []);

  const { saves, status } = useAppSelector(selectSave);
  const isLoading = status === State.LOADING;
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const onRefresh = async () => {
    dispatch(getSavesThunk()).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {!isLoading ? (
        <FlatList
          data={saves}
          initialNumToRender={5}
          renderItem={({ item }) => <SavedItem {...item} />}
          ListEmptyComponent={<Empty content="Trống" />}
          keyExtractor={(item) => item?._id || randomUUID()}
          contentContainerStyle={{
            rowGap: 8,
            padding: 16,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </View>
  );
};

export default Save;

const styles = StyleSheet.create({});
