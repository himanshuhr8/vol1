import { NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";

export async function GET() {
  try {
    const playedSongs = await prismaClient.played.findMany({});

    if (!playedSongs) {
      return NextResponse.json({ message: "No songs found." }, { status: 404 });
    }

    return NextResponse.json({ playedSongs: playedSongs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching played-voted song:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
