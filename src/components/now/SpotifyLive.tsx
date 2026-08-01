// src/components/now/SpotifyLive.tsx
"use client";

import { useEffect, useState } from "react";
import { SpotifyGuestAdd } from "@/components/now/SpotifyGuestAdd";
import { SpotifyPlaylistEmbed } from "@/components/now/SpotifyPlaylistEmbed";

type NowPlaying = {
  isPlaying: boolean;
  track?: string;
  artist?: string;
  albumArtUrl?: string | null;
  songUrl?: string;
};

type RecentTrack = {
  track: string;
  artist: string;
  songUrl?: string;
  albumArtUrl?: string | null;
  playedAt?: string;
};

function timeAgo(iso?: string) {
  if (!iso) return "";

  const timestamp = new Date(iso).getTime();

  if (Number.isNaN(timestamp)) return "";

  const difference = Date.now() - timestamp;
  const minutes = Math.floor(difference / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

async function fetchSpotifyData<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = (await response.json()) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error || `${url} is unavailable`,
    );
  }

  return data;
}

export function SpotifyLive() {
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [recent, setRecent] = useState<
    RecentTrack[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlistRevision, setPlaylistRevision] =
    useState(0);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const [nowResult, recentResult] =
        await Promise.allSettled([
          fetchSpotifyData<NowPlaying>(
            "/api/spotify/now-playing",
          ),
          fetchSpotifyData<RecentTrack[]>(
            "/api/spotify/recent",
          ),
        ]);

      if (!alive) return;

      const errors: string[] = [];

      if (nowResult.status === "fulfilled") {
        setNow(nowResult.value);
      } else {
        errors.push(nowResult.reason.message);
      }

      if (recentResult.status === "fulfilled") {
        setRecent(recentResult.value);
      } else {
        errors.push(recentResult.reason.message);
      }

      setError(errors[0] ?? null);
      setLoading(false);
    };

    void load();

    const intervalId = window.setInterval(() => {
      void load();
    }, 15_000);

    return () => {
      alive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const currentlyPlaying =
    now?.isPlaying && now.track;

  const heroArt =
    now?.albumArtUrl ??
    recent?.[0]?.albumArtUrl ??
    null;

  const playlistEmbedUrl =
    "https://open.spotify.com/embed/playlist/2VEh5Fq68yP0RBHFSwiF16?utm_source=generator";

  return (
    <div className="space-y-7">
      {error ? (
        <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100/80">
          Part of the live Spotify feed is unavailable. Guest
          additions may still work.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="grid min-w-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Live panel */}
          <div className="min-w-0 border-b border-white/10 p-5 sm:p-6 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Now playing
              </p>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/55">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${currentlyPlaying
                      ? "bg-green-400"
                      : "bg-white/30"
                    }`}
                />
                Live
              </span>
            </div>

            <div className="mt-5 aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              {heroArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroArt}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/20">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-16 w-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M9 18V5l11-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="17" cy="16" r="3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="mt-5 min-w-0">
              <p className="break-words text-lg font-semibold leading-snug text-white">
                {loading
                  ? "Checking Spotify…"
                  : currentlyPlaying
                    ? now.track
                    : "Nothing playing right now."}
              </p>

              {currentlyPlaying && now.artist ? (
                <p className="mt-1 break-words text-sm leading-relaxed text-white/60">
                  {now.artist}
                </p>
              ) : null}

              {currentlyPlaying && now.songUrl ? (
                <a
                  href={now.songUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.03] px-4 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/[0.07]"
                >
                  Open in Spotify
                  <span aria-hidden="true" className="ml-1.5">
                    ↗
                  </span>
                </a>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-white/40">
                  Press play and the site becomes a very specific billboard.
                </p>
              )}
            </div>
          </div>

          <SpotifyGuestAdd
            onAdded={() => {
              setPlaylistRevision(
                (revision) => revision + 1,
              );
            }}
          />
        </div>
      </div>

      {/* Recent rotation */}
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Recent rotation
            </h3>

            <p className="mt-1 text-xs text-white/45">
              Updated about every 15 seconds.
            </p>
          </div>
        </div>

        {recent?.length ? (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {recent.slice(0, 6).map((track, index) => (
              <li
                key={
                  track.songUrl ??
                  `${track.track}-${track.playedAt}-${index}`
                }
                className="py-3"
              >
                <div className="flex items-center gap-3">
                  <a
                    href={track.songUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]"
                  >
                    {track.albumArtUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.albumArtUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </a>

                  <div className="min-w-0 flex-1">
                    {track.songUrl ? (
                      <a
                        href={track.songUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-sm text-white/85 hover:text-white"
                      >
                        {track.track}
                      </a>
                    ) : (
                      <p className="truncate text-sm text-white/85">
                        {track.track}
                      </p>
                    )}

                    <p className="mt-1 truncate text-xs text-white/55">
                      {track.artist}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs text-white/35">
                    {timeAgo(track.playedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : loading ? (
          <p className="text-sm text-white/50">
            Loading recent tracks…
          </p>
        ) : (
          <p className="text-sm text-white/50">
            Nothing in the recent list yet.
          </p>
        )}
      </div>

      <div className="h-px bg-white/10" />

      <SpotifyPlaylistEmbed
        key={playlistRevision}
        embedUrl={playlistEmbedUrl}
      />
    </div>
  );
}