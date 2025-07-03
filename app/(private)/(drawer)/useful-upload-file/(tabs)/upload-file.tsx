import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "~/components/ui/button";

const UploadImageTab = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Chấp nhận tất cả loại file
        copyToCacheDirectory: true,
        multiple: false, // Chỉ chọn 1 file
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        console.log("File đã chọn:", result.assets[0]);
      }
    } catch (error) {
      console.error("Lỗi khi chọn file:", error);
      Alert.alert("Lỗi", "Không thể chọn file");
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert("Thông báo", "Vui lòng chọn file trước");
      return;
    }

    const formData = new FormData();
    //@ts-ignore
    formData.append("file", {
      uri: selectedFile.uri,
      type: selectedFile.mimeType,
      name: selectedFile.name,
    });

    try {
      const response = await fetch("YOUR_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        Alert.alert("Thành công", "File đã được upload");
      } else {
        Alert.alert("Lỗi", "Upload file thất bại");
      }
    } catch (error) {
      console.error("Lỗi upload:", error);
      Alert.alert("Lỗi", "Không thể upload file");
    }
  };

  return (
    <View className="p-5">
      <Button onPress={pickDocument}>
        <Text className="text-white font-bold">Chọn File</Text>
      </Button>

      {selectedFile && (
        <View style={{ marginTop: 20 }}>
          <Text>File đã chọn: {selectedFile.name}</Text>
          <Text>Kích thước: {selectedFile.size} bytes</Text>
          <Text>Loại: {selectedFile.mimeType}</Text>
        </View>
      )}

      <Button onPress={uploadFile} disabled={!selectedFile}>
        <Text className="text-white font-bold">Upload File</Text>
      </Button>
    </View>
  );
};

export default UploadImageTab;
