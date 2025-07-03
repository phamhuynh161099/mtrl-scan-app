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
        drawerHideStatusBarOnOpen: false, // Ẩn thanh trạng thái khi mở drawer
        drawerActiveBackgroundColor: "#5363df",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="useful-image-func/(tabs)"
        options={{
          drawerLabel: "Useful Image Function",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="image" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="scan-mcs"
        options={{
          drawerLabel: "Mcs Info",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="scan-mtrl"
        options={{
          drawerLabel: "Material Info",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="borrow-return-management"
        options={{
          drawerLabel: "Borrow/Return Management",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="browsers" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="rfid-rfc-reader"
        options={{
          drawerLabel: "RFID/RFC Reader",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
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

      <Drawer.Screen
        name="useful-upload-file"
        options={{
          drawerLabel: "Useful Upload File",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="my-account"
        options={{
          drawerLabel: "My Account",
          title: "",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
