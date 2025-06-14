import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../../store/authStore"; // <--- Thay đổi ở đây

export default function Notifications() {
  const { signOut, user } = useAuthStore();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trang riêng tư</Text>
      <Text>Xin chào, {user?.name}!</Text>
      <Button title="Đăng xuất" onPress={signOut} />
    </View>
  );
}
