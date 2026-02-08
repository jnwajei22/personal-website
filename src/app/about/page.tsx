import Image from "next/image";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/PageHeader";

export default function About() {
  return (
    <SiteLayout>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-medium tracking-wide text-white/50">ABOUT</p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Hi, I&apos;m Justin.
          </h1>

          <div className="mt-10 space-y-8 text-base leading-7 text-white/70">
            <p>
              I like to build things—electronics, software, and the systems that
              connect them. I’m based in Texas, and I care about turning ideas into
              real things that work.
            </p>

            <p>
              I owe a lot of my direction to the people and media I grew up
              around—teachers, mentors, friends, and stories that made building
              feel worth chasing.
            </p>

            {/* Photo break */}
            <div className="border-y border-white/10 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <figure className="space-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src="/about/ftc_w_jatin.jpg"
                      alt="High school robotics"
                      fill
                      priority
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-sm text-white/45">
                    High school robotics — the first time it clicked.
                  </figcaption>
                </figure>

                <figure className="space-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src="/about/p4_w_mcneese.jpg"
                      alt="Physician Pipeline Preparatory Program (P4)"
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-sm text-white/45">
                    Physician Pipeline Preparatory Program (P4) — learning in a
                    different lane.
                  </figcaption>
                </figure>
              </div>
            </div>

            <p>
              I spent my childhood stacking commitments that rewarded discipline:
              IMSA, chess club, orchestra and band, LEGO League, and later Latin
              club, investment club, sports, and FIRST Tech Challenge. I wasn’t
              doing it to “find myself.” I liked structure, performance, and the
              feeling of measurable progress.
            </p>

            <p className="text-white/80">
              <span className="font-semibold text-white">
                Robotics was the first place I felt the click:
              </span>{" "}
              systems aren’t just something to study—they’re something to build.
              From there, engineering stopped being a vague interest and became
              the lane: build the thing, test it, fix it, repeat.
            </p>

            <p>
              Today I work on embedded devices, custom PCBs, and the software that
              supports them—plus the occasional “why not?” project that forces me
              to level up. I’m interested in systems that live in the real world:
              things with constraints, tradeoffs, and consequences.
            </p>

            <div className="pt-2 flex gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                Contact
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                See projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
