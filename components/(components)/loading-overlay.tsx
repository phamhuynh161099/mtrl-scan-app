// components/LoadingOverlay.js
import React from "react";
import { View, ActivityIndicator, Modal, Text } from "react-native";
import { useLoadingStore } from "~/store/loadingStore";

const LoadingOverlay = () => {
  const { isLoading, loadingMessage } = useLoadingStore();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-black/10 bg-opacity-50">
        <View className="bg-white p-6 rounded-lg items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-lg">{loadingMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
