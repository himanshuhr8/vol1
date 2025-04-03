"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
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
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                router.push(`/room/${roomCode}`);
              }}
            >
              Join Room
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
