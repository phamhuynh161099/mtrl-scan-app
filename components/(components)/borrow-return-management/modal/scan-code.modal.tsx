import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Button } from "~/components/ui/button";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const cameraHeight = screenHeight * 0.8; //* 60 độ cao của màn hình
const operatorHeight = screenHeight * 0.3;

interface IScanCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

const ScanCodeModal = ({
  isOpen,
  onClose,
  onScanSuccess,
}: IScanCodeModalProps) => {
  //--- Khai báo các state liên quan đến camera scan ---
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<{
    type: string;
    value: string;
  } | null>(null);

  const [mtrlInfo, setMtrlInfo] = useState<any>();

  const codeScanner = useCodeScanner({
    codeTypes: [
      "code-128",
      "code-39",
      "code-93",
      "codabar",
      "ean-13",
      "ean-8",
      "qr",
    ],
    onCodeScanned: (codes: any) => {
      if (isScanning && codes.length > 0) {
        console.log(`Scanned ${codes.length} codes!`);
        const code = codes[0];
        setScannedCode(code);
        // setIsScanning(false);
      }
    },
  });

  // --- Yêu cầu quyền ---
  useEffect(() => {
    // Chỉ yêu cầu quyền nếu chưa có.
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // --- Nếu không có quyền ---
  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-lg text-foreground text-center mb-4 capitalize">
          This app needs camera permission to work!
        </Text>
        <Button onPress={requestPermission}>
          <Text className="capitalize">Request Camera Permission</Text>
        </Button>
      </View>
    );
  }

  // --- Nếu không có camera ---
  if (device == null) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-foreground text-center capitalize">
          Camera Not Found
        </Text>
      </View>
    );
  }

  const onClickAcceptCode = () => {
    if (scannedCode?.value) {
      onClose();
      onScanSuccess(scannedCode.value);
    }
  };

  return (
    <>
      {/* Fullscreen Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" backgroundColor="black" />

          {/* Header with close button */}
          <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center p-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-black/80 rounded-full p-3"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Text className="text-white text-lg font-bold">
                Scan Barcode/QrCode
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-black/80 rounded-full p-3"
            >
              <Ionicons name="information" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Pager */}
          <View className="flex-1">
            <View className="">
              {isScanning && (
                <View className="relative">
                  <Camera
                    style={{ height: cameraHeight, width: "100%" }}
                    device={device}
                    isActive={true}
                    codeScanner={codeScanner}
                  />

                  <SimpleCorners
                    size={250}
                    cornerSize={25}
                    cornerWidth={3}
                    cornerColor="#00FF00"
                  />
                </View>
              )}
            </View>

            <View
              className="rounded-t-[25px] bg-white absolute bottom-0 p-4 shadow-md"
              style={{ minHeight: operatorHeight, width: "100%" }}
            >
              <View className="gap-2 justify-center flex-1">
                <View className="rounded-md bg-gray-200/50  p-4">
                  <Text className="text-gray-500 font-semibold ">
                    Scanned Code
                  </Text>
                  <Text className="text-xl font-bold">
                    {scannedCode?.value}
                  </Text>
                </View>

                <Button
                  className="flex justify-center"
                  onPress={() => onClickAcceptCode()}
                >
                  <Text className="text-white capitalize text-xl font-bold">
                    Accept Code.
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ScanCodeModal;

const styles = StyleSheet.create({});

const SimpleCorners = ({
  size = 200,
  cornerSize = 20,
  cornerWidth = 4,
  cornerColor = "#00FF00",
}) => {
  return (
    <View
      className="top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size, position: "absolute" }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: cornerSize,
          height: cornerSize,
          borderLeftWidth: cornerWidth,
          borderTopWidth: cornerWidth,
          borderLeftColor: cornerColor,
          borderTopColor: cornerColor,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: cornerSize,
          height: cornerSize,
          borderRightWidth: cornerWidth,
          borderTopWidth: cornerWidth,
          borderRightColor: cornerColor,
          borderTopColor: cornerColor,
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: cornerSize,
          height: cornerSize,
          borderLeftWidth: cornerWidth,
          borderBottomWidth: cornerWidth,
          borderLeftColor: cornerColor,
          borderBottomColor: cornerColor,
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: cornerSize,
          height: cornerSize,
          borderRightWidth: cornerWidth,
          borderBottomWidth: cornerWidth,
          borderRightColor: cornerColor,
          borderBottomColor: cornerColor,
        }}
      />
    </View>
  );
};
