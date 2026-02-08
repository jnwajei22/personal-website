// src/components/now/SpotifyLive.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;

  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function SpotifyLive() {
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [recent, setRecent] = useState<RecentTrack[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasData = useMemo(() => !!now || !!recent, [now, recent]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setError(null);

        const [a, b] = await Promise.all([
          fetch("/api/spotify/now-playing", { cache: "no-store" }),
          fetch("/api/spotify/recent", { cache: "no-store" }),
        ]);

        if (!alive) return;

        if (!a.ok) throw new Error("now-playing endpoint not ready");
        if (!b.ok) throw new Error("recent endpoint not ready");

        setNow((await a.json()) as NowPlaying);
        setRecent((await b.json()) as RecentTrack[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Spotify data unavailable");
      }
    };

    load();
    const id = setInterval(load, 15_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!hasData && error) {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        Spotify isn’t available right now. ({error})
      </p>
    );
  }

  const nowTitle =
    now?.isPlaying && now.track ? `${now.track}` : "Nothing playing right now.";
  const nowSubtitle = now?.isPlaying && now.artist ? now.artist : "";

  const PLAYLIST_EMBED_URL =
    "https://open.spotify.com/embed/playlist/2VEh5Fq68yP0RBHFSwiF16?utm_source=generator";


  return (
    <div className="space-y-6">
      {/* Top row: Now playing */}
      <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Now playing</p>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/60">
              Live
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
              {now?.albumArtUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={now.albumArtUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm text-white/85">
                {now?.isPlaying && now.songUrl ? (
                  <a
                    className="underline underline-offset-4 hover:text-white"
                    href={now.songUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {nowTitle}
                  </a>
                ) : (
                  nowTitle
                )}
              </p>

              {nowSubtitle ? (
                <p className="mt-1 truncate text-xs text-white/60">{nowSubtitle}</p>
              ) : null}

              {!now?.isPlaying ? (
                <p className="mt-2 text-xs text-white/45">
                  (Pro tip: press play and my site becomes a billboard.)
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-2 md:pt-6">
          <p className="text-sm text-white/70">
            Live pull from Spotify — now playing + recent rotation.
          </p>
          <div className="h-px w-full bg-white/10" />
          <p className="text-xs text-white/50">Updated about every 15 seconds.</p>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Recent */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Recent rotation</p>

        {recent && recent.length ? (
          <ul className="divide-y divide-white/10">
            {recent.slice(0, 8).map((t, i) => (
              <li key={i} className="py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                    {t.albumArtUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.albumArtUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/85">
                      {t.songUrl ? (
                        <a
                          className="underline underline-offset-4 hover:text-white"
                          href={t.songUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.track}
                        </a>
                      ) : (
                        t.track
                      )}
                    </p>
                    <p className="mt-1 truncate text-xs text-white/60">{t.artist}</p>
                  </div>

                  <div className="shrink-0 text-xs text-white/45">
                    {timeAgo(t.playedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/60">Nothing in the recent list yet.</p>
        )}
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Playlist trail */}
      <SpotifyPlaylistEmbed embedUrl={PLAYLIST_EMBED_URL} />
    </div>
  );
}
