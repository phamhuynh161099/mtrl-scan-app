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
import { envConfig } from "~/constants/config.const";

export interface IMtrlDetailCardProps {
  data: any;
  classifyKind: string;
}

const MtrlDetailCard = ({ data, classifyKind }: IMtrlDetailCardProps) => {
  const navigation = useNavigation();

  const [previewImage, setPreviewImage] = useState<string>("");
  //   useEffect(() => {
  //     const fetchPreviewImage = async () => {
  //       console.info("run fetchPreviewImage");
  //       try {
  //         const result = (
  //           await mcsApiRequest.sGetImage(data.ARTICLE_NUMBER_A, data.SEASON_M, 1)
  //         ).payload;

  //         setPreviewImage(result);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     fetchPreviewImage();
  //   }, [data]);



  useEffect(() => {
    if (data) {
      console.log('data.material_code_supplier_name',data.material_code_supplier_name)
      setPreviewImage(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}upload/getImageMTRL_Available/${data.material_code_supplier_name}`)
    }
  }, [data]);

  const onPressRedirectMcsStack = () => {
    //@ts-ignore
    navigation.navigate("scan-mtrl", {
      screen: "mtrl-detail",
      params: {
        data: data,
      },
    });
  };

  return (
    <>
      {data && (
        <Card key={data.NO} className="w-full mb-2 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>{data.supplier_name}</CardTitle>
            <CardDescription>{data.toolbox}</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="">
              <View className="p-4 rounded-md shadow-md">
                <Image
                  source={{ uri: previewImage }}
                  className="object-contain"
                  style={{ width: "100%", height: 200 }}
                />
              </View>
              <Text>
                <Text className="font-bold mr-2">Code:</Text>
                {data.material_code_supplier_name}
              </Text>

              <Text>
                <Text className="font-bold mr-2">Kind:</Text>
                {classifyKind}
              </Text>
              
            </View>
          </CardContent>
          <CardFooter>
            <Button
              className="flex flex-row gap-2"
              onPress={onPressRedirectMcsStack}
            >
              <MaterialIcons name="view-in-ar" size={24} color="white" />
              <Text className="text-white font-bold">View Detail</Text>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default MtrlDetailCard;

const styles = StyleSheet.create({});
