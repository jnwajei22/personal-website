// src/app/api/spotify/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  getSpotifyConfig,
} from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET(req: Request) {
  const { postAuthRedirect } = getSpotifyConfig();

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState =
    cookieStore.get("spotify_oauth_state")?.value;

  if (
    !returnedState ||
    !expectedState ||
    returnedState !== expectedState
  ) {
    return NextResponse.json(
      {
        error: "Invalid Spotify authorization state",
      },
      { status: 400 },
    );
  }

  if (error) {
    return NextResponse.json(
      { error },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "Missing authorization code",
      },
      { status: 400 },
    );
  }

  try {
    const token = await exchangeCodeForToken(code);

    console.log("Spotify granted scopes:", token.scope);

    const refreshToken = token.refresh_token;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error:
            "Spotify did not return a refresh token. Restart the authorization flow.",
        },
        { status: 500 },
      );
    }

    const safeRefreshToken = escapeHtml(refreshToken);
    const safeRedirect = escapeHtml(postAuthRedirect);
    const safeScope = escapeHtml(
      token.scope || "(none returned)",
    );

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <title>Spotify Connected</title>
  </head>

  <body
    style="
      max-width: 760px;
      margin: 48px auto;
      padding: 0 24px;
      background: #0a0a0a;
      color: #ffffff;
      font-family: system-ui, sans-serif;
    "
  >
    <h1>Spotify connected.</h1>

    <p>Granted scopes:</p>

    <pre
      style="
        padding: 16px;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        background: rgba(255,255,255,0.05);
      "
    >${safeScope}</pre>

    <p>
      Copy the refresh token below into
      <code>SPOTIFY_REFRESH_TOKEN</code>
      in both your local environment and Vercel.
    </p>

    <pre
      style="
        padding: 16px;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        background: rgba(255,255,255,0.05);
      "
    >${safeRefreshToken}</pre>

    <p>
      After updating the environment variable, return to
      <a
        href="${safeRedirect}"
        style="color: #ffffff;"
      >
        ${safeRedirect}
      </a>.
    </p>
  </body>
</html>`;

    const response = new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });

    response.cookies.set("spotify_oauth_state", "", {
      path: "/api/spotify/callback",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Spotify authorization failed";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}