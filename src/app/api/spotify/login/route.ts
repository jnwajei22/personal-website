// src/app/api/spotify/login/route.ts
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getSpotifyConfig } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "playlist-modify-public",
  "playlist-modify-private",
];

export async function GET() {
  const { clientId, redirectUri } = getSpotifyConfig();

  const state = randomBytes(24).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    state,

    // Force Spotify to show the new playlist permission.
    show_dialog: "true",
  });

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );

  response.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/spotify/callback",
    maxAge: 10 * 60,
  });

  return response;
}