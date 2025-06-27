import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { IMCSDetail } from "~/types/mcs-detail.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import mcsApiRequest from "~/apis/mcs.api";
import { useNavigation } from "expo-router";

export interface IMcsDetailCardProps {
  data: IMCSDetail;
}

const McsDetailCard = ({ data }: IMcsDetailCardProps) => {
   const navigation = useNavigation();

  const [previewImage, setPreviewImage] = useState<string>("");
  useEffect(() => {
    const fetchPreviewImage = async () => {
      console.info("run fetchPreviewImage");
      try {
        const result = (
          await mcsApiRequest.sGetImage(data.ARTICLE_NUMBER_A, data.SEASON_M, 1)
        ).payload;

        setPreviewImage(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreviewImage();
  }, [data]);

   const onPressRedirectMcsStack = () => {
    //@ts-ignore
    navigation.navigate("scan-mcs", {
      screen: "mcs-detail",
      params: {
        mcsNo: data,
      },
    });
  
  }

  return (
    <>
      {data && (
        <Card key={data.NO} className="w-full mb-2 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>{data.MODEL_NAME_SHORT_M}</CardTitle>
            <CardDescription>{data.NO}</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="">
              <View className="p-4 border rounded-md shadow-md">
                <Image
                source={{ uri: previewImage }}
                className="object-contain"

                 style={{ width: '100%', height: 200 }}
              />
              </View>
              <Text><Text className="font-bold mr-2">Devopment center:</Text>{data.DEVELOPMENT_CENTER}</Text>
            </View>
          </CardContent>
          <CardFooter>
            <Button className="flex flex-row gap-2" onPress={onPressRedirectMcsStack}>
              <MaterialIcons name="view-in-ar" size={24} color="white" />
              <Text className="text-white font-bold">Detail</Text>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default McsDetailCard;

const styles = StyleSheet.create({});
