"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, ExternalLink, FolderGit2, Lightbulb, Wrench, X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { PROGRAM_COLOR, PROGRAM_LABEL } from "@/data/programs";
import { SHOW_STUDENT_NAMES } from "@/data/site";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { ToolChip } from "@/components/ui/ToolIcon";
import { buttonClass } from "@/components/ui/Button";

const OpenContext = createContext<(id: string) => void>(() => {});
export const useOpenProject = () => useContext(OpenContext);

export function splitTitle(title: string) {
  const [name, ...rest] = title.split(" — ");
  return { name, sub: rest.join(" — ") || undefined };
}

/** Wrap any area that renders ProjectCards; provides the shared detail dialog. */
export function ProjectDialogProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((pid: string) => setId(pid), []);

  // Deep link: ?build=<id> opens that project — handy for outreach emails.
  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get("build");
    if (pid && PROJECTS.some((p) => p.id === pid)) setId(pid);
  }, []);
  const project = id ? PROJECTS.find((p) => p.id === id) : undefined;
  return (
    <OpenContext.Provider value={open}>
      {children}
      <ProjectModal project={project} onClose={() => setId(null)} />
    </OpenContext.Provider>
  );
}

function ProjectModal({ project, onClose }: { project?: Project; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  const t = project ? splitTitle(project.title) : null;
  const color = project ? PROGRAM_COLOR[project.program] : "#C9A227";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby="project-dialog-title"
      className="bg-ssu-ink text-ssu-cream m-auto max-h-[92dvh] w-[min(56rem,calc(100%-1.5rem))] overflow-hidden rounded-3xl border border-white/10 p-0 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {project && t && (
        <div className="max-h-[92dvh] overflow-y-auto">
          <div className="relative">
            <ProjectArt project={project} className="aspect-[21/9] w-full" />
            <div className="from-ssu-ink via-ssu-ink/20 absolute inset-0 bg-gradient-to-t to-transparent" />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="text-ssu-cream absolute top-4 right-4 rounded-full bg-black/50 p-2 backdrop-blur hover:bg-black/70"
              aria-label="Close"
              autoFocus
            >
              <X className="size-5" />
            </button>
            <div className="absolute inset-x-6 bottom-4 md:inset-x-8">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ color: "#1A1216", background: color }}
                >
                  {PROGRAM_LABEL[project.program]}
                </span>
                {project.badge && (
                  <span className="bg-ssu-gold/20 text-ssu-gold-light inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                    <Award className="size-3.5" aria-hidden /> {project.badge}
                  </span>
                )}
              </div>
              <h2
                id="project-dialog-title"
                className="font-display text-3xl leading-tight font-semibold md:text-4xl"
              >
                {t.name}
              </h2>
              {t.sub && <p className="text-ssu-cream/70 text-sm">{t.sub}</p>}
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_1fr] md:p-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-ssu-gold mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
                  <Lightbulb className="size-4" aria-hidden /> The problem
                </h3>
                <p className="font-display text-ssu-cream text-2xl leading-snug">
                  {project.problem}
                </p>
              </section>
              <section>
                <h3 className="text-tech-cyan mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
                  <Wrench className="size-4" aria-hidden /> What they built
                </h3>
                <p className="text-ssu-cream/80 leading-relaxed">{project.description}</p>
                {SHOW_STUDENT_NAMES && project.team && (
                  <p className="text-ssu-cream/50 mt-2 text-sm">Team: {project.team}</p>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-ssu-cream/50 mb-3 text-xs font-semibold tracking-[0.16em] uppercase">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tool) => (
                    <ToolChip key={tool} name={tool} />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-ssu-cream/50 mb-3 text-xs font-semibold tracking-[0.16em] uppercase">
                  Domain
                </h3>
                <p className="text-ssu-cream/75 text-sm">
                  {project.domain.join(" · ")}
                  {project.batch && (
                    <span className="text-ssu-cream/40"> · Batch {project.batch}</span>
                  )}
                </p>
              </section>
              {(project.github || project.live) && (
                <div className="flex flex-wrap gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("outline-light", "px-4 py-2")}
                    >
                      <FolderGit2 className="size-4" aria-hidden /> Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("outline-light", "px-4 py-2")}
                    >
                      <ExternalLink className="size-4" aria-hidden /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center md:px-8">
            <p className="text-ssu-cream/70 text-sm">Need something like this for your team?</p>
            <Link href="/collaborate?intent=build" className={buttonClass("gold", "px-5 py-2.5")}>
              Start a project <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
