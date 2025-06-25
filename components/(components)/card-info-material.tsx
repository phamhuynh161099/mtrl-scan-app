import { View, Text } from "react-native";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export interface ICardInfomMaterialProps {
  data: any;
}

const CardInfomMaterial = ({ data }: ICardInfomMaterialProps) => {
  return (
    <>
      {data && (
        <Card key={data.material_code} className="w-full mb-2">
          <CardHeader>
            <CardTitle>{data.material_code}</CardTitle>
            <CardDescription>{data.material_code}</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>{data.material_code}</Text>
          </CardContent>
          <CardFooter>
            <Text>{data.material_code}</Text>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default CardInfomMaterial;
