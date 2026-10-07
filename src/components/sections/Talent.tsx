"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronRight,
  Code2,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { OTHER_FET_PROGRAMS, PROGRAMS, type Program } from "@/data/programs";
import { CURRICULUM, LAYER_META } from "@/data/curriculum";
import { ToolChip } from "@/components/ui/ToolIcon";
import { toolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/cn";

const ICONS: Record<Program["icon"], typeof Brain> = {
  Brain,
  BarChart3,
  ShieldCheck,
  Fingerprint,
  Code2,
};

export function Talent() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PROGRAMS[active];
  const track = CURRICULUM.find((c) => c.program === p.code)!;
  const Icon = ICONS[p.icon];
  // Logo'd tools first, max 10.
  const tools = [...track.tooling]
    .sort((a, b) => Number(!!toolIcon(b)) - Number(!!toolIcon(a)))
    .slice(0, 10);

  const onKey = (e: React.KeyboardEvent) => {
    const dir =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + PROGRAMS.length) % PROGRAMS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <div
        role="tablist"
        aria-label="Programs"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {PROGRAMS.map((prog, i) => {
          const TabIcon = ICONS[prog.icon];
          const on = i === active;
          return (
            <button
              key={prog.code}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              aria-selected={on}
              aria-controls="talent-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all lg:w-full",
                on
                  ? "border-ssu-maroon bg-ssu-maroon text-ssu-cream shadow-[0_14px_30px_-18px_rgba(110,15,31,.9)]"
                  : "border-ssu-ink/10 text-ssu-ink/75 hover:border-ssu-maroon/40 bg-white",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-xl",
                  on ? "text-ssu-gold-light bg-white/15" : "bg-ssu-maroon/[0.07] text-ssu-maroon",
                )}
              >
                <TabIcon className="size-5" aria-hidden />
              </span>
              <span className="font-semibold whitespace-nowrap">{prog.short}</span>
              <ChevronRight
                className={cn("ml-auto hidden size-4 lg:block", on ? "opacity-100" : "opacity-0")}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={p.code}
          id="talent-panel"
          role="tabpanel"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="text-ssu-cream relative overflow-hidden rounded-[2rem]"
          style={{ background: p.gradient }}
        >
          <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
          <Icon
            aria-hidden
            className="absolute -right-10 -bottom-10 size-64 text-white/[0.06]"
            strokeWidth={1}
          />

          <div className="relative p-7 md:p-10">
            <p className="font-mono text-xs tracking-widest text-white/60">{p.code}</p>
            <h3 className="font-display mt-1 text-3xl leading-tight font-semibold md:text-4xl">
              {p.name}
            </h3>
            {p.footnote && <p className="mt-1 text-sm text-white/60">{p.footnote}</p>}
            <p className="mt-4 max-w-2xl text-lg text-white/85">{p.pitch}</p>

            {/* 4-step skill ladder */}
            <ol className="mt-8 grid gap-3 md:grid-cols-4">
              {LAYER_META.map((layer, i) => (
                <li
                  key={layer.key}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm"
                >
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/55 uppercase">
                    <span
                      className="text-ssu-ink inline-flex size-5 items-center justify-center rounded-full text-[10px]"
                      style={{ background: p.accent }}
                    >
                      {i + 1}
                    </span>
                    {layer.title}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-white/90">
                    {track.layers[layer.key].slice(0, 3).map((topic) => (
                      <li key={topic} className="leading-snug">
                        {topic.replace(/\s*\(.*?\)/g, "")}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold tracking-wider text-white/55 uppercase">
                On their laptops
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <ToolChip key={t} name={t} />
                ))}
              </div>
            </div>

            <Link
              href={`/projects?program=${p.code}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              See {p.short} builds <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </m.div>
      </AnimatePresence>

      <p className="text-ssu-ink/45 text-center text-xs lg:col-span-2">{OTHER_FET_PROGRAMS}</p>
    </div>
  );
}
