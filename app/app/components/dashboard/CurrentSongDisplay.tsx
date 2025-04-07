"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Youtube, AirplayIcon as Spotify } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMusicStore } from "@/app/store/currentSong";

const CurrentSongDisplay: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMusicStore();

  useEffect(() => {
    const fetchOrStartSong = async () => {
      const res = await fetch("/api/streams/currently-playing");
      const data = await res.json();

      if (!data.song) {
        const nextRes = await fetch("/api/streams/next-song", {
          method: "POST",
        });
        const nextData = await nextRes.json();
        if (nextRes.ok && nextData.song) {
          setCurrentlyPlaying(nextData.song);
        }
      } else {
        setCurrentlyPlaying(data.song);
      }
    };

    fetchOrStartSong();
    const interval = setInterval(fetchOrStartSong, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!currentlyPlaying) return <p>No song is currently playing.</p>;

  const formatTime = (seconds: number) =>
    new Date(seconds * 1000).toISOString().substring(14, 19);

  return (
    <div className="p-6 border-b bg-muted/30 dark:bg-muted/10">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 items-center">
          {/* Thumbnail */}
          <div className="relative aspect-square max-w-[250px] mx-auto md:mx-0">
            <Image
              src={currentlyPlaying.bigImg || "/placeholder.svg"}
              alt={currentlyPlaying.title}
              width={250}
              height={250}
              className="rounded-lg shadow-lg object-cover"
            />
            <div className="absolute top-2 right-2">
              {currentlyPlaying.type === "youtube" ? (
                <Badge className="bg-red-500 hover:bg-red-600">
                  <Youtube className="h-3 w-3 mr-1" />
                  YouTube
                </Badge>
              ) : (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Spotify className="h-3 w-3 mr-1" />
                  Spotify
                </Badge>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentlyPlaying.title}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSongDisplay;
