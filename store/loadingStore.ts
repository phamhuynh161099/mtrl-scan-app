import { create } from 'zustand';

export const useLoadingStore = create<any>((set) => ({
  isLoading: false,
  loadingMessage: 'Loading...',
  showLoading: (message = 'Loading...') => 
    set({ isLoading: true, loadingMessage: message }),
  hideLoading: () => set({ isLoading: false }),
}));