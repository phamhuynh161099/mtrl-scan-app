import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { IMCSDetail } from "~/types/mcs-detail.type";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import mcsApiRequest from "~/apis/mcs.api";
import { Indicator } from "@rn-primitives/progress";

const screenHeight = Dimensions.get("window").height;
const cameraHeight = screenHeight * 0.4;

const McsDetailStack = () => {
  const route = useRoute();
  const dataPrams = route.params;
  const [mcsInfo, setMcsInfor] = useState<IMCSDetail>();
  const [mcsImages, setMcsImages] = useState<string[]>([]);

  // useEffect(() => {

  //   console.log('dataPrams', dataPrams)
  //   const fetchImages = async () => {
  //     if (!dataPrams) return;
  //     const mcsData = dataPrams as IMCSDetail;
  //     const imagePromises = Array.from({ length: 6 }, (_, i) => {
  //       const imageIndex = i + 1;
  //       return mcsApiRequest.sGetImage(
  //         mcsData.ARTICLE_NUMBER_A,
  //         mcsData.SEASON_M,
  //         imageIndex
  //       );
  //     });

  //     const results = await Promise.allSettled(imagePromises);
  //     const images = results.map((result, index) => {
  //       if (result.status === "fulfilled") {
  //         // Nếu promise thành công, lấy payload
  //         return result.value.payload;
  //       } else {
  //         // Nếu promise thất bại, ghi log và trả về null
  //         console.error(`Error fetching image ${index + 1}:`, result.reason);
  //         return null;
  //       }
  //     });
  //     setMcsImages(images);
  //   };

  //   if (dataPrams) {
  //     setMcsInfor(dataPrams as any);
  //     // fetchImages();
  //   }
  // }, [dataPrams]);

  return (
    <View className="flex-1">
      {/* Block Swiper 6 Images */}
      <View className="h-[300px] bg-red-300">
        <PagerView style={styles.container} initialPage={0}>
          {mcsImages.length > 0 &&
            mcsImages.map((image, index) => {
              return (
                <View key={index} className="justify-center items-center">
                  {image ? (
                    <Image
                      source={{ uri: image ?? "" }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="contain"
                    />
                  ) : (
                    <Text>No Image</Text>
                  )}
                </View>
              );
            })}

          {mcsImages.length === 0 && (
            <>
              <View>
                <Text>No Image</Text>
              </View>
            </>
          )}
        </PagerView>
      </View>
      {/* Block Swiper 6 Images */}
    </View>
  );
};

export default McsDetailStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
