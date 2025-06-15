import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const screenHeight = Dimensions.get("window").height;
const cameraHeight = screenHeight * 0.5;

export default function BarcodeScannerScreen() {
  // --- BƯỚC 1: GỌI TẤT CẢ CÁC HOOK Ở CẤP CAO NHẤT ---
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<{
    type: string;
    value: string;
  } | null>(null);

  // Di chuyển useCodeScanner lên đây, trước tất cả các điều kiện trả về.
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "code-128"],
    onCodeScanned: (codes: any) => {
      if (isScanning && codes.length > 0) {
        console.log(`Scanned ${codes.length} codes!`);
        const code = codes[0];
        setScannedCode(code);
        setIsScanning(false);
      }
    },
  });

  // --- BƯỚC 2: XỬ LÝ CÁC HOOK PHỤ THUỘC (NẾU CÓ) ---
  useEffect(() => {
    // Chỉ yêu cầu quyền nếu chưa có.
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // --- BƯỚC 3: CÁC ĐIỀU KIỆN TRẢ VỀ (EARLY RETURNS) ---
  // Bây giờ việc return sớm sẽ không ảnh hưởng đến số lượng hook được gọi.
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

  if (device == null) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-lg text-foreground text-center capitalize">
          Camera Not Found
        </Text>
      </View>
    );
  }

  // --- BƯỚC 4: RENDER GIAO DIỆN CHÍNH ---
  const handleScanAgain = () => {
    setScannedCode(null);
    setIsScanning(true);
  };

  return (
    <View className="flex-1">
      <View className="m-4 p-4 bg-white rounded-md shadow-md min-h-[80px]">
        <Text className="text-base font-bold text-black">Scanned Value:</Text>
        <Text className="text-lg text-blue-600 mt-1">{scannedCode?.value}</Text>
      </View>

      {/* Chỉ hiển thị camera khi đang quét và có thiết bị */}
      {isScanning && (
        <Camera
          style={{ height: cameraHeight, width: "100%" }}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}

      <View className="absolute bottom-12 left-0 right-0 items-center px-6">
        {scannedCode ? (
          <Button
            onPress={handleScanAgain}
            className="w-full max-w-xs bg-green-600"
          >
            <Text>Scan Again</Text>
          </Button>
        ) : (
          <Button
            onPress={() => setIsScanning(!isScanning)}
            className="w-full max-w-xs"
          >
            <Text>{isScanning ? "Stop Scanning" : "Start Scanning"}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
