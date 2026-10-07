"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderGit2, Search, X } from "lucide-react";
import { DOMAINS, PROJECTS, type ProgramCode } from "@/data/projects";
import { PROGRAM_COLOR, PROGRAM_LABEL } from "@/data/programs";
import { buttonClass } from "@/components/ui/Button";
import { ProjectDialogProvider } from "@/components/projects/ProjectDialog";
import { GhostProjectCard, ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/cn";

const PROGRAM_CODES = Object.keys(PROGRAM_LABEL) as ProgramCode[];

export function ProjectsExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const programParam = params.get("program");
  const program = PROGRAM_CODES.includes(programParam as ProgramCode)
    ? (programParam as ProgramCode)
    : null;
  const domain = params.get("domain") ?? "";
  const q = params.get("q") ?? "";
  const withCode = params.get("code") === "1";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Search box: local state for smooth typing, synced to the URL after a pause.
  const [draft, setDraft] = useState(q);
  const pushed = useRef(q);
  useEffect(() => {
    if (q !== pushed.current) {
      pushed.current = q;
      setDraft(q);
    }
  }, [q]);
  useEffect(() => {
    if (draft === pushed.current) return;
    const id = window.setTimeout(() => {
      pushed.current = draft.trim() ? draft : "";
      update({ q: pushed.current || null });
    }, 250);
    return () => window.clearTimeout(id);
  }, [draft, update]);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PROJECTS.filter((p) => {
      if (program && p.program !== program) return false;
      if (domain && !p.domain.includes(domain)) return false;
      if (withCode && !p.github && !p.live) return false;
      if (words.length) {
        const hay = [p.title, p.problem, p.description, ...p.tech, ...p.domain, p.badge ?? ""]
          .join(" ")
          .toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [program, domain, q, withCode]);

  const anyFilter = program || domain || q || withCode;
  const clear = () => router.replace(pathname, { scroll: false });

  return (
    <ProjectDialogProvider>
      <div className="bg-ssu-ink/90 sticky top-16 z-30 -mx-5 mb-8 space-y-3 border-b border-white/10 px-5 py-4 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border">
        <div
          role="group"
          aria-label="Program"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
        >
          <button
            type="button"
            aria-pressed={!program}
            onClick={() => update({ program: null })}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              !program
                ? "bg-ssu-gold text-ssu-ink"
                : "text-ssu-cream/70 bg-white/[0.05] hover:bg-white/10",
            )}
          >
            All
          </button>
          {PROGRAM_CODES.map((code) => {
            const on = program === code;
            return (
              <button
                key={code}
                type="button"
                aria-pressed={on}
                onClick={() => update({ program: on ? null : code })}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  on ? "text-ssu-ink" : "text-ssu-cream/70 bg-white/[0.05] hover:bg-white/10",
                )}
                style={on ? { background: PROGRAM_COLOR[code] } : undefined}
              >
                {!on && (
                  <span
                    className="size-2 rounded-full"
                    style={{ background: PROGRAM_COLOR[code] }}
                    aria-hidden
                  />
                )}
                {PROGRAM_LABEL[code]}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search by problem, tech or keyword</span>
            <Search
              className="text-ssu-cream/40 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search — e.g. ransomware, YOLOv8, AWS"
              className="text-ssu-cream placeholder:text-ssu-cream/35 focus:border-ssu-gold w-full rounded-full border border-white/10 bg-black/30 py-2.5 pr-4 pl-10 text-sm focus:outline-none"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Domain</span>
            <select
              value={domain}
              onChange={(e) => update({ domain: e.target.value || null })}
              className="text-ssu-cream focus:border-ssu-gold w-full appearance-none rounded-full border border-white/10 bg-black/30 py-2.5 pr-9 pl-4 text-sm focus:outline-none sm:w-48"
            >
              <option value="">All domains</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="text-ssu-cream/50 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs"
            >
              ▾
            </span>
          </label>
          <button
            type="button"
            aria-pressed={withCode}
            onClick={() => update({ code: withCode ? null : "1" })}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              withCode
                ? "border-ssu-gold bg-ssu-gold/15 text-ssu-gold-light"
                : "text-ssu-cream/70 border-white/10 hover:border-white/25",
            )}
          >
            <FolderGit2 className="size-4" aria-hidden /> Has code / demo
          </button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4 text-sm">
        <p className="text-ssu-cream/55" aria-live="polite">
          <span className="text-ssu-cream font-semibold">{results.length}</span> of{" "}
          {PROJECTS.length} builds
        </p>
        {anyFilter && (
          <button
            type="button"
            onClick={clear}
            className="text-ssu-cream/55 hover:text-ssu-gold-light inline-flex items-center gap-1"
          >
            <X className="size-4" aria-hidden /> Clear
          </button>
        )}
      </div>

      {results.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProjectCard p={p} />
            </li>
          ))}
          <li>
            <GhostProjectCard />
          </li>
        </ul>
      ) : (
        <div className="border-ssu-gold/30 rounded-3xl border border-dashed px-6 py-16 text-center">
          <p className="font-display text-ssu-cream text-4xl font-semibold">
            Not built here — yet.
          </p>
          <p className="text-ssu-cream/60 mx-auto mt-3 max-w-sm">
            Bring us the problem and a student team will build it with you.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/collaborate?intent=build" className={buttonClass("gold")}>
              Propose this project <ArrowRight className="size-4" aria-hidden />
            </Link>
            <button type="button" onClick={clear} className={buttonClass("outline-light")}>
              Clear filters
            </button>
          </div>
        </div>
      )}
    </ProjectDialogProvider>
  );
}
