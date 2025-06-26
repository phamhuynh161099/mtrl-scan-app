import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="feed"
        options={{
          title: "Bảng tin",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="newspaper" color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
