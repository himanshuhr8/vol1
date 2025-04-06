import { create } from "zustand";

interface Song {
  id: string;
  userId: string;
  title: string;
  type: string;
  smallImg: string;
  bigImg: string;
  extractedId: string;
  upvotes: number;
  isPlayed: boolean;
  roomId: string;
  user: {
    name: string;
  };
  room: {
    ownerId: string;
  };
}

interface StoreState {
  currentlyPlaying: Song | null;
  setCurrentlyPlaying: (song: Song | null) => void;
}

export const useMusicStore = create<StoreState>((set) => ({
  currentlyPlaying: null,
  setCurrentlyPlaying: (song) => set({ currentlyPlaying: song }),
}));
