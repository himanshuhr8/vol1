import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const UpVoteSchema = z.object({
  streamId: z.string(),
  roomId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = UpVoteSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 411 }
    );
  }

  const { streamId, roomId } = parsed.data;

  try {
    const room = await prismaClient.room.findFirst({
      where: { roomId: roomId! },
      select: { id: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const existing = await prismaClient.upvote.findFirst({
      where: {
        userId: session.user.id,
        streamId: streamId,
      },
    });

    if (existing) {
      // User already upvoted → undo upvote
      await prismaClient.$transaction([
        prismaClient.upvote.delete({
          where: {
            id: existing.id,
          },
        }),
        prismaClient.stream.update({
          where: { id: streamId },
          data: {
            upvotes: {
              decrement: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ message: "Removed upvote" }, { status: 200 });
    } else {
      // User has not upvoted → create upvote
      await prismaClient.$transaction([
        prismaClient.upvote.create({
          data: {
            userId: session.user.id,
            streamId: streamId,
            roomId: room.id,
          },
        }),
        prismaClient.stream.update({
          where: { id: streamId },
          data: {
            upvotes: {
              increment: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ message: "Upvoted stream" }, { status: 200 });
    }
  } catch (e) {
    console.error("Error during upvote toggle:", e);
    return NextResponse.json(
      { error: "Error while upvoting stream" },
      { status: 500 }
    );
  }
}
