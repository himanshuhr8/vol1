import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const roomId = req.nextUrl.searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
    }
    const upVotedStreams = await prismaClient.upvote.findMany({
      where: {
        userId: creatorId!,
        roomId: roomId,
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
