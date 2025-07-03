import { useRouter } from "expo-router";
import React, { useState } from "react"; // Thêm useState
import { Alert, StyleSheet, Text, TextInput, View } from "react-native"; // Thêm TextInput, StyleSheet, Alert
import { useAuthStore } from "../../store/authStore"; // <--- Thay đổi ở đây
import authApiRequest from "~/apis/auth.api";
import { Button } from "~/components/ui/button";
import { useLoadingStore } from "~/store/loadingStore";

export default function Login() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();
  const { signIn } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người dùng và mật khẩu.");
      return;
    }

    try {
      showLoading("Đang đăng nhập...");
      const response = await authApiRequest.sLogin({ username, password });
      const result = response.payload;
      signIn({ name: result.user_name, email: result.email }); // Gọi hàm signIn từ store
      router.push("/(private)/(drawer)/(tabs)");
    } catch (error) {
      console.error("error", error);
      Alert.alert("Lỗi", "Tên người dùng hoặc mật khẩu không đúng.");
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button onPress={handleLogin}>
          <Text className="text-white font-bold text-xl">Login</Text>
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            signIn({ name: "temp", email: "temp" });
            router.push("/(private)/(drawer)/(tabs)");
          }}
        >
          <Text className="text-white font-bold text-xl">
            Force go to private (-Dev-)
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
});
