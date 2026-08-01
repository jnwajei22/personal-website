type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

type SpotifyMethod = "GET" | "POST" | "PUT" | "DELETE";

type SpotifyRequestOptions = {
  method?: SpotifyMethod;
  body?: unknown;
};

type CachedAccessToken = {
  value: string;
  expiresAt: number;
};

let cachedAccessToken: CachedAccessToken | null = null;

function mustEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }

  return value;
}

export function getSpotifyConfig() {
  return {
    clientId: mustEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: mustEnv("SPOTIFY_CLIENT_SECRET"),
    redirectUri: mustEnv("SPOTIFY_REDIRECT_URI"),
    postAuthRedirect: process.env.SPOTIFY_POST_AUTH_REDIRECT || "/now",
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN || "",
    playlistId: process.env.SPOTIFY_PLAYLIST_ID || "",
  };
}

function basicAuthHeader(clientId: string, clientSecret: string) {
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  return `Basic ${encoded}`;
}

export async function exchangeCodeForToken(code: string) {
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Spotify token exchange failed: ${response.status} ${text}`,
    );
  }

  return (await response.json()) as TokenResponse;
}

export async function refreshAccessToken() {
  const { clientId, clientSecret, refreshToken } = getSpotifyConfig();

  if (!refreshToken) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Spotify refresh failed: ${response.status} ${text}`);
  }

  return (await response.json()) as TokenResponse;
}

async function getAccessToken(forceRefresh = false) {
  if (
    !forceRefresh &&
    cachedAccessToken !== null &&
    cachedAccessToken.expiresAt > Date.now()
  ) {
    return cachedAccessToken.value;
  }

  const token = await refreshAccessToken();

  cachedAccessToken = {
    value: token.access_token,
    expiresAt:
      Date.now() + Math.max(token.expires_in - 60, 0) * 1000,
  };

  return token.access_token;
}

async function spotifyRequest<T>(
  path: string,
  options: SpotifyRequestOptions = {},
  retryAfterUnauthorized = true,
): Promise<T | null> {
  const method = options.method ?? "GET";
  const accessToken = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    cache: "no-store",
  });

  // Spotify commonly returns 204 when an endpoint has no content.
  if (response.status === 204) {
    return null;
  }

  // Retry once with a freshly generated token.
  if (response.status === 401 && retryAfterUnauthorized) {
    cachedAccessToken = null;
    await getAccessToken(true);

    return spotifyRequest<T>(path, options, false);
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Spotify API error ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export function spotifyGet<T>(path: string) {
  return spotifyRequest<T>(path);
}

export function spotifyPost<T>(path: string, body?: unknown) {
  return spotifyRequest<T>(path, {
    method: "POST",
    body,
  });
}