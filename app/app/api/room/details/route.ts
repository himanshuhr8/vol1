// /app/api/room/details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "Room ID required" }, { status: 400 });
  }

  const room = await prismaClient.room.findUnique({
    where: { roomId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    roomName: room.roomName,
    participantCount: room.participants.length,
    participants: room.participants.map((p) => ({
      name: p.user.name,
      id: p.user.id,
    })),
    roomOwner: room.ownerId,
    roomActualId: room.id,
  });
}
