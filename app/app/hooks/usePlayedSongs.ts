import { useState, useEffect } from "react";
import axios from "axios";
import { useRefreshStore } from "@/app/store/atoms";
interface PlayedSong {
  streamId: string;
  title: string;
  addedBy: string;
  smallImg: string;
  userId: string;
  type: string;
}

export const usePlayedSongs = () => {
  const [playedSongs, setPlayedSongs] = useState<PlayedSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const refreshKey = useRefreshStore((state) => state.refreshKey);
  useEffect(() => {
    const fetchPlayedSongs = async () => {
      try {
        const response = await axios.get<{ playedSongs: PlayedSong[] }>(
          "/api/streams/played-songs"
        );
        setPlayedSongs(response.data.playedSongs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayedSongs();
  }, [refreshKey]);

  return { playedSongs, loading, error };
};
