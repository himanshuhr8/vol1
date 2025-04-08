"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import axios from "axios";
import { toast } from "sonner";

type CreateRoomResponse = {
  room: {
    id: string;
    roomId: string;
    name: string;
    ownerId: string;
  };
};

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("private");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createRoomHandler = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<CreateRoomResponse>("/api/room/create", {
        roomName,
      });

      router.push(`/room/${res.data.room.roomId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create a Room</h1>
            <p className="text-muted-foreground">
              Set up your music room and invite friends to join
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                placeholder="Friday Night Vibes"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <RadioGroup
                value={roomType}
                onValueChange={setRoomType}
                className="flex"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="cursor-pointer">
                    Private
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Private rooms require a code to join. Public rooms can be
                discovered by anyone.
              </p>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={createRoomHandler}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Room"}
            </Button>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
