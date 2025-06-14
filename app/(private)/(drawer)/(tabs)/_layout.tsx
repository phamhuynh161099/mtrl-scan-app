// app/(drawer)/(tabs)/_layout.js
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn header của Tabs vì đã có header của Drawer
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="index" // trỏ đến file index.js
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed" // trỏ đến file feed.js
        options={{
          title: "Bảng tin",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="newspaper" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting" // trỏ đến file settings.js
        options={{
          title: "Cài đặt",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan-qr" //
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="scan" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
