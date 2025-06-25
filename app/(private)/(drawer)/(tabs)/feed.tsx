import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import materialApiRequest from "~/apis/material.api";
import CardInfomMaterial from "../../../../components/(components)/card-info-material";

const feed = () => {
  const router = useRouter();
  const onClickPressMe = () => {
    //@ts-ignore
    router.push("(private)/(drawer)/notifications");
  };

  const [dataMtrl, setDataMtrl] = useState<any[]>([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const parameter = {
          data: {
            status: "using",
            season: "All",
            remark: "All",
          },
        };
        const response = await materialApiRequest.sGetMaterial(parameter);
        setDataMtrl(response.payload.data);
      };

      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Tạo một mảng giả để render 10 phần tử
  const cardItems = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Card Title ${i + 1}`,
    description: `Card Description ${i + 1}`,
    content: `Card Content for item ${i + 1}`,
    footer: `Card Footer ${i + 1}`,
  }));

  return (
    <>
      {/* <ScrollView className="flex-1 p-2">
        <View className="gap-y-4">
          {dataMtrl.map((item, indx: number) => (
            <CardInfomMaterial key={indx} data={item} />
          ))}
        </View>
      </ScrollView> */}

      <FlatList
        className="p-2"
        data={dataMtrl}
        renderItem={({ item }) => <CardInfomMaterial data={item} />}
        keyExtractor={(item) => item.material_code}
      />
    </>
  );
};

export default feed;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
  },
});
