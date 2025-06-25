import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ZUSTANT_KEY } from "~/constants/localStorage.const";

// Định nghĩa interface cho state
interface IAuthState {
  isLoading: boolean;
  user: { name: string; email?: string } | null; // Có thể thêm các trường khác cho user
  signIn: (userData: { name: string; email?: string }) => void;
  signOut: () => void;
  setInitialLoadComplete: () => void;
}

// Tạo store bằng hàm create() và bọc trong middleware persist()
export const useAuthStore = create(
  persist<IAuthState>(
    // Hàm đầu tiên của persist là hàm định nghĩa store của bạn (giống như trước đây)
    (set) => ({
      // State mặc định
      user: null,
      isLoading: true,

      // Actions (các hàm để thay đổi state)
      signIn: (userData) => {
        console.log("Đăng nhập và lưu vào AsyncStorage", userData);
        set({ user: userData, isLoading: false });
      },

      signOut: () => {
        console.log("Đăng xuất và xóa khỏi AsyncStorage");
        set({ user: null, isLoading: false });
      },

      setInitialLoadComplete: () => {
        console.log(
          "Initial auth load/rehydration complete. Setting isLoading to false."
        );
        set({ isLoading: false });
      },
    }),

    // Hàm thứ hai của persist là một object cấu hình
    {
      name: ZUSTANT_KEY.AUTH_STORE.AUTH_STORAGE,
      storage: createJSONStorage(() => AsyncStorage), // Chỉ định nơi lưu trữ, ở đây là AsyncStorage
      partialize: (state) => ({ user: state.user } as any),
      onRehydrateStorage: (state) => {
        // Tùy chọn: hữu ích để debug
        console.log("Zustand auth store rehydrated by persist:", state);
      },
    }
  )
);
