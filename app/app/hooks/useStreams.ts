import { useState, useEffect } from "react";
import axios from "axios";
import { useRefreshStore } from "@/app/store/atoms";

// Define the structure of a Stream
interface Stream {
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
}

interface UpvotedSong {
  id: string;
  streamId: string;
}

// Define the hook's return type
interface UseStreamsReturn {
  streams: Stream[];
  upVotedSongs: UpvotedSong[];
  loading: boolean;
  error: string | null;
}

export default function useStreams(
  roomId: string,
  userId: string
): UseStreamsReturn {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [upVotedSongs, setUpVotedSongs] = useState<UpvotedSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshKey = useRefreshStore((state) => state.refreshKey);

  useEffect(() => {
    if (!userId || !roomId) return;

    const fetchStreams = async () => {
      setLoading(true);
      setError(null);

      try {
        const [streamsRes, upVotedRes] = await Promise.all([
          axios.get<{ streams: Stream[] }>("/api/streams", {
            params: { roomId },
          }),
          axios.get<{ upVoted: UpvotedSong[] }>("/api/streams/upvoted-songs", {
            params: { creatorId: userId, roomId },
          }),
        ]);

        if (streamsRes.status === 200) {
          const sortedStreams = streamsRes.data.streams.sort(
            (a, b) => b.upvotes - a.upvotes
          );
          setStreams(sortedStreams);
        }

        if (upVotedRes.status === 200) {
          setUpVotedSongs(upVotedRes.data.upVoted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    // ✅ Immediate fetch
    fetchStreams();

    // ✅ Poll every 5s
    const interval = setInterval(fetchStreams, 5000);

    return () => clearInterval(interval);
  }, [userId, roomId, refreshKey]); // ✅ Added roomId

  return { streams, upVotedSongs, loading, error };
}
