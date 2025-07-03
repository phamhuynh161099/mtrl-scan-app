import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
