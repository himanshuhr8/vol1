import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const room = await prismaClient.room.findUnique({
    where: {
      ownerId: userId,
    },
    select: {
      roomId: true,
      roomName: true,
    },
  });

  if (!room) {
    return NextResponse.json(
      { error: "No room found for this user" },
      { status: 404 }
    );
  }

  return NextResponse.json(room);
}
