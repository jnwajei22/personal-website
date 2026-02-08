// src/app/now/page.tsx
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/PageHeader";
import { PhotoCarouselRing } from "@/components/now/PhotoCarouselRing";
import { SpotifyLive } from "@/components/now/SpotifyLive";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "Feb 5, 2026";

const PHOTOS = [
  { src: "/now/photo-1.jpg", alt: "Photo 1", caption: "_____" },
  { src: "/now/photo-2.jpg", alt: "Photo 2", caption: "_____" },
  { src: "/now/photo-3.jpg", alt: "Photo 3", caption: "_____" },
  { src: "/now/photo-4.jpg", alt: "Photo 4", caption: "_____" },
  { src: "/now/photo-4.jpg", alt: "Photo 4", caption: "_____" },
];

export default function NowPage() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl">
        <PageHeader
          eyebrow="NOW"
          title="Now"
          lead={
            <>A snapshot of what I’m focused on right now — updated when something actually moves.</>
          }
          meta={<>Last updated: {LAST_UPDATED}</>}
        />

        {/* Current focus */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">Current focus</h2>

          {/* Accent block (NOT a card) */}
          <div className="space-y-3 border-l border-white/15 pl-5">
            <h3 className="text-lg font-semibold text-white">
              Current project: Ogwashi-Uku USA Association Portal (Auth + RBAC)
            </h3>

            <p className="text-sm leading-relaxed text-white/70">
              I’m taking the portal from “demo mode” to “real system.” The priority is solid
              login/session handling, role-based access, and a clean API foundation — the unsexy
              stuff that stops everything else from breaking later.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Milestones (updates only):</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                <li>✅ Seed + accounts created: national admin / chapter admin / member test accounts in place.</li>
                <li>✅ Portal UI wired to auth context: login/logout flow connected at the page level.</li>
                <li>🧱 In progress: replacing Prisma usage with SQL/pg across auth routes + session storage.</li>
                <li>
                  Next milestone: <span className="font-mono">/api/auth/me</span>,{" "}
                  <span className="font-mono">/login</span>, <span className="font-mono">/logout</span>{" "}
                  fully working with SQL sessions + memberships returned correctly.
                </li>
              </ul>
            </div>

            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">Definition of “done” for this phase:</span>{" "}
              You can log in, refresh the page, stay logged in, and see the right portal access based on
              role + chapter scope.
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
