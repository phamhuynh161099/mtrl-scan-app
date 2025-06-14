import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const feed = () => {
  const router = useRouter();
  const onClickPressMe = () => {
    //@ts-ignore
    router.push("(private)/(drawer)/notifications");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Pressable style={styles.button} onTouchStart={() => onClickPressMe()}>
        <Text>Press Me</Text>
      </Pressable>
    </View>
  );
};

export default feed;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
  },
});
