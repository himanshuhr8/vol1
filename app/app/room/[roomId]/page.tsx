"use client";
import axios from "axios";
import type React from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRefreshStore } from "@/app/store/atoms";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import {
  Music,
  Users,
  ThumbsUp,
  Settings,
  LogOut,
  AirplayIcon as Spotify,
  Plus,
  Search,
  X,
  Share2,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import { YoutubeIcon } from "@/public/youtubeIcon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import useStreams from "@/app/hooks/useStreams";
import YouTubeAudioPlayer from "@/app/components/roomDashboard/YouTubeAudio";
import { usePlayedSongs } from "@/app/hooks/usePlayedSongs";
import { useRoomDetails } from "@/app/hooks/useRoomDetails";
import CurrentSongDisplay from "@/app/components/roomDashboard/CurrentSongDisplay";

export default function RoomDashboard() {
  const params = useParams();
  const { data: session } = useSession();

  const roomId = params.roomId as string;
  const userId = session?.user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  // const [newSongSource, setNewSongSource] = useState<"youtube" | "spotify">(
  //   "youtube"
  // );
  const [showParticipants, setShowParticipants] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [isHistory, setIsHistory] = useState(false);

  const addSongInputRef = useRef<HTMLInputElement>(null);
  const incrementKey = useRefreshStore((state) => state.incrementKey);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      try {
        await axios.get("/api/room/details", {
          params: { roomId },
        });
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Room has been closed by the host.");
          router.push("/");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    if (isAddingSong && addSongInputRef.current) {
      setTimeout(() => {
        addSongInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingSong]);

  const { roomDetails } = useRoomDetails(roomId);
  const { streams, upVotedSongs, loading } = useStreams(
    roomDetails?.roomActualId,
    userId
  );

  const playedSongs = usePlayedSongs(roomDetails?.roomActualId);
  const historySongs = playedSongs.playedSongs;
  const router = useRouter();
  // 🔁 Now conditionally render AFTER hooks
  if (!session) return <p>You are not signed in</p>;

  // Handle voting
  const handleVote = async (songId: string) => {
    try {
      const res = await axios.post("/api/streams/upvotes", {
        streamId: songId,
        roomId: roomDetails?.roomActualId,
      });

      if (res.status === 200) {
        incrementKey(); // Refresh streams after voting
      }
    } catch (e) {
      console.log(e);
      toast.error("Error while voting!");
    }
  };

  const handleAddSong = async () => {
    if (!newSongUrl.trim()) return;
    const payload = {
      userId: userId,
      url: newSongUrl,
      roomId: roomDetails?.roomActualId,
      type: "Youtube",
    };
    try {
      await axios.post("/api/streams", payload);
      setNewSongUrl("");
      setIsAddingSong(false);
      incrementKey(); // Refresh streams after adding a song
    } catch (e) {
      console.log(e);
      toast.error("Error while Adding");
    }
  };
  const handleHistoryButton = () => {
    setIsHistory(true);
    incrementKey(); // Refresh streams after closing history
  };

  const handleReplaySong = async (streamId: string) => {
    try {
      const response = await axios.post("/api/streams/replay-song", {
        streamId: streamId,
        roomId: roomDetails?.roomActualId,
      });

      if (response.status === 200) {
        toast.success("Song replayed successfully!");
        setIsHistory(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error replaying song");
    }
  };
  const handleLeave = async () => {
    try {
      const response = await axios.post("/api/room/leave", {
        userId: userId,
        roomId: roomDetails?.roomActualId,
      });

      if (response.status === 200) {
        toast.success("Left room");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error leaving song");
    }
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.log(err);
      toast.error("Failed to copy");
    });
  };

  const isOwner = roomDetails?.roomOwner === userId;
  const filteredSongs = streams.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (!userId) {
    return <p>You are not signed in</p>;
  }
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <Link
            href="/"
            className="font-bold text-xl hidden sm:block cursor-pointer"
          >
            MusicRoom
          </Link>
          <Badge variant="outline" className="ml-2">
            {roomDetails?.roomName}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <Users className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {roomDetails?.participantCount}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Room Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Room Code</p>
                  <div className="flex">
                    <Input readOnly value={roomId} className="rounded-r-none" />
                    <Button
                      variant="secondary"
                      className="rounded-l-none"
                      onClick={() => handleCopy(roomId)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Share Link</p>
                  <div className="flex">
                    <Input
                      readOnly
                      value={`https://vol1-hima31.vercel.app/room/${roomId}`}
                      className="rounded-r-none"
                    />
                    <Button
                      variant="secondary"
                      className="rounded-l-none"
                      onClick={() =>
                        handleCopy(
                          `https://vol1-hima31.vercel.app/room/${roomId}`
                        )
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <ThemeToggle />

          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={""} // Replace with avatar URL if available
                  alt={session.user.name}
                />
                <AvatarFallback>{session.user.name[0]}</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Account</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={session.user.name} />
                    <AvatarFallback>{session.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    size="sm"
                    onClick={handleLeave}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Room
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Player and Queue */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Currently Playing */}
          {isOwner ? (
            <YouTubeAudioPlayer roomActualId={roomDetails?.roomActualId} />
          ) : (
            <CurrentSongDisplay roomActualId={roomDetails?.roomActualId} />
          )}

          {/* Queue and Chat Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="queue" className="h-full flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger
                    value="queue"
                    className="data-[state=active]:bg-transparent"
                  >
                    Queue
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="queue"
                className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=inactive]:hidden"
              >
                <div className="p-4 border-b">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search songs..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      {isAddingSong ? (
                        <div
                          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                          onClick={() => setIsAddingSong(false)}
                        >
                          <div
                            className="bg-card border rounded-lg shadow-lg w-full max-w-md p-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">
                                Add a Song
                              </h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsAddingSong(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <Tabs defaultValue="youtube" className="w-full">
                              <TabsContent
                                value="youtube"
                                className="space-y-4 mt-2"
                              >
                                <div className="space-y-2">
                                  <div className="flex">
                                    <Label htmlFor="youtube-url">
                                      YouTube URL
                                    </Label>

                                    <YoutubeIcon className="h-4 w-4 ml-2" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      id="youtube-url"
                                      ref={addSongInputRef}
                                      placeholder="https://youtube.com/watch?v=..."
                                      value={newSongUrl}
                                      onChange={(e) =>
                                        setNewSongUrl(e.target.value)
                                      }
                                    />
                                    <Button
                                      onClick={handleAddSong}
                                      disabled={!newSongUrl.trim()}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Paste a YouTube video URL to add it to the
                                    queue
                                  </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <Label>Search YouTube</Label>
                                  <Input placeholder="Search for a song or artist..." />
                                  <div className="h-48 border rounded-md p-2 overflow-y-auto">
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                      Search results will appear here
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value="spotify"
                                className="space-y-4 mt-2"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="spotify-url">
                                    Spotify URL
                                  </Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="spotify-url"
                                      placeholder="https://open.spotify.com/track/..."
                                      value={newSongUrl}
                                      onChange={(e) =>
                                        setNewSongUrl(e.target.value)
                                      }
                                    />
                                    <Button
                                      onClick={handleAddSong}
                                      disabled={!newSongUrl.trim()}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Paste a Spotify track URL to add it to the
                                    queue
                                  </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                  <Label>Search Spotify</Label>
                                  <Input placeholder="Search for a song or artist..." />
                                  <div className="h-48 border rounded-md p-2 overflow-y-auto">
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                      Search results will appear here
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      ) : null}
                      {isHistory ? (
                        <div
                          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                          onClick={() => setIsHistory(false)}
                        >
                          <div
                            className="bg-card border rounded-lg shadow-lg w-full max-w-md p-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">
                                Previously Played Songs
                              </h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsHistory(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {historySongs.length > 0 ? (
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {historySongs.map((song, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 border-b pb-2 justify-between"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Image
                                        src={
                                          song.smallImg || "/placeholder.svg"
                                        }
                                        alt={song.title}
                                        width={50}
                                        height={50}
                                        className="rounded-md shadow-sm"
                                      />
                                      <div className="flex flex-col">
                                        <p className="font-medium">
                                          {song.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Added by: {song.userId}
                                        </p>
                                      </div>
                                    </div>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleReplaySong(song.streamId)
                                      }
                                    >
                                      Replay
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-sm text-muted-foreground">
                                No previously played songs.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Button onClick={() => setIsAddingSong(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Song
                      </Button>
                      <Button
                        className="mx-2"
                        onClick={() => handleHistoryButton()}
                      >
                        History
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {filteredSongs.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {searchQuery
                          ? "No songs match your search"
                          : "No songs in the queue"}
                      </p>
                    ) : (
                      filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-3 bg-card rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={song.smallImg || "/placeholder.svg"}
                              height={100}
                              width={100}
                              alt={song.title}
                              className="object-cover "
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{song.title}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="mx-1">•</span>
                              <span>Added by {song.user.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {song.type === "Youtube" ? (
                              <YoutubeIcon className="h-4 w-4" />
                            ) : (
                              <Spotify className="h-4 w-4 text-green-500" />
                            )}
                            <Button
                              variant={
                                upVotedSongs?.some(
                                  (upvote) => upvote.streamId === song.id
                                )
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="flex items-center justify-between gap-3 px-2"
                              onClick={() => handleVote(song.id)}
                              disabled={loading}
                            >
                              <div className="flex items-center gap-1">
                                {upVotedSongs?.some(
                                  (upvote) => upvote.streamId === song.id
                                ) ? (
                                  <ThumbsDown className="h-3 w-3" />
                                ) : (
                                  <ThumbsUp className="h-3 w-3" />
                                )}
                              </div>
                              <span className="bg-muted px-2 py-0.5 rounded text-xs">
                                {song.upvotes}
                              </span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Participants Sidebar (hidden on mobile) */}
        {roomDetails && showParticipants && (
          <div className="w-64 border-l hidden lg:block overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-medium">
                Participants ({roomDetails.participants.length})
              </h3>
            </div>
            <div className="p-2">
              {roomDetails.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={""} // Replace with avatar URL if available
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{participant.name}</span>
                  {participant.id === roomDetails.roomOwner && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Host
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
