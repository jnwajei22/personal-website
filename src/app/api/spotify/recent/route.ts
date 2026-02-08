// src/app/api/spotify/recent/route.ts
import { NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RecentlyPlayed = {
  items: Array<{
    played_at: string;
    track: {
      name: string;
      artists: { name: string }[];
      external_urls?: { spotify?: string };
      album?: { images?: { url: string }[] };
    };
  }>;
};

export async function GET() {
  try {
    const data = await spotifyGet<RecentlyPlayed>("/me/player/recently-played?limit=10");

    const items =
      data?.items?.map((x) => ({
        track: x.track.name,
        artist: x.track.artists.map((a) => a.name).join(", "),
        songUrl: x.track.external_urls?.spotify,
        albumArtUrl: x.track.album?.images?.[2]?.url || x.track.album?.images?.[0]?.url || null,
        playedAt: x.played_at,
      })) ?? [];

    return NextResponse.json(items, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
