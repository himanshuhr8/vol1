import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import youtubesearchapi from "youtube-search-api";
import { broken_cat } from "@/public/utils";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[POST] Incoming body:", body);

    const data = CreateStreamSchema.safeParse(body);
    if (!data.success) {
      console.log("[POST] Zod validation failed:", data.error.format());
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 411 }
      );
    }

    const { userId, url, roomId } = data.data;
    console.log("[POST] Parsed Data:", { userId, url, roomId });

    const isYtUrl = url.match(YT_REGEX);
    if (!isYtUrl) {
      console.log("[POST] Invalid YouTube URL:", url);
      return NextResponse.json(
        { error: "Invalid Youtube URL" },
        { status: 411 }
      );
    }

    const extractedId = url.split("?v=")[1];
    console.log("[POST] Extracted YouTube ID:", extractedId);

    let res;
    try {
      res = await youtubesearchapi.GetVideoDetails(extractedId);
      console.log("[POST] YouTube API response:", JSON.stringify(res, null, 2));
    } catch (err) {
      console.error("[POST] YouTube API error:", err);
      return NextResponse.json(
        { error: "Failed to fetch video details from YouTube" },
        { status: 500 }
      );
    }

    const title = res.videoDetails?.title ?? "It broke sadly :(";
    const thumbnails = res.videoDetails?.thumbnails ?? [];

    if (!thumbnails.length) {
      console.warn("[POST] No thumbnails found for video:", extractedId);
    }

    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    console.log("[POST] Sorted thumbnails:", thumbnails);

    const stream = await prismaClient.stream.create({
      data: {
        userId,
        roomId,
        url,
        title,
        extractedId,
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1]?.url) ?? broken_cat,
        bigImg: thumbnails[thumbnails.length - 1]?.url ?? broken_cat,
        type: "Youtube",
      },
    });

    console.log("[POST] Stream created:", stream.id);
    return NextResponse.json({ message: "Added stream", id: stream.id });
  } catch (e) {
    console.error("[POST] Fatal error:", e);
    return NextResponse.json(
      { error: "Error while adding a stream" },
      { status: 411 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const roomIdParam = req.nextUrl.searchParams.get("roomId");
    console.log("[GET] roomId:", roomIdParam);

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

    console.log("[GET] Found streams:", streams.length);
    return NextResponse.json({ streams });
  } catch (e) {
    console.error("[GET] Fatal error:", e);
    return NextResponse.json(
      { error: "Error while fetching streams" },
      { status: 500 }
    );
  }
}
