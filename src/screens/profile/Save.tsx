import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import AppFonts from "@/constants/font";
import { FlatList } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectSave } from "@/store/features/save/save-selector";
import { ModalProvider } from "@/context/ModalContext";
import SavedItem from "@/components/SavedItem";
import { randomUUID } from "@/lib/random";
import Empty from "@/components/Empty";
import { getSavesThunk } from "@/store/features/save/save-thunk";
import MainLayout from "@/layout/MainLayout";

const Save = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Saved",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: AppFonts.semiBold,
      },
    });
  }, []);

  const { saves } = useAppSelector(selectSave);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const onRefresh = async () => {
    dispatch(getSavesThunk()).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <MainLayout>
      <FlatList
        data={saves}
        renderItem={({ item }) => (
          <ModalProvider>
            <SavedItem {...item} />
          </ModalProvider>
        )}
        ListEmptyComponent={<Empty content="Nothing here" />}
        keyExtractor={(item) => item?._id || randomUUID()}
        contentContainerStyle={{ marginTop: 16, rowGap: 8 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </MainLayout>
  );
};

export default Save;

const styles = StyleSheet.create({});
