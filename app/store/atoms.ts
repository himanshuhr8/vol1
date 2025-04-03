import { create } from "zustand";

// Define the store
interface RefreshStore {
  refreshKey: number;
  incrementKey: () => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshKey: 0, // Initial value
  incrementKey: () => set((state) => ({ refreshKey: state.refreshKey + 1 })), // Function to update
}));
