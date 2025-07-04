// app/(drawer)/(tabs)/_layout.js
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // headerShown: false,
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Borrow",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="scan" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "Return/History",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cafe" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
