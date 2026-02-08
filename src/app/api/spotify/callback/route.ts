// src/app/api/spotify/callback/route.ts
import { NextResponse } from "next/server";
import { exchangeCodeForToken, getSpotifyConfig } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { postAuthRedirect } = getSpotifyConfig();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const token = await exchangeCodeForToken(code);

  // IMPORTANT: Spotify only returns refresh_token the FIRST time you authorize.
  // We can't write env vars from code. So we show it once so you can paste into .env.local.
  const refreshToken = token.refresh_token;

  if (!refreshToken) {
    // You probably already authorized once; refresh token won't be returned again.
    // In that case you already have it (or need to revoke access and re-auth).
    return NextResponse.redirect(new URL(postAuthRedirect, url.origin));
  }

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Spotify Connected</title></head>
  <body style="font-family: system-ui; padding: 24px;">
    <h1>Spotify connected.</h1>
    <p>Copy this refresh token into <code>.env.local</code> as <code>SPOTIFY_REFRESH_TOKEN</code>, then restart dev server.</p>
    <pre style="padding: 12px; background: #111; color: #0f0; overflow:auto;">${refreshToken}</pre>
    <p>After you paste it, go back to <a href="${postAuthRedirect}">${postAuthRedirect}</a>.</p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
