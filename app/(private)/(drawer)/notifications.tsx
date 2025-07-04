import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../../store/authStore";

export default function Notifications() {
  const { signOut, user } = useAuthStore();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trang riêng tư</Text>
      <Text>Xin chào, {user?.name}!</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
