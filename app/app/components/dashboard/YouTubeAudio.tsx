"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMusicStore } from "@/app/store/currentSong";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  Heart,
  ExternalLink,
  Youtube,
  AirplayIcon as Spotify,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface YoutubeInterface {
  roomActualId: string;
}

type Song = {
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
  room: {
    ownerId: string;
  };
};

const YouTubeAudioPlayer: React.FC<YoutubeInterface> = ({ roomActualId }) => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMusicStore();
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchOrStartSong = async () => {
      try {
        const res = await axios.get<{ song: Song | null }>(
          "/api/streams/currently-playing",
          {
            params: {
              roomId: roomActualId,
            },
          }
        );

        const data = res.data;

        if (!data.song) {
          try {
            const nextRes = await axios.post<{ song: Song | null }>(
              "/api/streams/next-song",
              { roomActualId }
            );

            if (nextRes.status === 200 && nextRes.data?.song) {
              setCurrentlyPlaying(nextRes.data.song);
            } else {
              setCurrentlyPlaying(null);
            }
          } catch (error) {
            console.log(error);
            toast.error("Error fetching next song");
            setCurrentlyPlaying(null);
          }
        } else {
          setCurrentlyPlaying(data.song); // ✅ safely typed
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching currently playing song");
        setCurrentlyPlaying(null);
      }
    };

    fetchOrStartSong();

    const interval = setInterval(fetchOrStartSong, 5000);
    return () => clearInterval(interval);
  }, [roomActualId]);

  // Separate useEffect for initializing YouTube Player
  useEffect(() => {
    if (!currentlyPlaying?.extractedId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer(currentlyPlaying.extractedId!);
      };
    } else {
      if (currentlyPlaying?.extractedId)
        initializePlayer(currentlyPlaying.extractedId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentlyPlaying?.extractedId]); // ← Re-run when extractedId changes

  const initializePlayer = (videoId: string) => {
    if (!window.YT || !videoId) return;

    const newPlayer = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        fs: 0,
        rel: 0,
      },
      events: {
        onReady: (event: YT.PlayerEvent) => {
          setPlayer(event.target);
          setVideoDuration(event.target.getDuration());

          const id = setInterval(() => {
            if (event.target && event.target.getCurrentTime) {
              const currentTime = event.target.getCurrentTime();
              setProgress((currentTime / event.target.getDuration()) * 100);
            }
          }, 1000);
          setIntervalId(id);
        },
        onStateChange: (event: YT.OnStateChangeEvent) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            if (intervalId) clearInterval(intervalId);

            handlePlayNext();
          }
        },
      },
    });

    setPlayer(newPlayer);
  };
  //skeleton need to be added
  if (!currentlyPlaying) return <p>No song is currently playing.</p>;
  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (player) {
      const newTime = (value / 100) * videoDuration;
      player.seekTo(newTime, true);
      setProgress(value);
    }
  };

  const calculateCurrentTime = () => {
    if (!player) return "0:00";
    return new Date((progress / 100) * videoDuration * 1000)
      .toISOString()
      .substring(14, 19);
  };
  async function handlePlayNext() {
    const nextRes = await axios.post<{ song: Song | null }>(
      "/api/streams/next-song",
      { roomActualId }
    );

    if (nextRes.status === 200 && nextRes.data?.song) {
      setCurrentlyPlaying(nextRes.data.song); // ✅ safely typed
    } else {
      setCurrentlyPlaying(null);
    }
    window.location.reload();
  }

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

          {/* Details & Controls */}
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentlyPlaying.title}</h2>
              {/* <p className="text-sm">
                Added by {currentlyPlaying.room.ownerId}
              </p> */}
            </div>

            {/* Progress Bar */}
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSeek(value[0])}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{calculateCurrentTime()}</span>
                  <span>
                    {new Date(videoDuration * 1000)
                      .toISOString()
                      .substring(14, 19)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (player) {
                        if (isMuted) {
                          player.unMute();
                          setVolume(50);
                          player.setVolume(50);
                        } else {
                          player.mute();
                        }
                      }
                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0]);
                      if (player) player.setVolume(value[0]);
                    }}
                    className="w-24"
                  />
                </div>

                {/* Play/Pause Button */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handlePlayNext}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Extra Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hidden YouTube Player */}
            <div id="youtube-player" style={{ display: "none" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeAudioPlayer;
