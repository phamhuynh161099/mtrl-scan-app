import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { IMCSDetail } from "~/types/mcs-detail.type";

const McsDetailStack = () => {
  const route = useRoute();
  const dataPrams = route.params;
  const [mcsInfo, setMcsInfor] = useState<IMCSDetail>();

  useEffect(() => {
    if (dataPrams) {
      setMcsInfor(dataPrams as any);
    }
  }, [dataPrams]);

  return (

    /** Tôi muốn drawer ở đây  */
    <View className="flex-1">
      <Text>McsDetailStack</Text>
    </View>
  );
};

export default McsDetailStack;

const styles = StyleSheet.create({});
