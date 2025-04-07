import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
    }
    const playedSongs = await prismaClient.played.findMany({
      where: {
        roomId: roomId,
      },
    });

    if (!playedSongs) {
      return NextResponse.json({ message: "No songs found." }, { status: 404 });
    }

    return NextResponse.json({ playedSongs: playedSongs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching played-voted song:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
