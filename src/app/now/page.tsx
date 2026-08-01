// src/app/now/page.tsx
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/PageHeader";
import { PhotoCarouselRing } from "@/components/now/PhotoCarouselRing";
import { SpotifyLive } from "@/components/now/SpotifyLive";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "Aug 1, 2026";

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
          lead={
            <>
              A snapshot of what I’m building, learning, and moving toward right
              now.
            </>
          }
          meta={<>Last updated: {LAST_UPDATED}</>}
        />

        {/* Current focus */}
        <section className="mt-10 space-y-5">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Current focus
            </h2>

            <p className="text-sm leading-relaxed text-white/70">
              I’m in a finish-and-validate phase: closing out existing builds,
              strengthening my PCB workflow, and using each project to de-risk
              the next one.
            </p>
          </div>

          <div className="space-y-7">
            <article className="space-y-2 border-l border-white/15 pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                01 / Finish
              </p>

              <h3 className="text-lg font-semibold text-white">
                Carbon Fiber Scale Planes
              </h3>

              <p className="text-sm leading-relaxed text-white/70">
                I’m completing the printed YF-23 structure, refining the
                alignment and seam strategy, and documenting the fabrication
                process. The immediate goal is a complete, cleanly assembled
                airframe before moving deeper into mold planning and composite
                work.
              </p>
            </article>

            <article className="space-y-2 border-l border-white/15 pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                02 / Validate
              </p>

              <h3 className="text-lg font-semibold text-white">
                Capacitive Keyboard V1
              </h3>

              <p className="text-sm leading-relaxed text-white/70">
                The keyboard is my controlled PCB bring-up project: power,
                charging, USB, Bluetooth, matrix scanning, lighting, firmware,
                and hardware validation in one complete system. Finishing it
                should expose the mistakes I would rather find here than on an
                aircraft.
              </p>
            </article>

            <article className="space-y-2 border-l border-white/15 pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                03 / Expand
              </p>

              <h3 className="text-lg font-semibold text-white">
                Custom Flight Controller
              </h3>

              <p className="text-sm leading-relaxed text-white/70">
                The next major hardware build is a custom flight controller.
                I’m deliberately placing it after the keyboard so I can carry
                better board-design, debugging, and firmware habits into a
                system involving sensors, communications, control logic, and
                eventual flight testing.
              </p>
            </article>
          </div>
        </section>

        <div className="mt-10 border-b border-white/10" />

        {/* In parallel */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            In parallel
          </h2>

          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            <p>
              I’m completing the remaining coursework for my associate degree
              in engineering and preparing to transfer into mechanical
              engineering.
            </p>

            <p>
              I’m also developing an independent robotics research direction
              around wearable gesture control for a robotic arm—combining
              sensing, embedded communication, motion mapping, and
              human-machine interaction.
            </p>

            <p>
              Professionally, I’m preparing NASA internship applications and
              pursuing roles where I can contribute to embedded hardware,
              aerospace, robotics, manufacturing, or technical communication.
            </p>
          </div>
        </section>

        <div className="mt-10 border-b border-white/10" />

        {/* Me now */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Me now
          </h2>

          <p className="text-sm leading-relaxed text-white/70">
            A tiny visual dump of what life looks like lately.
          </p>

          <PhotoCarouselRing photos={PHOTOS} />

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Where my head’s at
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
              <li>Finish more than I announce.</li>
              <li>Use smaller systems to de-risk larger ones.</li>
              <li>Document the failures, not only the polished result.</li>
              <li>Stay consistent even when motivation disappears.</li>
            </ul>
          </div>
        </section>

        <div className="mt-10 border-b border-white/10" />

        {/* Spotify */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            What I’m listening to
          </h2>

          <p className="text-sm leading-relaxed text-white/70">
            This is live. If I’m playing something, you’ll see it here — along
            with what’s been in rotation.
          </p>

          <div className="relative left-1/2 w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2">
            <SpotifyLive />
          </div>
        </section>

        {/* Contact button
        <div className="mt-12">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
          >
            Contact
          </Link>
        </div> */}
      </div>
    </SiteLayout>
  );
}