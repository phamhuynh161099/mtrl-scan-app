import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image, Linking, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "~/store/authStore";

const GITHUB_AVATAR_URI =
  "https://static.wikia.nocookie.net/lookism/images/e/e9/Seongji_Yook.jpeg/revision/latest/scale-to-width-down/1000?cb=20240105100557";

export default function CustomDrawerContent(props: any) {
  const router = useRoute();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <>
      <ScrollView className="flex-1">
        <View
          className="items-center p-2 bg-[#dde3fe]"
          style={{
            paddingTop: top + 8,
          }}
        >
          <Image
            source={{ uri: GITHUB_AVATAR_URI }}
            className="w-[100px] h-[100px] rounded-full"
          />
          <Text>Sakata</Text>
        </View>

        <DrawerContentScrollView
          {...props}
          scrollEnabled={false}
          contentContainerStyle={{
            paddingTop: top,
            padding: `0!important`,
          }}
        >
          <View className="bg-white pt-[20px]">
            <DrawerItemList {...props} />
            <DrawerItem
              label="Help"
              onPress={() =>
                Linking.openURL("https://reactnative.dev/docs/modal")
              }
              icon={({ color, size }) => (
                <Entypo name="info" size={size} color={color} />
              )}
            />

            <DrawerItem
              label="Logout"
              onPress={() =>
                useAuthStore.getState().signOut()
              }
              icon={({ color, size }) => (
                <Entypo name="log-out" size={size} color={color} />
              )}
            />
          </View>
        </DrawerContentScrollView>

        <View
          style={{
            borderTopColor: "#dde3fe",
            borderTopWidth: 1,
            padding: 20,
            paddingBottom: bottom + 20,
          }}
        >
          <Text>Footer</Text>
        </View>
      </ScrollView>
    </>
  );
}
