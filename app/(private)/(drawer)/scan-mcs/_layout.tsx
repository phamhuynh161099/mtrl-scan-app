import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="mcs-detail"
        options={{
          title: "Mcs Detail",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
