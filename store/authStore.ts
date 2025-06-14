import { create } from "zustand";

interface IAuthState {
  user: { name: string } | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
  checkAuthStatus: () => Promise<void>; // Action để kiểm tra trạng thái lúc đầu
}

// Tạo store bằng hàm create() của Zustand
export const useAuthStore = create<IAuthState>((set) => ({
  // State mặc định
  user: null,
  isLoading: true, // Bắt đầu với trạng thái đang tải để kiểm tra auth lần đầu

  // Actions (các hàm để thay đổi state)
  signIn: () => {
    console.log("Đăng nhập với Zustand");
    set({ user: { name: "Zustand User" }, isLoading: false });
  },

  signOut: () => {
    console.log("Đăng xuất với Zustand");
    set({ user: null, isLoading: false });
  },

  checkAuthStatus: async () => {
    // Trong thực tế, bạn sẽ kiểm tra AsyncStorage ở đây
    try {
      // const userToken = await AsyncStorage.getItem('user_token');
      // if (userToken) {
      //   set({ user: { name: 'Logged In User' }, isLoading: false });
      // } else {
      //   set({ user: null, isLoading: false });
      // }

      // Giả lập việc kiểm tra mất 1 giây
      setTimeout(() => {
        console.log("Đã kiểm tra xong trạng thái auth");
        set({ user: null, isLoading: false });
      }, 1000);
    } catch (e) {
      console.error("Lỗi khi kiểm tra auth status", e);
      set({ user: null, isLoading: false });
    }
  },
}));
