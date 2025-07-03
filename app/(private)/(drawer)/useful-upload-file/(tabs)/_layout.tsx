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
        name="upload-file"
        options={{
          title: "Upload File",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="file-tray" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload-image"
        options={{
          title: "Upload Image",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="image" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
