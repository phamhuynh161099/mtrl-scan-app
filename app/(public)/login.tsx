import { useRouter } from "expo-router";
import React, { useState } from "react"; // Thêm useState
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native"; // Thêm TextInput, StyleSheet, Alert
import { useAuthStore } from "../../store/authStore"; // <--- Thay đổi ở đây

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người dùng và mật khẩu.");
      return;
    }

    console.log("start");
    try {
      // const res = await authApiRequest.sLogin({ username, password });
      // console.log("res", res);
      // console.log("Đăng nhập với:", { username, password });
      signIn(); // Gọi hàm signIn từ store
    } catch (error) {
      console.error("error", error);
      Alert.alert("Lỗi", "Tên người dùng hoặc mật khẩu không đúng.");
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
        <Button title="Đăng nhập" onPress={handleLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Force go to private (Dev)"
          onPress={() => {
            router.push("/(private)/(drawer)/(tabs)");
          }}
        />
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
