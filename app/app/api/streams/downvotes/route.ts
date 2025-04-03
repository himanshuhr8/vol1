import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownVoteSchema = z.object({
  streamId: z.string(),
});
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const data = DownVoteSchema.safeParse(await req.json());
    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }
    await prismaClient.upvote.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.data.streamId,
        },
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Error while adding a stream" },
      { status: 411 }
    );
  }
}
