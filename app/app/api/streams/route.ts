import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import { broken_cat } from "@/public/utils";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
  url: z.string(),
});

const YT_API_KEY = process.env.YOUTUBE_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.safeParse(await req.json());
    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }

    const { userId, url, roomId } = data.data;
    const isYtUrl = url.match(YT_REGEX);
    if (!isYtUrl) {
      return NextResponse.json(
        { error: "Invalid Youtube URL" },
        { status: 411 }
      );
    }

    const extractedId = isYtUrl[1]; // grab the video ID from regex match
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${extractedId}&key=${YT_API_KEY}`
    );
    const ytData = await ytRes.json();

    if (!ytData.items || ytData.items.length === 0) {
      return NextResponse.json(
        { error: "Video not found on YouTube" },
        { status: 404 }
      );
    }

    const snippet = ytData.items[0].snippet;
    // console.log(snippet);
    const thumbnails = snippet.thumbnails;

    const smallImg =
      thumbnails.medium?.url || thumbnails.default?.url || broken_cat;

    const bigImg =
      thumbnails.maxres?.url ||
      thumbnails.high?.url ||
      thumbnails.standard?.url ||
      broken_cat;

    const stream = await prismaClient.stream.create({
      data: {
        userId,
        roomId,
        url,
        title: snippet.title ?? "Unknown Title",
        extractedId,
        smallImg,
        bigImg,
        type: "Youtube",
      },
    });

    return NextResponse.json({ message: "Added stream", id: stream.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error while adding a stream" },
      { status: 411 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const roomIdParam = req.nextUrl.searchParams.get("roomId");

    if (!roomIdParam) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    const streams = await prismaClient.stream.findMany({
      where: {
        roomId: roomIdParam,
        isPlayed: false,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ streams });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error while fetching streams" },
      { status: 500 }
    );
  }
}
