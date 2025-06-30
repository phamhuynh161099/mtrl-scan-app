// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
// import {
//   Nfc,
//   Scan,
//   Wifi,
//   WifiOff,
//   AlertCircle,
//   CheckCircle2,
//   Trash2,
//   Eye,
// } from "lucide-react-native";

// const RfidRfcReader = () => {
//   const [hasNfc, setHasNfc] = useState<any>();
//   const [enabled, setEnabled] = useState<any>(false);
//   const [tag, setTag] = useState<any>();
//   const [scanning, setScanning] = useState<any>(false);

//   useEffect(() => {
//     checkNfcSupport();
//     return () => {
//       NfcManager.cancelTechnologyRequest().catch(() => 0);
//     };
//   }, []);

//   const checkNfcSupport = async () => {
//     try {
//       const supported = await NfcManager.isSupported();
//       setHasNfc(supported);

//       if (supported) {
//         await NfcManager.start();
//         const enabled = await NfcManager.isEnabled();
//         setEnabled(enabled);
//       }
//     } catch (ex) {
//       console.warn("NFC check failed:", ex);
//       setHasNfc(false);
//     }
//   };

//   const startNfcScan = async () => {
//     try {
//       setScanning(true);
//       setTag(null);

//       await NfcManager.requestTechnology(NfcTech.Ndef, {
//         alertMessage: "Đưa thiết bị gần thẻ NFC/RFID để đọc...",
//       });

//       const tag = await NfcManager.getTag();
//       console.log("Tag found:", tag);

//       let ndefData = null;
//       if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
//         ndefData = tag.ndefMessage.map((record) => {
//           const payload = record.payload;
//           const text = Ndef.text.decodePayload(payload as any);
//           return {
//             type: record.type,
//             payload: text,
//             id: record.id,
//           };
//         });
//       }

//       setTag({
//         id: tag && tag.id,
//         techTypes: tag && tag.techTypes,
//         type: tag && tag.type,
//         maxSize: tag && tag.maxSize,
//         //@ts-ignore
//         isWritable: tag && tag["isWritable"],
//         ndefMessage: ndefData,
//         rawData: tag && tag,
//       });

//       Alert.alert("Thành công!", "Đã đọc được thẻ NFC/RFID");
//     } catch (ex: any) {
//       console.warn("NFC Scan failed:", ex);
//       Alert.alert("Lỗi", ex.toString());
//     } finally {
//       setScanning(false);
//       NfcManager.cancelTechnologyRequest().catch(() => 0);
//     }
//   };

//   const writeNdefMessage = async (message: any) => {
//     try {
//       setScanning(true);

//       await NfcManager.requestTechnology(NfcTech.Ndef, {
//         alertMessage: "Đưa thiết bị gần thẻ NFC để ghi dữ liệu...",
//       });

//       const bytes = Ndef.encodeMessage([Ndef.textRecord(message)]);

//       if (bytes) {
//         await NfcManager.ndefHandler.writeNdefMessage(bytes);
//         Alert.alert("Thành công!", "Đã ghi dữ liệu vào thẻ");
//       }
//     } catch (ex: any) {
//       console.warn("NFC Write failed:", ex);
//       Alert.alert("Lỗi ghi", ex.toString());
//     } finally {
//       setScanning(false);
//       NfcManager.cancelTechnologyRequest().catch(() => 0);
//     }
//   };

//   const clearTag = () => {
//     setTag(null);
//   };

//   const formatTagData = (data: any) => {
//     if (typeof data === "string") return data;
//     if (Array.isArray(data)) return data.join(", ");
//     if (typeof data === "object") return JSON.stringify(data, null, 2);
//     return String(data);
//   };

//   if (hasNfc === null) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="text-gray-600 mt-4 text-base">
//           Đang kiểm tra hỗ trợ NFC...
//         </Text>
//       </View>
//     );
//   }

//   if (!hasNfc) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <View className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 items-center">
//           <View className="bg-red-100 p-4 rounded-full mb-4">
//             <WifiOff size={32} color="#ef4444" />
//           </View>
//           <Text className="text-red-600 text-lg font-semibold text-center">
//             Thiết bị không hỗ trợ NFC
//           </Text>
//           <Text className="text-gray-500 text-center mt-2">
//             Vui lòng sử dụng thiết bị có hỗ trợ NFC
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   if (!enabled) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <View className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 items-center">
//           <View className="bg-amber-100 p-4 rounded-full mb-4">
//             <AlertCircle size={32} color="#f59e0b" />
//           </View>
//           <Text className="text-amber-600 text-lg font-semibold text-center mb-2">
//             NFC chưa được bật
//           </Text>
//           <Text className="text-gray-500 text-center mb-6">
//             Vui lòng bật NFC trong cài đặt thiết bị
//           </Text>
//           <TouchableOpacity
//             onPress={checkNfcSupport}
//             className="bg-blue-500 px-6 py-3 rounded-xl shadow-md active:bg-blue-600"
//           >
//             <Text className="text-white font-semibold">Kiểm tra lại</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-gradient-to-r from-blue-600 to-purple-600 pt-12 pb-8 px-6">
//         <View className="flex-row items-center justify-center mb-2">
//           <View className="bg-white/20 p-3 rounded-full mr-3">
//             <Nfc size={24} color="white" />
//           </View>
//           <Text className="text-white text-2xl font-bold">NFC Reader</Text>
//         </View>
//         <Text className="text-blue-100 text-center">
//           Quét và đọc thẻ NFC/RFID dễ dàng
//         </Text>
//       </View>

//       <View className="px-6 -mt-4">
//         {/* Action Buttons */}
//         <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
//           <TouchableOpacity
//             onPress={startNfcScan}
//             disabled={scanning}
//             className={`flex-row items-center justify-center py-4 px-6 rounded-xl mb-4 shadow-md ${
//               scanning
//                 ? "bg-gray-400"
//                 : "bg-gradient-to-r from-blue-500 to-blue-600 active:from-blue-600 active:to-blue-700"
//             }`}
//           >
//             {scanning ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Scan size={20} color="white" />
//             )}
//             <Text className="text-white font-semibold text-base ml-2">
//               {scanning ? "Đang quét..." : "Quét NFC/RFID"}
//             </Text>
//           </TouchableOpacity>

//           <View className="flex-row space-x-3">
//             <TouchableOpacity
//               onPress={() => writeNdefMessage("Hello from React Native!")}
//               disabled={scanning}
//               className="flex-1 flex-row items-center justify-center py-3 px-4 bg-green-500 rounded-xl shadow-md active:bg-green-600"
//             >
//               <Wifi size={16} color="white" />
//               <Text className="text-white font-medium ml-2">Ghi thử</Text>
//             </TouchableOpacity>

//             {tag && (
//               <TouchableOpacity
//                 onPress={clearTag}
//                 className="flex-row items-center justify-center py-3 px-4 bg-red-500 rounded-xl shadow-md active:bg-red-600"
//               >
//                 <Trash2 size={16} color="white" />
//                 <Text className="text-white font-medium ml-2">Xóa</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Tag Information */}
//         {tag && (
//           <View className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
//             {/* Header */}
//             <View className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-t-2xl">
//               <View className="flex-row items-center">
//                 <View className="bg-white/20 p-2 rounded-full mr-3">
//                   <CheckCircle2 size={20} color="white" />
//                 </View>
//                 <Text className="text-white text-lg font-bold">
//                   Thông tin thẻ
//                 </Text>
//               </View>
//             </View>

//             {/* Content */}
//             <View className="p-6">
//               {/* Tag ID */}
//               <View className="bg-gray-50 rounded-xl p-4 mb-4">
//                 <Text className="text-gray-500 text-sm font-medium mb-1">
//                   ID Thẻ
//                 </Text>
//                 <Text className="text-gray-900 font-mono text-base">
//                   {tag.id || "Không có"}
//                 </Text>
//               </View>

//               {/* Tag Details Grid */}
//               <View className="space-y-3">
//                 <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//                   <Text className="text-gray-600 font-medium">Loại</Text>
//                   <Text className="text-gray-900 font-semibold">
//                     {tag.type || "Không xác định"}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//                   <Text className="text-gray-600 font-medium">Công nghệ</Text>
//                   <Text className="text-gray-900 font-semibold flex-1 text-right">
//                     {formatTagData(tag.techTypes)}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//                   <Text className="text-gray-600 font-medium">Kích thước</Text>
//                   <Text className="text-gray-900 font-semibold">
//                     {tag.maxSize ? `${tag.maxSize} bytes` : "N/A"}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between items-center py-3">
//                   <Text className="text-gray-600 font-medium">Có thể ghi</Text>
//                   <View
//                     className={`px-3 py-1 rounded-full ${
//                       tag.isWritable ? "bg-green-100" : "bg-red-100"
//                     }`}
//                   >
//                     <Text
//                       className={`text-sm font-semibold ${
//                         tag.isWritable ? "text-green-700" : "text-red-700"
//                       }`}
//                     >
//                       {tag.isWritable ? "Có" : "Không"}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {/* NDEF Data */}
//               {tag.ndefMessage && tag.ndefMessage.length > 0 && (
//                 <View className="mt-6">
//                   <Text className="text-gray-700 font-semibold mb-3">
//                     Dữ liệu NDEF
//                   </Text>
//                   {tag.ndefMessage.map((record: any, index: number) => (
//                     <View
//                       key={index}
//                       className="bg-blue-50 rounded-xl p-4 mb-2"
//                     >
//                       <Text className="text-blue-600 text-sm font-medium mb-1">
//                         Bản ghi {index + 1}
//                       </Text>
//                       <Text className="text-blue-900 font-mono">
//                         {record.payload}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               )}

//               {/* Raw Data Button */}
//               <TouchableOpacity
//                 onPress={() => {
//                   Alert.alert(
//                     "Dữ liệu thô",
//                     JSON.stringify(tag.rawData, null, 2)
//                   );
//                 }}
//                 className="mt-6 flex-row items-center justify-center py-3 px-4 bg-gray-100 rounded-xl active:bg-gray-200"
//               >
//                 <Eye size={16} color="#6b7280" />
//                 <Text className="text-gray-700 font-medium ml-2">
//                   Xem dữ liệu thô
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Status Card */}
//         <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
//           <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center">
//               <View className="bg-green-100 p-2 rounded-full mr-3">
//                 <CheckCircle2 size={20} color="#10b981" />
//               </View>
//               <View>
//                 <Text className="text-gray-900 font-semibold">
//                   NFC Sẵn sàng
//                 </Text>
//                 <Text className="text-gray-500 text-sm">
//                   Đưa thiết bị gần thẻ để quét
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default RfidRfcReader;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RfidRfcReader = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default RfidRfcReader

const styles = StyleSheet.create({})
