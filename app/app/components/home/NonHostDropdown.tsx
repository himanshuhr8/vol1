"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DoorOpen, Copy, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

type Room = {
  roomId: string;
  roomName: string;
};

export function NonHostDropdown() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchJoinedRooms = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await axios.get<{ joinedRooms: Room[] }>(
          `/api/user/non-host?userId=${session.user.id}`
        );
        setRooms(res.data.joinedRooms);
      } catch {}
    };

    fetchJoinedRooms();
  }, [session?.user?.id]);

  if (rooms.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DoorOpen className="mr-2 h-4 w-4" />
          Joined Rooms
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {rooms.map((room) => (
          <DropdownMenuSub key={room.roomId}>
            <DropdownMenuSubTrigger>{room.roomName}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem disabled className="text-xs opacity-70">
                Code: {room.roomId}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = `/room/${room.roomId}`)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Rejoin Room
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(room.roomId);
                  toast.success("Room code copied!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Room Code
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
