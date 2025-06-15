import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ActivityIndicator, Appearance, Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useAuthStore } from "~/store/authStore";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

const Guard = () => {
  // Lấy state và actions từ store của Zustand
  const { user, isLoading, setInitialLoadComplete } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1. Chạy kiểm tra trạng thái đăng nhập một lần khi app mở
  React.useEffect(() => {
    setInitialLoadComplete();
  }, [setInitialLoadComplete]);

  // 2. Chạy logic điều hướng mỗi khi user hoặc trạng thái loading thay đổi
  React.useEffect(() => {
    if (isLoading) return; // Nếu đang kiểm tra thì không làm gì cả

    const currentTopLevelSegment = segments[0] ?? "";
    const isInAuthRoute = currentTopLevelSegment === "(private)";
    const isInPublicRoute = currentTopLevelSegment === "(public)";
    if (!user && isInAuthRoute) {
      // Người dùng chưa đăng nhập nhưng đang ở khu vực yêu cầu đăng nhập
      router.replace("/(public)/login");
    } else if (user && isInPublicRoute) {
      // Người dùng đã đăng nhập nhưng đang ở khu vực công khai (screen login)
      router.replace("/(private)/(drawer)/(tabs)");
    } else if (
      user &&
      !isInAuthRoute &&
      !isInPublicRoute &&
      segments.length > 0
    ) {
      router.replace("/(private)/(drawer)/(tabs)");
    }
    SplashScreen.hideAsync();
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(private)" />
      {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
    </Stack>
  );
};

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    // <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
    //   <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
    //   <Guard />
    // </ThemeProvider>
    <Guard />
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
