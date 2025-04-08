import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prismaClient } from "@/app/lib/db";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RoomSchema = z.object({
  roomName: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const data = RoomSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 411 }
    );
  }

  const roomName = data.data.roomName;

  // Check if user already owns a room
  const existingRoom = await prismaClient.room.findFirst({
    where: { ownerId: userId },
  });

  if (existingRoom) {
    return NextResponse.json(
      { error: "You already own a room" },
      { status: 400 }
    );
  }

  // Create new room
  const newRoom = await prismaClient.room.create({
    data: {
      roomId: nanoid(6),
      ownerId: userId,
      roomName: roomName,
    },
  });

  // Add user as participant in their own room
  await prismaClient.roomParticipant.create({
    data: {
      userId: userId,
      roomId: newRoom.id,
    },
  });

  // Update user's ownedRoomId (joinedRoomId no longer needed)
  await prismaClient.user.update({
    where: { id: userId },
    data: {
      ownedRoomId: newRoom.id,
    },
  });

  return NextResponse.json({ message: "Room created", room: newRoom });
}
