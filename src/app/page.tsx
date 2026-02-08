import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects/projects";

// pick 1 IN_PROGRESS, 1 PROPOSED, 1 FINISHED.
// if none are FINISHED, pick 2 IN_PROGRESS.
// preserve original order from `projects`.

type CanonStatus = "PROPOSED" | "IN_PROGRESS" | "FINISHED";

function normalizeStatus(s: any): CanonStatus | undefined {
  if (!s) return undefined;
  const t = String(s).toUpperCase().replace(/\s+/g, "_");
  if (t === "PROPOSED" || t === "IN_PROGRESS" || t === "FINISHED") return t as CanonStatus;
  return undefined;
}

function firstByStatus(status: CanonStatus, exclude: Set<string>) {
  return projects.find((p: any) => {
    const ps = normalizeStatus(p?.status);
    return ps === status && p?.title && !exclude.has(p.title);
  });
}

const picked: any[] = [];
const used = new Set<string>();

const pInProgress = firstByStatus("IN_PROGRESS", used);
if (pInProgress) {
  picked.push(pInProgress);
  used.add(pInProgress.title);
}

const pProposed = firstByStatus("PROPOSED", used);
if (pProposed) {
  picked.push(pProposed);
  used.add(pProposed.title);
}

const pFinished = firstByStatus("FINISHED", used);

if (pFinished) {
  picked.push(pFinished);
  used.add(pFinished.title);
} else {
  // no FINISHED → pick a 2nd IN_PROGRESS
  const pSecondInProgress = firstByStatus("IN_PROGRESS", used);
  if (pSecondInProgress) {
    picked.push(pSecondInProgress);
    used.add(pSecondInProgress.title);
  }
}

// If we still don't have 3 (edge cases), fill from remaining projects
while (picked.length < 3) {
  const next = projects.find((p: any) => p?.title && !used.has(p.title));
  if (!next) break;
  picked.push(next);
  used.add(next.title);
}

// IMPORTANT: don't reshape. ProjectCard expects the canonical fields: `tags` + `summary`.
const featured = picked.map((p: any) => ({
  ...p,
  status: normalizeStatus(p?.status) ?? "IN_PROGRESS", // keep status consistent for the pill
}));

export default function Home() {
  return (
    <SiteLayout>
      <Hero />

      {/* WIDE ABOUT / INTRO */}
      <section className="pt-6">
        <div className="max-w-none">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            I like to build things — hardware, software, and the glue in between.
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/70">
            This site is just the suit and tie version of what I’ve been up to lately, what I’ve shipped, and how to reach me.
          </p>

          <div className="mt-6 space-y-4 text-base leading-7 text-white/70">
            <p>
              I live to push boundaries and challenge myself. That often means building the whole thing: hardware, embedded, software, and the web layer that ships it.
            </p>
            <p>
              I’m chasing real proficiency across disciplines because that’s where I do my best work—when everything connects.
              Current obsessions: Kinetica, a capacitive keyboard, and Project ASTRO.
            </p>
            <p>
              I’m wrapping up my associate’s and aiming for UT next year, and I’m always down to connect—internships,
              collaborations, or just meeting sharp people.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Featured</h2>
            <p className="mt-2 text-sm text-white/60">A few things worth clicking before you bounce.</p>
          </div>

          <Link href="/projects" className="text-sm font-medium text-white/70 hover:text-white">
            All projects →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((p: any) => (
            <ProjectCard key={p.slug ?? p.title} project={p} />
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mt-16 mb-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-white">Let’s build something.</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">
                I’m open to internships, collaborations, and meeting sharp people. If you’ve got a problem worth solving,
                I’m interested.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
              >
                Contact
              </Link>

              <a
                href="mailto:jnwajei22@gmail.com"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white/85 hover:border-white/30 hover:bg-white/5"
              >
                Email me
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Or email: <span className="text-white/80">jnwajei22@gmail.com</span>
            </span>

            <div className="flex gap-4">
              <a
                href="https://github.com/jnwajei22"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
