import Link from "next/link";
import type { Project } from "@/content/projects/projects";

function formatStatus(s: string) {
  return s.replaceAll("_", " ");
}

function statusPill(status: Project["status"]) {
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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-black">
      {/* Status */}
      <span
        className={`w-fit rounded-full border px-3 py-1 text-[11px] font-semibold ${statusPill(
          project.status
        )}`}
      >
        {formatStatus(project.status)}
      </span>

      {/* Title / Summary */}
      <h3 className="mt-4 text-2xl font-semibold tracking-tight">
        {project.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed opacity-80 line-clamp-3">
        {project.summary}
      </p>

      {/* Tags */}
      {project.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${tagPill(
                t
              )}`}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-auto pt-8 grid grid-cols-2 gap-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-black hover:bg-zinc-100 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          View →
        </Link>

        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-black hover:bg-zinc-100 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            GitHub Repo →
          </a>
        ) : (
          <button
            disabled
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-black opacity-50 dark:border-white/10 dark:bg-white dark:text-black"
          >
            GitHub (soon)
          </button>
        )}
      </div>
    </div>
  );
}
