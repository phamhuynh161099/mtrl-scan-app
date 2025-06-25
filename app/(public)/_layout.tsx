import { Slot } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const PublicLayout = () => {
  // Renamed component for clarity
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

export default PublicLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
