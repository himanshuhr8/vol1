import { useState, useEffect } from "react";
import axios from "axios";
import { useRefreshStore } from "@/store/atoms";

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

export default function useStreams(userId: string): UseStreamsReturn {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [upVotedSongs, setUpVotedSongs] = useState<UpvotedSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshKey = useRefreshStore((state) => state.refreshKey);

  useEffect(() => {
    if (!userId) return;

    const fetchStreams = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch streams and upvoted songs in parallel
        const [streamsRes, upVotedRes] = await Promise.all([
          axios.get<{ streams: Stream[] }>("/api/streams", {
            params: { creatorId: userId },
          }),
          axios.get<{ upVoted: UpvotedSong[] }>("/api/streams/upvoted-songs", {
            params: { creatorId: userId },
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

    fetchStreams();
  }, [userId, refreshKey]); // 🔥 Depend on refreshKey

  return { streams, upVotedSongs, loading, error };
}
