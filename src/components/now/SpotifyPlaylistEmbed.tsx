// src/components/now/SpotifyPlaylistEmbed.tsx
export function SpotifyPlaylistEmbed({
  embedUrl,
}: {
  embedUrl: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-white">
          Trail Mix
        </p>

        <p className="mt-1 text-sm leading-relaxed text-white/65">
          The community playlist. Follow it, steal songs,
          or leave one behind above.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <iframe
          title="Trail Mix playlist"
          src={embedUrl}
          width="100%"
          height="352"
          style={{ borderRadius: 12 }}
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}