// hooks/useRoomDetails.ts
import { useEffect, useState } from "react";

interface RoomDetails {
  roomName: string;
  participantCount: number;
}

export function useRoomDetails(roomId: string | undefined) {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/room/details?roomId=${roomId}`);
        const data = await res.json();

        if (res.ok) {
          setRoomDetails({
            roomName: data.roomName,
            participantCount: data.participantCount,
          });
        } else {
          setError(data.error || "Failed to fetch room details");
        }
      } catch (err) {
        setError("An error occurred while fetching room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  return { roomDetails, loading, error };
}
