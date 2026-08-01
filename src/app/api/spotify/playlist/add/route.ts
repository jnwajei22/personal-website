// src/app/api/spotify/playlist/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getSpotifyConfig,
  spotifyGet,
  spotifyPost,
} from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUBMISSION_COOKIE = "spotify_guest_submission";
const SUBMISSION_LIMIT_SECONDS = 24 * 60 * 60;

type AddRequest = {
  uri?: unknown;
};

type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  type: string;
  artists: Array<{
    name: string;
  }>;
  external_urls?: {
    spotify?: string;
  };
};

type AddItemsResponse = {
  snapshot_id: string;
};

function getTrackId(uri: string) {
  const match = uri.match(
    /^spotify:track:([A-Za-z0-9]{22})$/,
  );

  return match?.[1] ?? null;
}

export async function POST(request: NextRequest) {
  if (process.env.SPOTIFY_GUEST_ADD_ENABLED !== "true") {
    return NextResponse.json(
      {
        error: "Guest additions are currently disabled.",
      },
      { status: 503 },
    );
  }

  const contentType = request.headers.get("content-type");

  if (!contentType?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      {
        error: "Requests must use application/json.",
      },
      { status: 415 },
    );
  }

  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return NextResponse.json(
      {
        error: "Cross-site requests are not allowed.",
      },
      { status: 403 },
    );
  }

  if (request.cookies.has(SUBMISSION_COOKIE)) {
    return NextResponse.json(
      {
        error:
          "You already left a song today. Try again tomorrow.",
      },
      { status: 429 },
    );
  }

  let body: AddRequest;

  try {
    body = (await request.json()) as AddRequest;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  if (typeof body.uri !== "string") {
    return NextResponse.json(
      {
        error: "A Spotify track URI is required.",
      },
      { status: 400 },
    );
  }

  const trackId = getTrackId(body.uri);

  if (!trackId) {
    return NextResponse.json(
      {
        error: "Only valid Spotify tracks can be added.",
      },
      { status: 400 },
    );
  }

  try {
    const { playlistId } = getSpotifyConfig();

    if (!playlistId) {
      throw new Error("Missing SPOTIFY_PLAYLIST_ID");
    }

    const track = await spotifyGet<SpotifyTrack>(
      `/tracks/${trackId}`,
    );

    if (
      !track ||
      track.type !== "track" ||
      track.uri !== body.uri
    ) {
      return NextResponse.json(
        {
          error: "Spotify could not validate this track.",
        },
        { status: 400 },
      );
    }

    const result = await spotifyPost<AddItemsResponse>(
      `/playlists/${playlistId}/items`,
      {
        uris: [track.uri],
      },
    );

    const response = NextResponse.json(
      {
        added: true,
        snapshotId: result?.snapshot_id ?? null,
        track: {
          id: track.id,
          uri: track.uri,
          name: track.name,
          artist: track.artists
            .map((artist) => artist.name)
            .join(", "),
          spotifyUrl: track.external_urls?.spotify ?? null,
        },
      },
      { status: 201 },
    );

    response.cookies.set({
      name: SUBMISSION_COOKIE,
      value: Date.now().toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SUBMISSION_LIMIT_SECONDS,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The track could not be added.";

    console.error("Spotify playlist addition failed:", error);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}