import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";

//@ts-expect-error
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
    const extractedId = url.split("?v=")[1];

    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    // console.log(res);
    // console.log(res.thumbnail.thumbnails);
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    // console.log(thumbnails);

    const stream = await prismaClient.stream.create({
      data: {
        userId: userId,
        roomId: roomId,
        url: url,
        title: res.title ?? "It broke sadly :(",
        extractedId: extractedId,
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ?? broken_cat,
        bigImg: thumbnails[thumbnails.length - 1].url ?? broken_cat,
        type: "Youtube",
      },
    });
    return NextResponse.json({ message: "Added stream", id: stream.id });
  } catch (e) {
    console.log(e);
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
