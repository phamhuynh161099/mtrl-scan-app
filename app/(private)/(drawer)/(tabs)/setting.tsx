import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/store/authStore";

const setting = () => {
  const onTouchClear = async () => {
    // Kích hoạt action signOut từ store Zustand
    // Dùng getState() để truy cập store từ bên ngoài component React
    useAuthStore.getState().signOut();
  };

  const navigation =  useNavigation();
  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <View className="flex-1 p-2 gap-2">
      <Button onPress={onTouchClear}>
        <Text className="text-white">Press Me</Text>
      </Button>

      <Button onPress={onToggle}>
        <Text className="text-white">Toggle Drawer</Text>
      </Button>
    </View>
  );
};

export default setting;

const styles = StyleSheet.create({});
