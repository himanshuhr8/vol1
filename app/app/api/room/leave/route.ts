import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LeaveSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const data = LeaveSchema.safeParse(await req.json());
    if (!data.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 411 });
    }
    const { userId, roomId } = data.data;

    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      select: { ownerId: true },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    if (room.ownerId === userId) {
      // Host leaving → delete entire room
      await prismaClient.room.delete({
        where: { id: roomId },
      });

      return NextResponse.json(
        { message: "Room deleted (host left)" },
        { status: 200 }
      );
    } else {
      // Just remove the user from participants
      await prismaClient.roomParticipant.delete({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      return NextResponse.json({ message: "Left the room" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error leaving room:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
