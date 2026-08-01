// src\components\now\SpotifyLive.tsx
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
    throw new Error(data.error || `${url} is unavailable`);
  }

  return data;
}

function ExternalArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="
        h-4 w-4 transition-transform duration-300
        group-hover/button:-translate-y-0.5
        group-hover/button:translate-x-0.5
      "
    >
      <path
        d="M6 14 14 6M8 6h6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpotifyLive() {
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [recent, setRecent] = useState<RecentTrack[] | null>(
    null,
  );
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

  const currentlyPlaying = Boolean(
    now?.isPlaying && now.track,
  );

  const playbackState = loading
    ? "loading"
    : currentlyPlaying
      ? "live"
      : "offline";

  const playbackThemes = {
    loading: {
      card:
        "hover:border-zinc-400/40 dark:hover:border-zinc-400/35",
      accent:
        "from-zinc-400 via-zinc-500 to-transparent",
      glow:
        "bg-zinc-400/10 group-hover:bg-zinc-400/15 dark:bg-zinc-400/[0.07]",
      status:
        "border-zinc-400/30 bg-zinc-400/10 text-zinc-600 dark:text-zinc-300",
      marker:
        "border-zinc-400/20 bg-zinc-400/10 text-zinc-600 dark:text-zinc-300",
      dot: "bg-zinc-400",
      statusText: "Checking",
      markerText: "Spotify",
    },
    live: {
      card:
        "hover:border-emerald-400/40 dark:hover:border-emerald-400/35",
      accent:
        "from-emerald-400 via-cyan-400 to-transparent",
      glow:
        "bg-emerald-400/10 group-hover:bg-emerald-400/15 dark:bg-emerald-400/[0.07]",
      status:
        "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
      marker:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
      dot:
        "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      statusText: "Live",
      markerText: "Now playing",
    },
    offline: {
      card:
        "hover:border-rose-400/40 dark:hover:border-rose-400/35",
      accent:
        "from-rose-400 via-red-400 to-transparent",
      glow:
        "bg-rose-400/10 group-hover:bg-rose-400/15 dark:bg-rose-400/[0.07]",
      status:
        "border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-300",
      marker:
        "border-rose-400/20 bg-rose-400/10 text-rose-700 dark:text-rose-300",
      dot:
        "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]",
      statusText: "Offline",
      markerText: "Not playing",
    },
  } as const;

  const playbackTheme = playbackThemes[playbackState];

  const heroArt =
    now?.albumArtUrl ??
    recent?.[0]?.albumArtUrl ??
    null;

  const playlistEmbedUrl =
    "https://open.spotify.com/embed/playlist/2VEh5Fq68yP0RBHFSwiF16?utm_source=generator";

  return (
    <div className="space-y-8">
      {error ? (
        <p
          className="
            rounded-2xl border border-amber-400/25
            bg-amber-400/10 px-4 py-3 text-sm
            text-amber-800 dark:text-amber-200
          "
        >
          Part of the live Spotify feed is unavailable.
          Guest additions may still work.
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        {/* Now playing card */}
        <article
          className={`
            group relative flex min-w-0 flex-col
            overflow-hidden rounded-[28px]
            border border-black/10 bg-white/80 p-7
            shadow-[0_12px_40px_rgba(0,0,0,0.04)]
            backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]
            dark:border-white/10 dark:bg-zinc-950/75
            dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]
            md:h-[586px]
            ${playbackTheme.card}
          `}
        >
          {/* Colored top edge */}
          <div
            className={`
              absolute inset-x-8 top-0 h-px
              bg-gradient-to-r
              opacity-70 transition-opacity duration-300
              group-hover:opacity-100
              ${playbackTheme.accent}
            `}
          />

          {/* Ambient glow */}
          <div
            className={`
              pointer-events-none absolute -right-20 -top-20
              h-48 w-48 rounded-full blur-3xl
              transition-all duration-500
              group-hover:scale-125
              ${playbackTheme.glow}
            `}
          />

          {/* Dot matrix */}
          <div
            aria-hidden="true"
            className="
              absolute right-7 top-7 grid grid-cols-3 gap-1.5
              opacity-20 transition-opacity duration-300
              group-hover:opacity-40
            "
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-current"
              />
            ))}
          </div>

          {/* Metadata */}
          <div className="relative flex min-h-8 items-center gap-2 pr-16">
            <span
              className={`
                inline-flex items-center gap-2 rounded-full
                border px-3 py-1 text-[10px] font-bold
                uppercase tracking-[0.14em]
                ${playbackTheme.status}
              `}
            >
              <span
                className={`
                  h-1.5 w-1.5 rounded-full
                  ${playbackTheme.dot}
                `}
              />

              {playbackTheme.statusText}
            </span>

            <span
              className={`
                hidden rounded-full border px-3 py-1
                text-[10px] font-semibold uppercase
                tracking-[0.12em] sm:inline-flex
                ${playbackTheme.marker}
              `}
            >
              {playbackTheme.markerText}
            </span>
          </div>

          {/* Album artwork */}
          <div
            className="
              relative mt-6 aspect-square w-full
              max-w-[230px] overflow-hidden rounded-2xl
              border border-black/10 bg-black/[0.03]
              shadow-[0_12px_30px_rgba(0,0,0,0.10)]
              dark:border-white/10 dark:bg-white/[0.04]
              dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]
            "
          >
            {heroArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroArt}
                alt=""
                className="
                  h-full w-full object-cover
                  transition-transform duration-500
                  group-hover:scale-[1.02]
                "
              />
            ) : (
              <div
                className="
                  flex h-full items-center justify-center
                  text-zinc-300 dark:text-white/20
                "
              >
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

          {/* Track information */}
          <div className="relative mt-6 min-w-0">
            <h3
              className="
                break-words text-2xl font-semibold
                tracking-[-0.035em] text-zinc-950
                transition-transform duration-300
                group-hover:translate-x-0.5
                dark:text-white
              "
            >
              {loading
                ? "Checking Spotify…"
                : currentlyPlaying
                  ? now?.track
                  : "Nothing playing right now."}
            </h3>

            {currentlyPlaying && now?.artist ? (
              <p
                className="
                  mt-2 break-words text-sm leading-6
                  text-zinc-600 dark:text-zinc-400
                "
              >
                {now.artist}
              </p>
            ) : (
              <p
                className="
                  mt-3 text-sm leading-6
                  text-zinc-500 dark:text-zinc-500
                "
              >
                Press play and the site becomes a very
                specific billboard.
              </p>
            )}
          </div>

          {/* Tags
          <div className="relative mt-6 flex flex-wrap gap-2">
            <span
              className="
                rounded-full border border-emerald-500/20
                bg-emerald-500/8 px-2.5 py-1
                text-[11px] font-medium text-emerald-700
                transition-transform duration-200
                group-hover:-translate-y-px
                dark:text-emerald-300
              "
            >
              Spotify
            </span>

            <span
              className="
                rounded-full border border-sky-500/20
                bg-sky-500/8 px-2.5 py-1
                text-[11px] font-medium text-sky-700
                transition-transform duration-200
                group-hover:-translate-y-px
                dark:text-sky-300
              "
            >
              Live feed
            </span>
          </div> */}

          {/* Feed information */}
          <div
            className="
              relative mt-5 border-t border-black/[0.06]
              pt-4 dark:border-white/[0.07]
            "
          >
            <p
              className="
                text-[10px] font-semibold uppercase
                tracking-[0.16em] text-zinc-400
                dark:text-zinc-600
              "
            >
              Refresh
            </p>

            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Spotify activity updates about every 15 seconds.
            </p>
          </div>

          {/* Action */}
          <div className="relative mt-auto pt-7">
            {currentlyPlaying && now?.songUrl ? (
              <a
                href={now.songUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  group/button inline-flex h-12 w-full
                  items-center justify-between rounded-2xl
                  bg-zinc-950 px-5 text-sm font-semibold
                  text-white transition-all duration-200
                  hover:bg-zinc-800 active:scale-[0.98]
                  dark:bg-white dark:text-black
                  dark:hover:bg-zinc-200
                "
              >
                <span>Open in Spotify</span>
                <ExternalArrowIcon />
              </a>
            ) : (
              <span
                className="
                  inline-flex h-12 w-full items-center
                  justify-center rounded-2xl border
                  border-dashed border-black/10
                  text-sm font-medium text-zinc-400
                  dark:border-white/10 dark:text-zinc-600
                "
              >
                Waiting for playback
              </span>
            )}
          </div>
        </article>

        <SpotifyGuestAdd
          onAdded={() => {
            setPlaylistRevision(
              (revision) => revision + 1,
            );
          }}
        />
      </div>

      {/* Recent rotation */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Recent rotation
          </h3>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            Updated about every 15 seconds.
          </p>
        </div>

        {recent?.length ? (
          <ul
            className="
              divide-y divide-black/[0.07]
              border-y border-black/[0.07]
              dark:divide-white/10 dark:border-white/10
            "
          >
            {recent.slice(0, 6).map((track, index) => (
              <li
                key={
                  track.songUrl ??
                  `${track.track}-${track.playedAt}-${index}`
                }
                className="
                  py-3 transition-colors duration-200
                  hover:bg-black/[0.015]
                  dark:hover:bg-white/[0.015]
                "
              >
                <div className="flex items-center gap-3">
                  {track.songUrl ? (
                    <a
                      href={track.songUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        h-10 w-10 shrink-0 overflow-hidden
                        rounded-lg border border-black/10
                        bg-black/[0.03]
                        dark:border-white/10
                        dark:bg-white/[0.04]
                      "
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
                  ) : (
                    <div
                      className="
                        h-10 w-10 shrink-0 overflow-hidden
                        rounded-lg border border-black/10
                        bg-black/[0.03]
                        dark:border-white/10
                        dark:bg-white/[0.04]
                      "
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
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {track.songUrl ? (
                      <a
                        href={track.songUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          block truncate text-sm text-zinc-800
                          transition-colors hover:text-black
                          dark:text-white/85 dark:hover:text-white
                        "
                      >
                        {track.track}
                      </a>
                    ) : (
                      <p className="truncate text-sm text-zinc-800 dark:text-white/85">
                        {track.track}
                      </p>
                    )}

                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-white/55">
                      {track.artist}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs text-zinc-400 dark:text-white/35">
                    {timeAgo(track.playedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : loading ? (
          <p className="text-sm text-zinc-500 dark:text-white/50">
            Loading recent tracks…
          </p>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-white/50">
            Nothing in the recent list yet.
          </p>
        )}
      </div>

      <div className="h-px bg-black/[0.08] dark:bg-white/10" />

      <SpotifyPlaylistEmbed
        key={playlistRevision}
        embedUrl={playlistEmbedUrl}
      />
    </div>
  );
}