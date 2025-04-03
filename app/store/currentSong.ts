import { create } from "zustand";

interface Song {
  id: string;
  extractedId: string;
  title: string;
  url: string;
  source: string;
  bigImg: string;
}

interface StoreState {
  currentlyPlaying: Song | null;
  setCurrentlyPlaying: (song: Song | null) => void;
}

export const useMusicStore = create<StoreState>((set) => ({
  currentlyPlaying: null,
  setCurrentlyPlaying: (song) => set({ currentlyPlaying: song }),
}));
