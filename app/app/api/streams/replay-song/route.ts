import { NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/authOptions";
import { getServerSession } from "next-auth";

const ReplaySchema = z.object({
  streamId: z.string(),
  roomId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const parsedData = ReplaySchema.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }

    const { streamId, roomId } = parsedData.data;

    const [updatedSong] = await prismaClient.$transaction([
      prismaClient.stream.update({
        where: { id: streamId, roomId: roomId },
        data: {
          isPlayed: false,
          upvotes: 0,
        },
      }),
      prismaClient.played.delete({
        where: {
          roomId_streamId: {
            roomId: roomId,
            streamId,
          },
        },
      }),
      prismaClient.upvote.deleteMany({
        where: {
          streamId,
          roomId: roomId,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Song updated successfully", updatedSong },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating played song:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
