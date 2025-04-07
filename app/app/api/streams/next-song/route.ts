import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";

const NextSongSchema = z.object({
  roomActualId: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const data = NextSongSchema.safeParse(await req.json());
    if (!data.success) {
      return NextResponse.json({ error: "Invalid Body" }, { status: 411 });
    }
    // Find the top-voted song that has NOT been played yet
    const roomId = data.data.roomActualId;
    const topSong = await prismaClient.stream.findFirst({
      where: {
        isPlayed: false,
        roomId: roomId, // filter by room
      },
      orderBy: {
        upvotes: "desc",
      },
    });

    if (!topSong) {
      return NextResponse.json({ song: null }, { status: 404 });
    }

    // Check if there's a currently playing song
    const currentlyPlaying = await prismaClient.currentlyPlaying.findFirst({
      where: {
        roomId: roomId,
      },
      include: { stream: true },
    });

    if (currentlyPlaying) {
      // Move the currently playing song to Played table
      await prismaClient.played.create({
        data: {
          streamId: currentlyPlaying.stream.id,
          title: currentlyPlaying.stream.title,
          roomId: currentlyPlaying.stream.roomId,
          smallImg: currentlyPlaying.stream.smallImg,
          type: currentlyPlaying.stream.type,
        },
      });

      // Remove from CurrentlyPlaying
      await prismaClient.currentlyPlaying.delete({
        where: { id: currentlyPlaying.id, roomId: roomId },
      });
    }

    // Set the new song as Currently Playing
    await prismaClient.currentlyPlaying.create({
      data: { streamId: topSong.id, startedAt: new Date(), roomId: roomId },
    });
    await prismaClient.stream.update({
      where: { id: topSong.id, roomId: roomId },
      data: { isPlayed: true },
    });

    return NextResponse.json({ message: "Now Playing", song: topSong });
  } catch (error) {
    console.error("Error playing song:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
