import { NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod";

const ReplaySchema = z.object({
  streamId: z.string(),
});

export async function POST(req: Request) {
  try {
    const parsedData = ReplaySchema.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }
    const { streamId } = parsedData.data;

    const updatedSong = await prismaClient.stream.update({
      where: { id: streamId },
      data: { isPlayed: false, upvotes: 0 },
    });
    await prismaClient.played.delete({
      where: { streamId: streamId },
    });
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
