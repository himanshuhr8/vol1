"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface JoinRoomResponse {
  room: {
    id: string;
    roomId: string;
    roomName: string;
    ownerId: string;
  };
}
//for non authenticated users local storage can be done
export default function JoinRoomPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  // const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return alert("Please enter a room code");

    try {
      setLoading(true);
      const res = await axios.post<JoinRoomResponse>("/api/room/join", {
        roomId: roomCode.trim(),
        // nickname: nickname.trim() || undefined,
      });

      const { room } = res.data;
      router.push(`/room/${room.roomId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to join room");
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
            <h1 className="text-3xl font-bold">Join a Room</h1>
            <p className="text-muted-foreground">
              Enter a room code to join an existing music session
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter room code (e.g., MUSIC-123)"
                onChange={(e) => setRoomCode(e.target.value)}
                className="text-center text-lg py-6"
              />
            </div>
            {/* <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your nickname (optional)"
                onChange={(e) => setNickname(e.target.value)}
                className="text-center py-4"
              />
            </div> */}
            <Button
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={handleJoinRoom}
            >
              {loading ? "Joining..." : "Join Room"}
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
