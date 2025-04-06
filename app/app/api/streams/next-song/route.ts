import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Find the top-voted song that has NOT been played yet
    const topSong = await prismaClient.stream.findFirst({
      where: { isPlayed: false },
      orderBy: { upvotes: "desc" },
    });

    if (!topSong) {
      return NextResponse.json(
        { message: "No songs available to play" },
        { status: 404 }
      );
    }

    // Check if there's a currently playing song
    const currentlyPlaying = await prismaClient.currentlyPlaying.findFirst({
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
        where: { id: currentlyPlaying.id },
      });
    }

    // Set the new song as Currently Playing
    await prismaClient.currentlyPlaying.create({
      data: { streamId: topSong.id, startedAt: new Date() },
    });
    await prismaClient.stream.update({
      where: { id: topSong.id },
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
