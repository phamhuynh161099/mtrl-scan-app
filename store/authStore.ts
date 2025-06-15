// import { create } from "zustand";

// interface IAuthState {
//   user: { name: string } | null;
//   isLoading: boolean;
//   signIn: () => void;
//   signOut: () => void;
//   checkAuthStatus: () => Promise<void>; // Action để kiểm tra trạng thái lúc đầu
// }

// // Tạo store bằng hàm create() của Zustand
// export const useAuthStore = create<IAuthState>((set) => ({
//   // State mặc định
//   user: null,
//   isLoading: true, // Bắt đầu với trạng thái đang tải để kiểm tra auth lần đầu

//   // Actions (các hàm để thay đổi state)
//   signIn: () => {
//     console.log("Đăng nhập với Zustand");
//     set({ user: { name: "Zustand User" }, isLoading: false });
//   },

//   signOut: () => {
//     console.log("Đăng xuất với Zustand");
//     set({ user: null, isLoading: false });
//   },

//   checkAuthStatus: async () => {
//     // Trong thực tế, bạn sẽ kiểm tra AsyncStorage ở đây
//     try {
//       // const userToken = await AsyncStorage.getItem('user_token');
//       // if (userToken) {
//       //   set({ user: { name: 'Logged In User' }, isLoading: false });
//       // } else {
//       //   set({ user: null, isLoading: false });
//       // }

//       // Giả lập việc kiểm tra mất 1 giây
//       setTimeout(() => {
//         console.log("Đã kiểm tra xong trạng thái auth");
//         set({ user: null, isLoading: false });
//       }, 1000);
//     } catch (e) {
//       console.error("Lỗi khi kiểm tra auth status", e);
//       set({ user: null, isLoading: false });
//     }
//   },
// }));

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa interface cho state
// Chúng ta có thể bỏ isLoading và checkAuthStatus vì persist middleware sẽ xử lý việc này
interface IAuthState {
  isLoading: boolean;
  user: { name: string; email?: string } | null; // Có thể thêm các trường khác cho user
  // Action giờ sẽ nhận tham số để linh hoạt hơn
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
      name: "auth-storage", // Tên của key sẽ được lưu trong AsyncStorage. BẮT BUỘC phải có!
      storage: createJSONStorage(() => AsyncStorage), // Chỉ định nơi lưu trữ, ở đây là AsyncStorage
      partialize: (state) => ({ user: state.user } as any),
      onRehydrateStorage: (state) => {
        // Tùy chọn: hữu ích để debug
        console.log("Zustand auth store rehydrated by persist:", state);
      },
    }
  )
);
