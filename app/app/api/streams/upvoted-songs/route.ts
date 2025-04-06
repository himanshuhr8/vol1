import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const roomId = req.nextUrl.searchParams.get("roomId");
    const room = await prismaClient.room.findFirst({
      where: { roomId: roomId! },
      select: { id: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const upVotedStreams = await prismaClient.upvote.findMany({
      where: {
        userId: creatorId!,
        roomId: room.id,
      },
    });
    return NextResponse.json({ upVoted: upVotedStreams });
  } catch (e) {
    return NextResponse.json(
      { error: "Error while fetching streams" },
      { status: 411 }
    );
  }
}
