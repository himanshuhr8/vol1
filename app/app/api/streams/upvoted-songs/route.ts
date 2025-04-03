import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const upVotedStreams = await prismaClient.upvote.findMany({
      where: {
        userId: creatorId ?? "",
      },
    });
    return NextResponse.json({ upVotedStreams });
  } catch (e) {
    return NextResponse.json(
      { error: "Error while fetching streams" },
      { status: 411 }
    );
  }
}
