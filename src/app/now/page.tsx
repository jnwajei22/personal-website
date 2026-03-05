// src/app/now/page.tsx
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/PageHeader";
import { PhotoCarouselRing } from "@/components/now/PhotoCarouselRing";
import { SpotifyLive } from "@/components/now/SpotifyLive";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "Mar 5, 2026";

const PHOTOS = [
  { src: "/now/now-photo-1.jpg", alt: "Photo 1", caption: "_____" },
  { src: "/now/now-photo-2.jpg", alt: "Photo 2", caption: "_____" },
  { src: "/now/now-photo-3.jpg", alt: "Photo 3", caption: "_____" },
  { src: "/now/now-photo-4.jpg", alt: "Photo 4", caption: "_____" },
];

export default function NowPage() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl">
        <PageHeader
          eyebrow="NOW"
          title="Now"
          lead={<>A snapshot of what I’m focused on right now — updated when something actually moves.</>}
          meta={<>Last updated: {LAST_UPDATED}</>}
        />

        {/* Current focus */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">Current focus</h2>

          {/* Accent block (NOT a card) */}
          <div className="space-y-3 border-l border-white/15 pl-5">
            <h3 className="text-lg font-semibold text-white">
              Current project: Carbon Fiber Scale Planes (YF-23 build)
            </h3>

            <p className="text-sm leading-relaxed text-white/70">
              I’m building large-scale aircraft models with a real fabrication pipeline: CAD cleanup,
              segmentation, alignment strategy, test coupons, and eventually carbon fiber layups. The
              goal is repeatable process, not just a cool shelf piece.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Milestones (updates only):</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                <li>✅ Repository structure created + documentation started.</li>
                <li>✅ Bottom YF-23 model segmented, converted to solid, and printed.</li>
                <li>🧱 In progress: upper body alignment + print planning.</li>
                <li>Next milestone: upper body test coupon print results logged + finalize alignment strategy per seam.</li>
              </ul>
            </div>

            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">Definition of “done” for this phase:</span>{" "}
              A full printable set of parts with reliable alignment, clean seams, and documented settings
              — ready for either assembly or mold planning.
            </p>
          </div>
        </section>

        <div className="mt-10 border-b border-white/10" />

        {/* Me now */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">Me now</h2>
          <p className="text-sm leading-relaxed text-white/70">
            A tiny visual dump of what life looks like lately.
          </p>

          <PhotoCarouselRing photos={PHOTOS} />

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-white">Where my head’s at</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
              <li>Stopping to smell the roses</li>
              <li>Being okay with imperfection the first time around</li>
              <li>Staying consistent regardless of motivation!</li>
            </ul>
          </div>
        </section>

        <div className="mt-10 border-b border-white/10" />

        {/* Spotify */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">What I’m listening to</h2>
          <p className="text-sm leading-relaxed text-white/70">
            This is live. If I’m playing something, you’ll see it here — along with what’s been in rotation.
          </p>

          <SpotifyLive />
        </section>

        {/* Contact button */}
        <div className="mt-12">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
          >
            Contact
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}