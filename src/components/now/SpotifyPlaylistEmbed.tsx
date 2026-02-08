// src/components/now/SpotifyPlaylistEmbed.tsx
export function SpotifyPlaylistEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="mt-6 space-y-2">
      <div>
        <p className="text-sm font-semibold">Community playlist</p>
        <p className="mt-1 text-sm text-white/70">
          Follow it, steal songs, leave a trail. Thanks for stopping by!
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
