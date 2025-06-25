// Đây là một biến toàn cục được cung cấp bởi Metro bundler của React Native.
// Nó là `true` khi chạy ở chế độ development và `false` cho các bản dựng release.
const isDevelopment = __DEV__;

// Dựa vào môi trường để chọn URL phù hợp
const API_BASE_URL = isDevelopment
  ? "http://192.168.1.10:3000/api/v1"
  : "https://your-production-api.com/api/v1";
const AppConfig = {
  API_BASE_URL,
  IS_DEVELOPMENT: isDevelopment,
};

export default AppConfig;