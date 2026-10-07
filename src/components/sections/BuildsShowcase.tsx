"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { SHOWCASE_PICKS, SHOWCASE_TABS } from "@/data/home";
import { buttonClass } from "@/components/ui/Button";
import { ProjectDialogProvider } from "@/components/projects/ProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/cn";

const score = (p: Project) =>
  (p.featured ? 8 : 0) +
  (p.badge ? 4 : 0) +
  (p.github || p.live ? 2 : 0) -
  (p.batch === "2025-29" ? 6 : 0);

function pick(tabKey: string): Project[] {
  const tab = SHOWCASE_TABS.find((t) => t.key === tabKey)!;
  if (!tab.programs.length)
    return SHOWCASE_PICKS.map((id) => PROJECTS.find((p) => p.id === id)).filter(
      (p): p is Project => !!p,
    );
  return PROJECTS.filter((p) => tab.programs.includes(p.program))
    .sort((a, b) => score(b) - score(a))
    .slice(0, 6);
}

export function BuildsShowcase() {
  const [tab, setTab] = useState(SHOWCASE_TABS[0].key);
  const items = useMemo(() => pick(tab), [tab]);
  const [spot, ...rest] = items;

  return (
    <ProjectDialogProvider>
      <div
        role="tablist"
        aria-label="Filter builds"
        className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
      >
        {SHOWCASE_TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={t.key === tab}
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              t.key === tab
                ? "bg-ssu-gold text-ssu-ink"
                : "text-ssu-cream/70 hover:text-ssu-cream bg-white/[0.05] hover:bg-white/10",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <m.div
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]"
      >
        {spot && (
          <div className="md:col-span-2 lg:row-span-2">
            <ProjectCard p={spot} size="lg" />
          </div>
        )}
        {rest.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </m.div>

      <div className="mt-10 flex justify-center">
        <Link href="/projects" className={buttonClass("outline-light", "px-7 py-3.5")}>
          Explore all {PROJECTS.length} builds <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </ProjectDialogProvider>
  );
}
