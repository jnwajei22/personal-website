import Link from "next/link";
import { Folder, FolderOpen, Layers3 } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  projectFolders,
  projects,
  projectsByFolder,
} from "@/content/projects/projects";

type ProjectsPageProps = {
  searchParams: Promise<{
    folder?: string | string[];
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { folder } = await searchParams;

  const folderParam = Array.isArray(folder) ? folder[0] : folder;

  const selectedFolder = projectFolders.find(
    (projectFolder) => projectFolder.id === folderParam
  );

  const visibleProjects = selectedFolder
    ? projectsByFolder[selectedFolder.id]
    : projects;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="PROJECTS"
        title="Projects"
        lead={
          <>
            Projects are organized by the kind of system being built—flight and
            aerospace, embedded hardware, or software and AI. Open a folder to
            narrow the collection, then select a project for the full technical
            write-up.
          </>
        }
      />

      {/* Project folders */}
      <section className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/projects"
            className={[
              "group flex min-h-48 flex-col rounded-3xl border p-6 transition",
              !selectedFolder
                ? "border-white/30 bg-white/[0.08]"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                {!selectedFolder ? (
                  <FolderOpen className="h-5 w-5" aria-hidden />
                ) : (
                  <Layers3 className="h-5 w-5" aria-hidden />
                )}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                {projects.length}
              </span>
            </div>

            <div className="mt-auto pt-8">
              <h2 className="text-lg font-semibold text-white">
                All Projects
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/55">
                View the complete project collection.
              </p>
            </div>
          </Link>

          {projectFolders.map((projectFolder) => {
            const isSelected = selectedFolder?.id === projectFolder.id;
            const folderProjects = projectsByFolder[projectFolder.id];

            return (
              <Link
                key={projectFolder.id}
                href={{
                  pathname: "/projects",
                  query: { folder: projectFolder.id },
                }}
                className={[
                  "group flex min-h-48 flex-col rounded-3xl border p-6 transition",
                  isSelected
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    {isSelected ? (
                      <FolderOpen className="h-5 w-5" aria-hidden />
                    ) : (
                      <Folder className="h-5 w-5" aria-hidden />
                    )}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    {folderProjects.length}
                  </span>
                </div>

                <div className="mt-auto pt-8">
                  <h2 className="text-lg font-semibold text-white">
                    {projectFolder.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                    {projectFolder.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Selected folder */}
      <section className="mt-14">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {selectedFolder ? "Open folder" : "Project library"}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {selectedFolder?.title ?? "All Projects"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              {selectedFolder?.description ??
                "The full collection across hardware, aerospace, embedded systems, software, and AI."}
            </p>
          </div>

          <span className="text-sm text-white/45">
            {visibleProjects.length}{" "}
            {visibleProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}