import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
    }

    const currentlyPlaying = await prismaClient.currentlyPlaying.findFirst({
      where: {
        roomId: roomId,
      },
      include: {
        stream: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            room: {
              select: {
                ownerId: true,
              },
            },
          },
        },
      },
    });

    if (!currentlyPlaying) {
      return NextResponse.json({ song: null }, { status: 200 });
    }

    return NextResponse.json({ song: currentlyPlaying.stream });
  } catch (error) {
    console.error("Error fetching currently playing song:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
