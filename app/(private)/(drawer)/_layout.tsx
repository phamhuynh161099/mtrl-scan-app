// app/(drawer)/_layout.js
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTintColor: "#000", // Màu của nút back và title
        drawerActiveTintColor: "blue", // Màu của mục đang được chọn trong drawer
      }}
    >
      <Drawer.Screen
        name="(tabs)" // <--- Tên này phải khớp với tên thư mục group của tabs
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="notifications" // <--- Tên này phải khớp với tên file notifications.js
        options={{
          drawerLabel: "Notifications",
          title: "Notifications",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
