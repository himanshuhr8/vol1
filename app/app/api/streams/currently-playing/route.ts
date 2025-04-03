import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentlyPlaying = await prismaClient.currentlyPlaying.findFirst({
      include: { stream: true },
    });

    if (!currentlyPlaying) {
      return NextResponse.json({ song: null }, { status: 200 });
    }

    return NextResponse.json({ song: currentlyPlaying.stream });
  } catch (error) {
    console.error("Error fetching currently playing song:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
