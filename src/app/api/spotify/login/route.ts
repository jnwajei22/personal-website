// src/app/api/spotify/login/route.ts
import { NextResponse } from "next/server";
import { getSpotifyConfig } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];

export async function GET() {
  const { clientId, redirectUri } = getSpotifyConfig();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    show_dialog: "false",
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
