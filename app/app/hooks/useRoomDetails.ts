import { useEffect, useState } from "react";

interface Participant {
  name: string;
  id: string;
}

interface RoomDetails {
  roomName: string;
  participantCount: number;
  roomOwner: string;
  roomActualId: string;
  participants: Participant[];
}

export function useRoomDetails(roomId: string | undefined) {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoomDetails(null);
      return;
    }

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
            roomOwner: data.roomOwner,
            participants: data.participants || [],
            roomActualId: data.roomActualId,
          });
        } else {
          setError(data.error || "Failed to fetch room details");
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while fetching room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  return { roomDetails, loading, error };
}
