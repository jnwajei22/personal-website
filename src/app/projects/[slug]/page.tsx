import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectsBySlug } from "@/content/projects/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

function formatStatus(s: string) {
  return s.replaceAll("_", " ");
}

function statusPill(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
    case "FINISHED":
      return "bg-green-500/15 text-green-300 border-green-500/30";
    default:
      return "bg-red-500/15 text-red-300 border-red-500/30";
  }
}

function tagPill(tag: string) {
  switch (tag.toLowerCase()) {
    case "hardware":
    case "pcb":
      return "bg-green-500/15 text-green-300 border-green-500/30";
    case "software":
    case "web":
      return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    case "embedded":
      return "bg-violet-500/15 text-violet-300 border-violet-500/30";
    case "ml":
      return "bg-pink-500/15 text-pink-300 border-pink-500/30";
    case "backend":
      return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    default:
      return "bg-white/5 text-white/80 border-white/10";
  }
}

const mdxBodyClass = [
  "max-w-none text-white/75",
  "[&>p]:my-5 [&>p]:leading-relaxed",
  "[&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-white",
  "[&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6",
  "[&>ul>li]:my-2",
  "[&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6",
  "[&>ol>li]:my-2",
  "[&>strong]:text-white",
].join(" ");

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  const project = projectsBySlug[slug];
  if (!project) return notFound();

  const Mdx = project.mdx ? (await project.mdx()).default : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
      >
        <span aria-hidden>←</span>
        Back to Projects
      </Link>

      {/* Status pill (between back + title) */}
      <div className="mt-6">
        <span
          className={[
            "inline-flex items-center rounded-full border px-3 py-1",
            "text-[11px] font-semibold",
            statusPill(project.status),
          ].join(" ")}
        >
          {formatStatus(project.status)}
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
        {project.title}
      </h1>

      {/* Summary */}
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
        {project.summary}
      </p>

      {/* Tags (under snippet) */}
      {project.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className={[
                "inline-flex items-center rounded-full border px-3 py-1",
                "text-xs font-medium",
                tagPill(t),
              ].join(" ")}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Body */}
      <section className="mt-2 border-t border-white/10 pt-6">
        {Mdx ? (
          <article className={mdxBodyClass}>
            <Mdx />
          </article>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-white/70">
            Write-up coming soon.
          </div>
        )}

        {/* Bottom GitHub CTA (always present) */}
        <div className="mt-12 flex">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-100"
            >
              GitHub Repo →
            </a>
          ) : (
            <button
              disabled
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black opacity-50"
            >
              GitHub Repo (soon)
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
