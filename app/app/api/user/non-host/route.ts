// /api/rooms/joined/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const joinedRooms = await prismaClient.roomParticipant.findMany({
      where: { userId },
      include: {
        room: {
          select: {
            roomId: true,
            roomName: true,
          },
        },
      },
    });

    const formattedRooms = joinedRooms.map((entry) => entry.room);

    return NextResponse.json({ joinedRooms: formattedRooms });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch joined rooms" },
      { status: 500 }
    );
  }
}
