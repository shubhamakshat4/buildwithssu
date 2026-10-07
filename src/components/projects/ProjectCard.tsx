"use client";

import { ArrowUpRight, Award, Plus } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { PROGRAM_COLOR, PROGRAM_LABEL } from "@/data/programs";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { ToolGlyph } from "@/components/ui/ToolIcon";
import { toolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/cn";
import { splitTitle, useOpenProject } from "./ProjectDialog";

/** Visual project card: generated art + plain-language problem + tool logos. Opens the detail dialog. */
export function ProjectCard({ p, size = "md" }: { p: Project; size?: "md" | "lg" }) {
  const open = useOpenProject();
  const { name } = splitTitle(p.title);
  const color = PROGRAM_COLOR[p.program];
  const lg = size === "lg";
  // Prefer tools that have a recognisable logo.
  const tools = [...p.tech]
    .sort((a, b) => Number(!!toolIcon(b)) - Number(!!toolIcon(a)))
    .slice(0, lg ? 6 : 3);

  return (
    <button
      type="button"
      onClick={() => open(p.id)}
      className="group bg-ssu-slate/40 hover:border-ssu-gold/40 focus-visible:outline-ssu-gold relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(201,162,39,.55)] focus-visible:outline-2"
      aria-label={`${name}: ${p.problem} — view details`}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <ProjectArt
          project={p}
          className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span
          className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ color: "#1A1216", background: color }}
        >
          {PROGRAM_LABEL[p.program]}
        </span>
        {p.badge && (
          <span className="text-ssu-gold-light absolute top-3 right-3 inline-flex max-w-[60%] items-center gap-1 truncate rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            <Award className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{p.badge}</span>
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-2", lg ? "p-6 md:p-7" : "p-5")}>
        <h3
          className={cn(
            "font-display text-ssu-cream leading-tight font-semibold",
            lg ? "text-3xl md:text-4xl" : "text-xl",
          )}
        >
          {name}
        </h3>
        <p
          className={cn("text-ssu-cream/65", lg ? "text-base md:text-lg" : "line-clamp-2 text-sm")}
        >
          {p.problem}
        </p>
        {lg && (
          <p className="text-tech-cyan/75 mt-1 line-clamp-2 font-mono text-xs leading-relaxed md:block">
            {p.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="flex min-w-0 flex-wrap items-center gap-1.5">
            {tools.map((t) =>
              toolIcon(t) ? (
                <span
                  key={t}
                  title={t}
                  className="inline-flex size-7 items-center justify-center rounded-md bg-white/[0.06]"
                >
                  <ToolGlyph name={t} className="size-4" />
                </span>
              ) : (
                <span
                  key={t}
                  className="text-ssu-cream/70 rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[10.5px]"
                >
                  {t}
                </span>
              ),
            )}
          </span>
          <span className="text-ssu-gold-light inline-flex shrink-0 items-center gap-1 text-xs font-semibold opacity-70 transition-opacity group-hover:opacity-100">
            Details <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </button>
  );
}

export function GhostProjectCard() {
  return (
    <Link
      href="/collaborate?intent=build"
      className="group border-ssu-gold/30 hover:border-ssu-gold hover:bg-ssu-gold/5 flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors"
    >
      <span className="bg-ssu-gold text-ssu-ink inline-flex size-14 items-center justify-center rounded-full transition-transform group-hover:scale-110 group-hover:rotate-90">
        <Plus className="size-6" aria-hidden />
      </span>
      <p className="font-display text-ssu-cream text-2xl font-semibold">Your project here</p>
      <p className="text-ssu-cream/55 text-sm">Bring a problem. We bring the team.</p>
    </Link>
  );
}
