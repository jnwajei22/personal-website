import { NextRequest, NextResponse } from "next/server";
import { spotifyGet } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  type: string;
  duration_ms: number;
  explicit: boolean;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images?: Array<{
      url: string;
      height?: number | null;
      width?: number | null;
    }>;
  };
  external_urls?: {
    spotify?: string;
  };
};

type SpotifySearchResponse = {
  tracks?: {
    items?: Array<SpotifyTrack | null>;
  };
};

function extractTrackId(input: string) {
  const trimmed = input.trim();

  const uriMatch = trimmed.match(
    /^spotify:track:([A-Za-z0-9]{22})$/,
  );

  if (uriMatch) {
    return uriMatch[1];
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname !== "open.spotify.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const trackIndex = parts.indexOf("track");
    const trackId = parts[trackIndex + 1];

    if (/^[A-Za-z0-9]{22}$/.test(trackId ?? "")) {
      return trackId;
    }
  } catch {
    // Input was a normal text search, not a URL.
  }

  return null;
}

function serializeTrack(track: SpotifyTrack) {
  return {
    id: track.id,
    uri: track.uri,
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    albumArtUrl:
      track.album.images?.[1]?.url ??
      track.album.images?.[0]?.url ??
      null,
    spotifyUrl: track.external_urls?.spotify ?? null,
    durationMs: track.duration_ms,
    explicit: track.explicit,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      {
        error: "Enter at least two characters.",
      },
      { status: 400 },
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      {
        error: "That search is too long.",
      },
      { status: 400 },
    );
  }

  try {
    const trackId = extractTrackId(query);

    if (trackId) {
      const track = await spotifyGet<SpotifyTrack>(
        `/tracks/${trackId}`,
      );

      return NextResponse.json({
        items:
          track && track.type === "track"
            ? [serializeTrack(track)]
            : [],
      });
    }

    const params = new URLSearchParams({
      q: query,
      type: "track",
      limit: "5",
    });

    const data = await spotifyGet<SpotifySearchResponse>(
      `/search?${params.toString()}`,
    );

    const items = (data?.tracks?.items ?? [])
      .filter(
        (track): track is SpotifyTrack =>
          Boolean(track && track.type === "track"),
      )
      .map(serializeTrack);

    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Spotify search failed";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}