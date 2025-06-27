import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import mcsApiRequest from "~/apis/mcs.api";
import McsDetailCard from "~/components/(components)/scan-mcs/mcs-detail-card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const screenHeight = Dimensions.get("window").height;
const cameraHeight = screenHeight * 0.4;

export default function ScanInforTab() {
  const navigation = useNavigation();

  // --- BƯỚC 1: GỌI TẤT CẢ CÁC HOOK Ở CẤP CAO NHẤT ---
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [isScanning, setIsScanning] = useState(false);
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
      // "itf",
      // "itf-14",
      // "upc-e",
      // "upc-a",
      "qr",
      // "pdf-417",
      // "aztec",
      // "data-matrix",
    ],
    onCodeScanned: (codes: any) => {
      if (isScanning && codes.length > 0) {
        console.log(`Scanned ${codes.length} codes!`);
        const code = codes[0];
        setScannedCode(code);
        setIsScanning(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let parameter = {
          barcode: scannedCode?.value,
        };
        const response: any = (await mcsApiRequest.sSearchByBarcode(parameter))
          .payload;
        if (response.message === "SUCCESS") {
          let _result = response.data[0];
          setMtrlInfo(_result);
        } else {
          alert("Not Found");
        }
      } catch (error) {
        console.error("error", error);
      } finally {
      }
    };

    if (scannedCode?.value) {
      fetchData();
    }
  }, [scannedCode]);

  // --- BƯỚC 2: XỬ LÝ CÁC HOOK PHỤ THUỘC (NẾU CÓ) ---
  useEffect(() => {
    // Chỉ yêu cầu quyền nếu chưa có.
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // --- BƯỚC 3: CÁC ĐIỀU KIỆN TRẢ VỀ (EARLY RETURNS) ---
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
      <View className="flex-1 justify-center items-center bg-background">
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
    <ScrollView className="flex-1 px-2">
      <View className="m-4 p-4 bg-white rounded-md shadow-md min-h-[80px]">
        <Text className="text-base font-bold text-black">Scanned Value:</Text>
        <Text className="text-lg text-blue-600 mt-1">{scannedCode?.value}</Text>
      </View>

      {/* Chỉ hiển thị camera khi đang quét và có thiết bị */}
      {isScanning && (
        <View className="p-4 rounded-md bg-white shadow-md">
          <Camera
            style={{ height: cameraHeight, width: "100%" }}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
        </View>
      )}

      {mtrlInfo && !isScanning && <McsDetailCard data={mtrlInfo} />}

      <View className="mt-2 right-0 items-center px-6">
        {scannedCode ? (
          <Button
            onPress={handleScanAgain}
            className="w-full max-w-xs"
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
        <Button
          onPress={() => {
            router.push("/(private)/(drawer)/scan-mcs/mcs-detail");
          }}
          className="w-full max-w-xs mt-2 hidden"
        >
          <Text>Go to Mcs Detail</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
