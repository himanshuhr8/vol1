"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DoorOpen } from "lucide-react";
import { useSession } from "next-auth/react";

type RoomResponse = {
  roomId: string;
  roomName: string;
};

export function HostDropdown() {
  const { data: session } = useSession();
  const [room, setRoom] = useState<{ roomId: string; roomName: string } | null>(
    null
  );

  useEffect(() => {
    const fetchRoom = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await axios.get<RoomResponse>(
          `/api/user/host?userId=${session.user.id}`
        );
        setRoom(res.data);
      } catch {
        // silently fail
      }
    };

    fetchRoom();
  }, [session?.user?.id]);

  if (!room) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DoorOpen className="mr-2 h-4 w-4" />
          My Room
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled className="text-xs opacity-70">
          Room: {room.roomName}
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs opacity-70">
          Code: {room.roomId}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (window.location.href = `/room/${room.roomId}`)}
        >
          Rejoin Room
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(room.roomId);
            toast.success("Room code copied!");
          }}
        >
          Copy Room Code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
