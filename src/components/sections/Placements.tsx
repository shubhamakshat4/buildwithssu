import { Sparkles } from "lucide-react";
import { RECRUITERS } from "@/data/recruiters";
import { AVG_PG_CTC, AVG_UG_CTC, SECTOR_SPLIT } from "@/data/stats";
import { CtcChart } from "@/components/charts/CtcChart";
import { Donut } from "@/components/charts/Donut";
import { CompanyMark } from "@/components/ui/CompanyLogo";
import { Reveal } from "@/components/ui/Reveal";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export function Placements() {
  const latestUg = AVG_UG_CTC.at(-1)!;
  const latestPg = AVG_PG_CTC.at(-1)!;
  const unicorns = RECRUITERS.filter((r) => r.unicorn);
  const regular = RECRUITERS.filter((r) => !r.unicorn);

  return (
    <section
      id="placements"
      className="section bg-ssu-ink text-ssu-cream relative isolate overflow-hidden"
      aria-labelledby="placements-title"
    >
      <TechBackdrop particles={false} glow="gold" className="-z-10 opacity-60" />
      <div className="container-x">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-ssu-gold mb-3 text-sm font-semibold">Placements</p>
          <h2
            id="placements-title"
            className="font-display text-5xl leading-none font-semibold md:text-6xl"
          >
            Offers up, <span className="gold-text">every single year.</span>
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
            <div className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <p className="font-display text-tech-cyan text-5xl font-semibold">
                  ₹{latestPg.value} L
                </p>
                <p className="text-ssu-cream/55 text-sm">Avg PG CTC · {latestPg.year}</p>
              </div>
              <div>
                <p className="font-display text-ssu-gold-light text-5xl font-semibold">
                  ₹{latestUg.value} L
                </p>
                <p className="text-ssu-cream/55 text-sm">Avg UG CTC · {latestUg.year}</p>
              </div>
            </div>
            <CtcChart ug={AVG_UG_CTC} pg={AVG_PG_CTC} />
            <div className="text-ssu-cream/55 mt-2 flex gap-5 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="bg-ssu-gold size-2.5 rounded-sm" /> UG
              </span>
              <span className="flex items-center gap-1.5">
                <span className="bg-tech-cyan size-2.5 rounded-sm" /> PG
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Donut title="Where they go" data={SECTOR_SPLIT} />
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-3xl font-semibold">Who hires SSU</h3>
            <p className="text-ssu-cream/55 flex items-center gap-1.5 text-sm">
              <Sparkles className="text-tech-cyan size-4" aria-hidden /> = unicorn
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {[...unicorns, ...regular].map((r) => (
              <li
                key={r.name}
                title={r.name}
                className="group hover:border-ssu-gold/40 relative flex flex-col items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-2 py-4 text-center transition-colors hover:bg-white/[0.06]"
              >
                {r.unicorn && (
                  <Sparkles
                    className="text-tech-cyan absolute top-2 right-2 size-3.5"
                    aria-label="Unicorn"
                  />
                )}
                <CompanyMark name={r.name} size={40} />
                <span className="text-ssu-cream/65 line-clamp-1 text-[11px]">{r.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
