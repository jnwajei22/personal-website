import Link from "next/link";
import type { Project } from "@/content/projects/projects";

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function statusPill(status: Project["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300";

    case "FINISHED":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300";

    default:
      return "border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-300";
  }
}

function tagPill(tag: string) {
  switch (tag.toLowerCase()) {
    case "hardware":
    case "pcb":
      return "border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300";

    case "software":
    case "web":
      return "border-sky-500/20 bg-sky-500/8 text-sky-700 dark:text-sky-300";

    case "embedded":
      return "border-violet-500/20 bg-violet-500/8 text-violet-700 dark:text-violet-300";

    case "ml":
      return "border-pink-500/20 bg-pink-500/8 text-pink-700 dark:text-pink-300";

    case "backend":
      return "border-indigo-500/20 bg-indigo-500/8 text-indigo-700 dark:text-indigo-300";

    case "research":
      return "border-orange-500/20 bg-orange-500/8 text-orange-700 dark:text-orange-300";

    default:
      return "border-black/10 bg-black/[0.03] text-black/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60";
  }
}

function folderTheme(folder: Project["folder"]) {
  switch (folder) {
    case "FLIGHT_AEROSPACE":
      return {
        label: "Flight & Aerospace",
        border:
          "hover:border-amber-400/40 dark:hover:border-amber-400/35",
        glow:
          "bg-amber-400/10 group-hover:bg-amber-400/15 dark:bg-amber-400/[0.07]",
        accent: "from-amber-400 via-orange-400 to-transparent",
        marker:
          "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300",
      };

    case "EMBEDDED_SYSTEMS":
      return {
        label: "Embedded Systems",
        border:
          "hover:border-emerald-400/40 dark:hover:border-emerald-400/35",
        glow:
          "bg-emerald-400/10 group-hover:bg-emerald-400/15 dark:bg-emerald-400/[0.07]",
        accent: "from-emerald-400 via-cyan-400 to-transparent",
        marker:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
      };

    default:
      return {
        label: "Software & AI",
        border:
          "hover:border-violet-400/40 dark:hover:border-violet-400/35",
        glow:
          "bg-violet-400/10 group-hover:bg-violet-400/15 dark:bg-violet-400/[0.07]",
        accent: "from-violet-400 via-fuchsia-400 to-transparent",
        marker:
          "border-violet-400/20 bg-violet-400/10 text-violet-700 dark:text-violet-300",
      };
  }
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
    >
      <path
        d="M4 10h12M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.13c.98 0 1.95.13 2.86.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const theme = folderTheme(project.folder);

  return (
    <article
      className={`
        group relative flex h-full flex-col overflow-hidden rounded-[28px]
        border border-black/10 bg-white/80 p-7
        shadow-[0_12px_40px_rgba(0,0,0,0.04)]
        backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)]
        dark:border-white/10 dark:bg-zinc-950/75
        dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]
        ${theme.border}
      `}
    >
      {/* Folder-colored top edge */}
      <div
        className={`
          absolute inset-x-8 top-0 h-px bg-gradient-to-r
          opacity-70 transition-opacity duration-300
          group-hover:opacity-100
          ${theme.accent}
        `}
      />

      {/* Ambient corner glow */}
      <div
        className={`
          pointer-events-none absolute -right-20 -top-20
          h-48 w-48 rounded-full blur-3xl
          transition-all duration-500
          group-hover:scale-125
          ${theme.glow}
        `}
      />

      {/* Decorative dot matrix */}
      <div
        aria-hidden="true"
        className="
          absolute right-7 top-7 grid grid-cols-3 gap-1.5
          opacity-20 transition-opacity duration-300
          group-hover:opacity-40
        "
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-current"
          />
        ))}
      </div>

      {/* Card metadata */}
      <div className="relative flex min-h-8 items-center gap-2 pr-16">
        <span
          className={`
            w-fit rounded-full border px-3 py-1
            text-[10px] font-bold uppercase tracking-[0.14em]
            ${statusPill(project.status)}
          `}
        >
          {formatStatus(project.status)}
        </span>

        <span
          className={`
            hidden rounded-full border px-3 py-1
            text-[10px] font-semibold uppercase tracking-[0.12em]
            sm:inline-flex
            ${theme.marker}
          `}
        >
          {theme.label}
        </span>
      </div>

      {/* Content */}
      <div className="relative mt-6">
        <h3
          className="
            max-w-[90%] text-2xl font-semibold tracking-[-0.035em]
            text-zinc-950 transition-transform duration-300
            group-hover:translate-x-0.5
            dark:text-white
          "
        >
          {project.title}
        </h3>

        <p
          className="
            mt-3 line-clamp-3 text-sm leading-6
            text-zinc-600 dark:text-zinc-400
          "
        >
          {project.summary}
        </p>
      </div>

      {/* Tags */}
      {project.tags?.length ? (
        <div className="relative mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`
                rounded-full border px-2.5 py-1
                text-[11px] font-medium
                transition-transform duration-200
                group-hover:-translate-y-px
                ${tagPill(tag)}
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* Technology stack */}
      {project.stackTags?.length ? (
        <div className="relative mt-5 border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-600">
            Stack
          </p>

          <p className="mt-1.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
            {project.stackTags.slice(0, 3).join(" · ")}
          </p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="relative mt-auto flex items-center gap-3 pt-7">
        <Link
          href={`/projects/${project.slug}`}
          className="
            group/button inline-flex h-12 flex-1 items-center
            justify-between rounded-2xl
            bg-zinc-950 px-5 text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-zinc-800 active:scale-[0.98]
            dark:bg-white dark:text-black dark:hover:bg-zinc-200
          "
        >
          <span>View project</span>
          <ArrowIcon />
        </Link>

        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} on GitHub`}
            className="
              inline-flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl border border-black/10
              bg-black/[0.03] text-zinc-700
              transition-all duration-200
              hover:-translate-y-0.5 hover:border-black/20
              hover:bg-black/[0.06] hover:text-black
              active:scale-95
              dark:border-white/10 dark:bg-white/[0.04]
              dark:text-zinc-300 dark:hover:border-white/20
              dark:hover:bg-white/[0.08] dark:hover:text-white
            "
          >
            <GitHubIcon />
          </a>
        ) : (
          <span
            className="
              inline-flex h-12 shrink-0 items-center justify-center
              rounded-2xl border border-dashed border-black/10
              px-4 text-[11px] font-medium text-zinc-400
              dark:border-white/10 dark:text-zinc-600
            "
          >
            Repo soon
          </span>
        )}
      </div>
    </article>
  );
}