// src/app/api/spotify/now-playing/route.ts
import { NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CurrentlyPlaying = {
  is_playing: boolean;
  item: {
    name: string;
    artists?: { name: string }[];
    external_urls?: { spotify?: string };
    album?: { images?: { url: string }[] };
  } | null;
};

export async function GET() {
  try {
    const data = await spotifyGet<CurrentlyPlaying>("/me/player/currently-playing");

    if (!data) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const item = data.item;
    if (!item) return NextResponse.json({ isPlaying: false }, { status: 200 });

    return NextResponse.json(
      {
        isPlaying: !!data.is_playing,
        track: item.name,
        artist: item.artists?.map((a) => a.name).join(", "),
        songUrl: item.external_urls?.spotify,
        albumArtUrl: item.album?.images?.[0]?.url,
      },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
