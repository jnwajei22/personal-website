// src/lib/spotify.ts
type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function getSpotifyConfig() {
  return {
    clientId: mustEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: mustEnv("SPOTIFY_CLIENT_SECRET"),
    redirectUri: mustEnv("SPOTIFY_REDIRECT_URI"),
    postAuthRedirect: process.env.SPOTIFY_POST_AUTH_REDIRECT || "/now",
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN || "",
  };
}

function basicAuthHeader(clientId: string, clientSecret: string) {
  const b64 = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${b64}`;
}

export async function exchangeCodeForToken(code: string) {
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify token exchange failed: ${res.status} ${txt}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function refreshAccessToken() {
  const { clientId, clientSecret, refreshToken } = getSpotifyConfig();
  if (!refreshToken) throw new Error("Missing SPOTIFY_REFRESH_TOKEN");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify refresh failed: ${res.status} ${txt}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function spotifyGet<T>(path: string) {
  const token = await refreshAccessToken();

  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: "no-store",
  });

  // currently-playing often returns 204 when nothing is playing
  if (res.status === 204) return null as T | null;

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${txt}`);
  }

  return (await res.json()) as T;
}
