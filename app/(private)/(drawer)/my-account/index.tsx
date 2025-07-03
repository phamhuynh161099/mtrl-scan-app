import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { Button } from "~/components/ui/button";
import { launchImageLibrary } from "react-native-image-picker";
import userManagementApiRequest from "~/apis/user-management.api";
import { useLoadingStore } from "~/store/loadingStore";

const MyAccountStack = () => {
  const [formInfo, setFormInfo] = useState({
    id: "",
    user_id: "",
    user_name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    create_date: "",
    update_date: "",
    image: "",
    is_active: "",
    is_delete: "",
    delete_by: "",
    password: "",
  });

  const { showLoading, hideLoading } = useLoadingStore();
  const [forceRefectInfo, setForceRefectInfo] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const handleInputChange = (field: any, value: any) => {
    setFormInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        showLoading("Đang tải dữ liệu...");
        let parameter = {
          data: {
            is_delete: false,
          },
        };
        const response: any = (
          await userManagementApiRequest.sListUser(parameter)
        ).payload;

        let userInfo = (response.data as []).filter(
          (item: any) => item.id === 25
        );

        setFormInfo({
          ...(userInfo[0] as any),
          image: ((userInfo[0] as any).image as string).replace(
            "https://mlb.hsvina.com/api",
            "http://10.101.1.135:8280"
          ),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, [forceRefectInfo]);

  const openImageLibrary = () => {
    const options: any = {
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        handleInputChange("image", response.assets[0].uri);
      }
    });
  };

  const onSaveAccount = async () => {
    const formData = new FormData();

    // Thêm các trường thông thường
    formData.append("id", formInfo.id);
    formData.append("user_id", formInfo.user_id);
    formData.append("user_name", formInfo.user_name);
    formData.append("email", formInfo.email);
    formData.append("password", formInfo.password ?? "");
    formData.append("department", formInfo.department);
    formData.append("phone", formInfo.phone);
    formData.append("role", formInfo.role);

    if (selectedImage) {
      formData.append("file", {
        uri: selectedImage.uri,
        type: selectedImage.type || "image/jpeg",
        name: selectedImage.fileName || "image.jpg",
      } as any);
    } else {
    }

    try {
      const response: any = (
        await userManagementApiRequest.sUpdateUser(formData)
      ).payload;

      if (response.message === "SUCCESS") {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
        setForceRefectInfo(!forceRefectInfo);
      } else {
        Alert.alert("Lỗi", response.message || "Cập nhật thông tin thất bại.");
      }
    } catch (error) {
      console.error("error", error);
    } finally {
    }
  };

  return (
    <>
      <ScrollView className="flex-1 p-2">
        <View className="flex-1 rounded-md shadow-md bg-white p-2 mb-10">
          <View className="py-2 bg-white border-b border-gray-100/50">
            <Text className="font-bold text-xl">Information</Text>
          </View>

          <View className="mt-2 gap-2">
            <View>
              <Text className="text-gray-500 font-semibold ">UserId.</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.user_id}
                onChangeText={(text) => handleInputChange("empNo", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Name</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.user_name}
                onChangeText={(text) => handleInputChange("user_name", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Password</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Department</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.department}
                onChangeText={(text) => handleInputChange("department", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Email</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Phone</Text>
              <TextInput
                className="mt-1 p-2 border border-gray-300 rounded-md text-lg"
                placeholder=""
                value={formInfo.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>

            <View>
              <Text className="text-gray-500 font-semibold ">Role</Text>
              <View className="mt-1 border border-gray-300 rounded-md">
                <Picker
                  selectedValue={formInfo.role}
                  onValueChange={(itemValue) =>
                    handleInputChange("role", itemValue)
                  }
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Admin" value="admin" />
                  <Picker.Item label="Manager" value="manager" />
                  <Picker.Item label="User" value="user" />
                </Picker>
              </View>
            </View>

            <View className="gap-2 items-center">
              <Image
                className="rounded-full"
                style={{ width: 100, height: 100 }}
                source={{ uri: formInfo.image, cache: "reload" }}
              />

              <Button className="items-center" onPress={openImageLibrary}>
                <Text className="text-white font-bold">Upload Image</Text>
              </Button>
            </View>

            <View>
              <Button className="" onPress={onSaveAccount}>
                <Text className="text-white font-bold">Save</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MyAccountStack;

const styles = StyleSheet.create({});
