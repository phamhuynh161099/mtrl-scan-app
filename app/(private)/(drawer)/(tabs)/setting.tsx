import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/store/authStore";

const setting = () => {
  const onTouchClear = async () => {
    // Kích hoạt action signOut từ store Zustand
    // Dùng getState() để truy cập store từ bên ngoài component React
    useAuthStore.getState().signOut();
  };
  return (
    <View className="flex-1 p-2">
      <Button onPress={onTouchClear}>
        <Text className="text-white">Press Me</Text>
      </Button>
    </View>
  );
};

export default setting;

const styles = StyleSheet.create({});
