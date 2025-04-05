import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomId } = body;

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  const room = await prismaClient.room.findUnique({
    where: { roomId },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const userId = session.user.id;

    // Check if user is already a participant in this room
    const existingParticipant = await prismaClient.roomParticipant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: room.id,
        },
      },
    });

    if (!existingParticipant) {
      // Add user to room participants
      await prismaClient.roomParticipant.create({
        data: {
          userId,
          roomId: room.id,
        },
      });
    }
  }

  return NextResponse.json({ room }, { status: 200 });
}
