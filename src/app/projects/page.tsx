import { projects } from "@/content/projects/projects";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="PROJECTS"
        title="Projects"
        lead={
          <>
            This is the work I’m actively building and iterating on—hardware, software, and the
            messy integration in between. Each project is tagged by status so you can tell what’s
            in motion, what’s shipped, and what’s still an idea worth abusing on paper. Open a
            project to see the write-up, or jump straight to the repo when it’s available.
          </>
        }
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </main>
  );
}
