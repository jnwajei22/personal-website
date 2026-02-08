"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

type Photo = { src: string; alt: string };

export function PhotoCarouselRing({ photos }: { photos: Photo[] }) {
  const n = photos.length;
  const [index, setIndex] = useState(0);

  const clamp = useCallback((i: number) => (n ? (i % n + n) % n : 0), [n]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (!n) {
    return (
      <div className="h-64 w-full rounded-2xl border border-white/10 bg-white/[0.02]" />
    );
  }

  const w = 760;
  const aspect = "760 / 340";

  const VISIBLE_RANGE = 2;
  const SPACING = 240;
  const TILT = 28;
  const DEPTH = 180;
  const SCALE_STEP = 0.07;

  const rel = useCallback(
    (i: number) => {
      let d = i - index;
      const half = Math.floor(n / 2);
      if (d > half) d -= n;
      if (d < -half) d += n;
      return d;
    },
    [index, n]
  );

  return (
    <div className="space-y-4">
      <div className="relative h-[560px] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-28 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-28 bg-gradient-to-l from-black to-transparent" />

        <div className="absolute inset-0 [perspective:1100px]">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: w,
              aspectRatio: aspect,
              transformStyle: "preserve-3d",
              transform: "translate(-50%, -50%)",
            }}
          >
            {photos.map((p, i) => {
              const d = rel(i);
              const isActive = d === 0;
              const isVisible = Math.abs(d) <= VISIBLE_RANGE;

              const x = d * SPACING;
              const y = Math.abs(d) * 10;
              const rotY = -d * TILT;
              const z = -Math.abs(d) * DEPTH;
              const scale = 1 - Math.abs(d) * SCALE_STEP;

              const opacity =
                Math.abs(d) === 0 ? 1 : Math.abs(d) === 1 ? 0.55 : 0.35;

              // blur can be a little poppy; keep it light
              const blur =
                Math.abs(d) === 0 ? "none" : Math.abs(d) === 1 ? "blur(0.6px)" : "blur(1.1px)";

              return (
                <button
                  key={i} // ✅ stable key so transitions actually happen
                  type="button"
                  onClick={() => setIndex(i)}
                  className="absolute left-1/2 top-1/2 outline-none"
                  style={{
                    width: w,
                    aspectRatio: aspect,
                    transformStyle: "preserve-3d",
                    transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
                    borderRadius: 20,
                    overflow: "hidden",
                    backfaceVisibility: "hidden",
                    transition:
                      "transform 650ms cubic-bezier(.2,.8,.2,1), opacity 350ms ease, filter 350ms ease",
                    opacity,
                    filter: blur,
                    zIndex: 50 - Math.abs(d),

                    // ✅ hide far slides without unmounting (keeps animation smooth)
                    pointerEvents: isVisible ? "auto" : "none",
                    visibility: isVisible ? "visible" : "hidden",
                  }}
                >
                  <div
                    className="relative h-full w-full"
                    style={{
                      boxShadow: isActive
                        ? "0 30px 90px rgba(0,0,0,0.65)"
                        : "0 10px 40px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/80 hover:bg-white/[0.06]"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                "h-1.5 w-1.5 rounded-full",
                i === index ? "bg-white/70" : "bg-white/20 hover:bg-white/35",
              ].join(" ")}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/80 hover:bg-white/[0.06]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
