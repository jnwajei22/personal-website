// src/components/now/SpotifyGuestAdd.tsx
"use client";

import { useState } from "react";

type SearchTrack = {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  spotifyUrl: string | null;
  durationMs: number;
  explicit: boolean;
};

type SearchResponse = {
  items?: SearchTrack[];
  error?: string;
};

type AddResponse = {
  added?: boolean;
  error?: string;
};

type SpotifyGuestAddProps = {
  onAdded?: () => void;
};

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifyGuestAdd({
  onAdded,
}: SpotifyGuestAddProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingUri, setAddingUri] = useState<string | null>(null);
  const [addedUri, setAddedUri] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const search = async () => {
    const cleanedQuery = query.trim();

    if (cleanedQuery.length < 2) {
      setMessage({
        type: "error",
        text: "Enter a song, artist, or Spotify track link.",
      });
      return;
    }

    try {
      setSearching(true);
      setMessage(null);
      setResults([]);

      const response = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(cleanedQuery)}`,
        {
          cache: "no-store",
        },
      );

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search failed.");
      }

      const items = data.items ?? [];

      setResults(items);

      if (!items.length) {
        setMessage({
          type: "error",
          text: "Spotify did not find a matching track.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Spotify search failed.",
      });
    } finally {
      setSearching(false);
    }
  };

  const addTrack = async (track: SearchTrack) => {
    try {
      setAddingUri(track.uri);
      setMessage(null);

      const response = await fetch("/api/spotify/playlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uri: track.uri,
        }),
      });

      const data = (await response.json()) as AddResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "The track could not be added.",
        );
      }

      setAddedUri(track.uri);
      setMessage({
        type: "success",
        text: `"${track.name}" was added to Trail Mix.`,
      });

      onAdded?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "The track could not be added.",
      });
    } finally {
      setAddingUri(null);
    }
  };

  return (
    <div className="min-w-0 overflow-hidden p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Guest contribution
        </p>

        <h3 className="text-xl font-semibold tracking-tight text-white">
          Leave a song behind.
        </h3>

        <p className="text-sm leading-relaxed text-white/65">
          Search for a track or paste a Spotify link. One addition
          per visitor each day.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="spotify-track-search"
          className="text-sm font-medium text-white"
        >
          Find a track
        </label>

        <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            id="spotify-track-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !searching) {
                void search();
              }
            }}
            placeholder="Song, artist, or Spotify link"
            className="h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35"
          />

          <button
            type="button"
            onClick={() => void search()}
            disabled={searching}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </div>

        <p className="mt-2 text-xs text-white/45">
          Spotify links work too.
        </p>
      </div>

      {results.length ? (
        <ul className="mt-5 min-w-0 space-y-2">
          {results.map((track) => {
            const isAdding = addingUri === track.uri;
            const wasAdded = addedUri === track.uri;

            return (
              <li
                key={track.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)_auto] items-start gap-3">
                  <a
                    href={track.spotifyUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${track.name} in Spotify`}
                    className="mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
                  >
                    {track.albumArtUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.albumArtUrl}
                        alt={`${track.album} cover`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </a>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <a
                      href={track.spotifyUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      title={track.name}
                      className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
                    >
                      <span className="min-w-0 truncate">
                        {track.name}
                      </span>

                      {track.explicit ? (
                        <span className="shrink-0 text-[10px] text-white/40">
                          E
                        </span>
                      ) : null}
                    </a>

                    <p
                      title={`${track.artist} · ${track.album}`}
                      className="mt-1 truncate text-xs text-white/55"
                    >
                      {track.artist}
                      <span className="text-white/30"> · </span>
                      {track.album}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-xs text-white/40">
                      {formatDuration(track.durationMs)}
                    </span>

                    <button
                      type="button"
                      onClick={() => void addTrack(track)}
                      disabled={
                        Boolean(addingUri) || Boolean(addedUri)
                      }
                      className={`inline-flex h-9 items-center justify-center rounded-xl border px-3.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${
                        wasAdded
                          ? "border-blue-500/30 bg-blue-500/15 text-blue-200"
                          : "border-white/15 bg-white/[0.02] text-white hover:border-white/35 hover:bg-white/[0.07]"
                      }`}
                    >
                      {wasAdded
                        ? "Added"
                        : isAdding
                          ? "Adding…"
                          : "Add"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {message ? (
        <p
          aria-live="polite"
          className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
            message.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-200"
              : "border-red-500/20 bg-red-500/10 text-red-200"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-white/40">
        Tracks and artwork link back to Spotify. Guest additions
        are public.
      </p>
    </div>
  );
}