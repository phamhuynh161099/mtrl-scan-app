import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ScanCodeModal from "~/components/(components)/borrow-return-management/modal/scan-code.modal";
import { Button } from "~/components/ui/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import mcsApiRequest from "~/apis/mcs.api";
import { classifyTypeBarcode } from "~/utils/utils";
import materialApiRequest from "~/apis/material.api";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const cameraHeight = screenHeight * 0.8; //* 60 độ cao của màn hình
const operatorHeight = screenHeight * 0.3;

const BorrowTab = () => {
  const [isOpenScanModal, setIsOpenScanModal] = useState<boolean>(false);
  const onClickHandleCloseScanModal = () => {
    setIsOpenScanModal(false);
  };

  const [mtrlCode, setMtrlCode] = useState<any>();
  const [mtrlInfo, setMtrlInfo] = useState<any>();
  const [kindMtrl, setKindMtrl] = useState<string>('')

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState({
    empNo: "",
    name: "",
    phone: "",
    email: "",
    department: "",
    returnETC: "",
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      empNo: "",
      name: "",
      phone: "",
      email: "",
      department: "",
      returnETC: "",
    });
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);

    // Format date as mm/dd/yyyy
    const formattedDate = moment(currentDate).format("MM/DD/YYYY");
    handleInputChange("returnETC", formattedDate);
  };

  const onClickAcceptCode = (code: string) => {
    Alert.alert("Scanned Code", `The scanned code is: ${code}`, [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
    setMtrlCode(code);
  };

  useEffect(() => {
    const fetchDataMcs = async () => {
      try {
        let parameter = {
          barcode: mtrlCode,
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

    const fetchDataNotMcs = async () => {
      try {
        let parameter = {
          data: {
            barcode: mtrlCode,
            kind: classifyTypeBarcode(mtrlCode as string),
          },
        };
        const response: any = (await materialApiRequest.sScanInforV2(parameter))
          .payload;
        if (response.etc.data.length > 0) {
          let _result = response.etc.data[0];
          setMtrlInfo(_result);
        } else {
          alert("Not Found");
        }
      } catch (error) {
        console.error("error", error);
      } finally {
      }
    };

    if (mtrlCode) {
      let kindCode = classifyTypeBarcode(mtrlCode);
      setKindMtrl(kindCode);
      if (["Mcs"].includes(kindCode)) {
        fetchDataMcs();
      } else if (
        ["Pantone", "Rubber", "Others", "Material"].includes(kindCode)
      ) {
        fetchDataNotMcs();
      }
    }
  }, [mtrlCode]);

  const onClickAcceptBorrow = () => {};

  return (
    <>
      <ScrollView className="flex-1 p-2">
        <View className="items-end p-4 shadow-md rounded-md bg-white">
          <Button
            className="flex-row items-center justify-center gap-2"
            onPress={() => {
              setIsOpenScanModal(true);
              // setIsScanning(true);
            }}
          >
            <Ionicons name="scan-outline" size={24} color="white" />
            <Text className="text-white font-bold">Scan</Text>
          </Button>
        </View>

        <View className="mt-2 p-4 gap-2 shadow-md rounded-md bg-white">
          <View>
            <Text className="text-gray-500 font-semibold ">Kind</Text>
            <Text className="text-xl font-bold">{kindMtrl}</Text>
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Code</Text>
            <Text className="text-xl font-bold">{mtrlCode}</Text>
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Name</Text>
            <Text className="text-xl font-bold">{mtrlInfo?.supplier_name}</Text>
          </View>
        </View>

        <View className="mt-2 mb-4 p-4 gap-2 shadow-md rounded-md bg-white">
          <View className="border-b border-gray-200/50 pb-2">
            <Text className="text-xl font-bold">Check In Information</Text>
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Employee No.</Text>
            <TextInput
              className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
              placeholder="Enter Employee No."
              value={formData.empNo}
              onChangeText={(text) => handleInputChange("empNo", text)}
            />
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Name</Text>
            <TextInput
              className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
              placeholder="Enter Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Phone</Text>
            <TextInput
              className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
              placeholder="Enter Phone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Email</Text>
            <TextInput
              className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
              placeholder="Enter Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">Department</Text>
            <TextInput
              className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
              placeholder="Enter Department"
              value={formData.department}
              onChangeText={(text) => handleInputChange("department", text)}
            />
          </View>

          <View>
            <Text className="text-gray-500 font-semibold ">ETC Return</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text className="mt-1 p-2 border border-gray-300 rounded-md text-lg">
                {formData.returnETC}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </View>

          <View className="mt-4">
            <Button onPress={onClickAcceptBorrow}>
              <Text className="text-white font-bold text-xl">Accept</Text>
            </Button>
          </View>
        </View>
      </ScrollView>

      {isOpenScanModal && (
        <>
          <ScanCodeModal
            isOpen={isOpenScanModal}
            onClose={onClickHandleCloseScanModal}
            onScanSuccess={(code: string) => onClickAcceptCode(code)}
          />
        </>
      )}
    </>
  );
};

export default BorrowTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalPager: {
    flex: 1,
  },
});

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
