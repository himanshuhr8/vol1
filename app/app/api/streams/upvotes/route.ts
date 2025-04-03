import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { z } from "zod";

const UpVoteSchema = z.object({
  streamId: z.string(),
});
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const data = UpVoteSchema.safeParse(await req.json());
    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }

    await prismaClient.$transaction([
      prismaClient.upvote.create({
        data: {
          userId: user.id,
          streamId: data.data.streamId,
        },
      }),
      prismaClient.stream.update({
        where: {
          id: data.data.streamId,
        },
        data: {
          upvotes: {
            increment: 1,
          },
        },
      }),
    ]);
    return NextResponse.json({ message: "Upvoted stream" }, { status: 200 });
  } catch (e) {
    console.log(session);
    return NextResponse.json(
      { error: "Error while adding a stream" },
      { status: 411 }
    );
  }
}
