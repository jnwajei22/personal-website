// src\components\now\SpotifyGuestAdd.tsx
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

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="
        h-4 w-4 transition-transform duration-300
        group-hover/button:translate-x-1
      "
    >
      <path
        d="M4 10h12M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpotifyGuestAdd({
  onAdded,
}: SpotifyGuestAddProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingUri, setAddingUri] = useState<string | null>(
    null,
  );
  const [addedUri, setAddedUri] = useState<string | null>(
    null,
  );
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
        `/api/spotify/search?q=${encodeURIComponent(
          cleanedQuery,
        )}`,
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as SearchResponse;

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

      const response = await fetch(
        "/api/spotify/playlist/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uri: track.uri,
          }),
        },
      );

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
    <article
      className="
        group relative flex min-w-0 flex-col
        overflow-hidden rounded-[28px]
        border border-black/10 bg-white/80 p-7
        shadow-[0_12px_40px_rgba(0,0,0,0.04)]
        backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-violet-400/40
        hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]
        dark:border-white/10 dark:bg-zinc-950/75
        dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]
        dark:hover:border-violet-400/35
        md:h-[586px]
      "
    >
      {/* Colored top edge */}
      <div
        className="
          absolute inset-x-8 top-0 h-px
          bg-gradient-to-r from-violet-400
          via-fuchsia-400 to-transparent
          opacity-70 transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* Ambient glow */}
      <div
        className="
          pointer-events-none absolute -right-20 -top-20
          h-48 w-48 rounded-full bg-violet-400/10
          blur-3xl transition-all duration-500
          group-hover:scale-125
          group-hover:bg-violet-400/15
          dark:bg-violet-400/[0.07]
        "
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
          className="
            rounded-full border border-emerald-400/30
            bg-emerald-400/10 px-3 py-1
            text-[10px] font-bold uppercase
            tracking-[0.14em] text-emerald-700
            dark:text-emerald-300
          "
        >
          Open
        </span>

        <span
          className="
            hidden rounded-full border
            border-violet-400/20 bg-violet-400/10
            px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.12em]
            text-violet-700 sm:inline-flex
            dark:text-violet-300
          "
        >
          Guest playlist
        </span>
      </div>

      {/* Content */}
      <div className="relative mt-6">
        <h3
          className="
            max-w-[90%] text-2xl font-semibold
            tracking-[-0.035em] text-zinc-950
            transition-transform duration-300
            group-hover:translate-x-0.5
            dark:text-white
          "
        >
          Leave a song behind.
        </h3>

        <p
          className="
            mt-3 text-sm leading-6
            text-zinc-600 dark:text-zinc-400
          "
        >
          Search for a track or paste a Spotify link.
          Your contribution gets added directly to Trail Mix.
        </p>
      </div>

      {/* Search */}
      <form
        className="relative mt-6 shrink-0"
        onSubmit={(event) => {
          event.preventDefault();

          if (!searching) {
            void search();
          }
        }}
      >
        <label
          htmlFor="spotify-track-search"
          className="
            text-[10px] font-semibold uppercase
            tracking-[0.16em] text-zinc-400
            dark:text-zinc-600
          "
        >
          Find a track
        </label>

        <input
          id="spotify-track-search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;

            setQuery(nextQuery);

            if (!nextQuery.trim()) {
              setResults([]);
              setMessage(null);
            }
          }}
          placeholder="Song, artist, or Spotify link"
          className="
            mt-2 h-12 w-full min-w-0 rounded-2xl
            border border-black/10 bg-black/[0.025]
            px-4 text-sm text-zinc-950 outline-none
            transition-all duration-200
            placeholder:text-zinc-400
            focus:border-violet-400/50
            focus:bg-black/[0.04]
            focus:ring-4 focus:ring-violet-400/10
            dark:border-white/10 dark:bg-white/[0.04]
            dark:text-white dark:placeholder:text-white/35
            dark:focus:border-violet-400/50
            dark:focus:bg-white/[0.06]
          "
        />

        <button
          type="submit"
          disabled={searching}
          className="
            group/button mt-3 inline-flex h-12 w-full
            items-center justify-between rounded-2xl
            bg-zinc-950 px-5 text-sm font-semibold
            text-white transition-all duration-200
            hover:bg-zinc-800 active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:bg-white dark:text-black
            dark:hover:bg-zinc-200
          "
        >
          <span>
            {searching ? "Searching…" : "Search Spotify"}
          </span>

          <ArrowIcon />
        </button>
      </form>

      {/* Flexible lower panel */}
      <div className="relative mt-5 flex min-h-0 flex-1 flex-col">
        {/* Result message */}
        {message ? (
          <p
            aria-live="polite"
            className={`
              shrink-0 rounded-2xl border px-4 py-3
              text-sm leading-6
              ${
                message.type === "success"
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-800 dark:text-emerald-200"
                  : "border-rose-400/25 bg-rose-400/10 text-rose-800 dark:text-rose-200"
              }
            `}
          >
            {message.text}
          </p>
        ) : null}

        {results.length ? (
          /* Results use the remaining card space */
          <ul
            className={`
              spotify-results-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto
              overscroll-contain pr-1
              ${message ? "mt-3" : ""}
            `}
          >
            {results.map((track) => {
              const isAdding = addingUri === track.uri;
              const wasAdded = addedUri === track.uri;

              return (
                <li
                  key={track.id}
                  className="
                    rounded-2xl border border-black/[0.08]
                    bg-black/[0.02] p-3
                    transition-all duration-200
                    hover:border-violet-400/25
                    hover:bg-black/[0.035]
                    dark:border-white/10
                    dark:bg-white/[0.025]
                    dark:hover:border-violet-400/25
                    dark:hover:bg-white/[0.05]
                  "
                >
                  <div
                    className="
                      grid min-w-0
                      grid-cols-[48px_minmax(0,1fr)_auto]
                      items-start gap-3
                    "
                  >
                    <a
                      href={track.spotifyUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${track.name} in Spotify`}
                      className="
                        mt-0.5 h-12 w-12 shrink-0
                        overflow-hidden rounded-xl
                        border border-black/10 bg-black/[0.03]
                        dark:border-white/10
                        dark:bg-white/[0.04]
                      "
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

                    <div className="min-w-0 overflow-hidden">
                      <a
                        href={track.spotifyUrl ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        title={track.name}
                        className="
                          flex min-w-0 items-center gap-1.5
                          text-sm font-medium text-zinc-900
                          hover:text-black
                          dark:text-white/90
                          dark:hover:text-white
                        "
                      >
                        <span className="min-w-0 truncate">
                          {track.name}
                        </span>

                        {track.explicit ? (
                          <span
                            className="
                              shrink-0 rounded border
                              border-black/10 px-1
                              text-[9px] text-zinc-400
                              dark:border-white/10
                              dark:text-white/40
                            "
                          >
                            E
                          </span>
                        ) : null}
                      </a>

                      <p
                        title={`${track.artist} · ${track.album}`}
                        className="
                          mt-1 truncate text-xs
                          text-zinc-500 dark:text-white/55
                        "
                      >
                        {track.artist}
                        <span className="text-zinc-300 dark:text-white/30">
                          {" "}
                          ·
                          {" "}
                        </span>
                        {track.album}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="text-xs text-zinc-400 dark:text-white/40">
                        {formatDuration(track.durationMs)}
                      </span>

                      <button
                        type="button"
                        onClick={() => void addTrack(track)}
                        disabled={
                          Boolean(addingUri) ||
                          Boolean(addedUri)
                        }
                        className={`
                          inline-flex h-9 items-center
                          justify-center rounded-xl border
                          px-3.5 text-xs font-medium
                          transition-all duration-200
                          disabled:cursor-not-allowed
                          disabled:opacity-45
                          ${
                            wasAdded
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                              : "border-black/10 bg-white text-zinc-800 hover:-translate-y-0.5 hover:border-black/20 hover:text-black dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.08]"
                          }
                        `}
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
        ) : (
          /* Default lower-card content */
          <>
            <div
              className={`
                shrink-0 border-t border-black/[0.06]
                pt-4 dark:border-white/[0.07]
                ${message ? "mt-4" : ""}
              `}
            >
              <p
                className="
                  text-[10px] font-semibold uppercase
                  tracking-[0.16em] text-zinc-400
                  dark:text-zinc-600
                "
              >
                Contribution limit
              </p>

              <p className="mt-1.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                One public addition per visitor each day.
                Spotify track links work too.
              </p>
            </div>

            <p
              className="
                mt-auto pt-6 text-xs leading-5
                text-zinc-400 dark:text-zinc-600
              "
            >
              Tracks and artwork link back to Spotify. Guest
              additions are public.
            </p>
          </>
        )}
      </div>
    </article>
  );
}