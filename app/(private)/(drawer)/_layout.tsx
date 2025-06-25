// app/(drawer)/_layout.js
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "~/components/(components)/CustomerDrawerContent";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: "#000", // Màu của nút back và title
        drawerActiveTintColor: "#fff", // Màu của mục đang được chọn trong drawer
        // headerRight: () => <ThemeToggle />,

        drawerHideStatusBarOnOpen: true, // Ẩn thanh trạng thái khi mở drawer
        drawerActiveBackgroundColor: "#5363df",
      }}
    >
      <Drawer.Screen
        name="(tabs)" // <--- Tên này phải khớp với tên thư mục group của tabs
        options={{
          drawerLabel: "Home",
          title: "Home.",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="notifications"
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
