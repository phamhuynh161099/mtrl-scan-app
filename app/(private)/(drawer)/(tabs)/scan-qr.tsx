import React, { useEffect, useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const screenHeight = Dimensions.get("window").height;
const cameraHeight = screenHeight * 0.5; // 50% chiều cao màn hình

export default function BarcodeScannerScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [isScanning, setIsScanning] = useState(true);

  //* State quản lý mã code được scan
  const [scannedCode, setScannedCode] = useState<{
    type: string;
    value: string;
  } | null>(null);

  // Tự động yêu cầu quyền khi component mount nếu chưa có
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-lg text-foreground text-center mb-4 capitalize">
          This app need camera permission to work!
        </Text>
        <Button onPress={requestPermission}>
          <Text className="capitalize">Request Permission Camera</Text>
        </Button>
      </View>
    );
  }

  if (device == null) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-lg text-foreground text-center capitalize">
          Not Found Camera
        </Text>
      </View>
    );
  }

  const toggleScan = () => {
    setIsScanning(!isScanning);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "code-128"],
    onCodeScanned: (codes: any) => {
      if (codes.length > 0) {
        setScannedCode(codes[0]);
      }
    },
  });

  return (
    <View className="flex-1">
      <View className="mx-2 p-2 bg-white rounded-md shadow-md">
        <Text className="text-black">{scannedCode?.value}</Text>
      </View>

      <Camera
        style={{ height: cameraHeight, width: "100%" }}
        device={device}
        isActive={isScanning}
        codeScanner={codeScanner}
      />
      <View className="absolute bottom-12 left-0 right-0 items-center px-6">
        <Button onPress={toggleScan} className="w-full max-w-xs">
          <Text>{isScanning ? "Turn On" : "Turn Off"}</Text>
        </Button>
      </View>
    </View>
  );
}

// Nếu không còn style nào khác được định nghĩa trong StyleSheet, bạn có thể xóa bỏ phần này
// và cả import StyleSheet nếu không dùng ở đâu khác trong file.
// Tuy nhiên, nếu có kế hoạch thêm style khác bằng StyleSheet, bạn có thể giữ lại cấu trúc:
// const styles = StyleSheet.create({});
