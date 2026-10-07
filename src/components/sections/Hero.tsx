import { ArrowRight, ChevronDown } from "lucide-react";
import { HERO } from "@/data/home";
import { HERO_STATS } from "@/data/stats";
import { SITE } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { TechBackdrop } from "@/components/ui/TechBackdrop";
import { ToolGlyph } from "@/components/ui/ToolIcon";
import { SignalVisual } from "./SignalVisual";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function Orbit() {
  const n = HERO.orbit.length;
  return (
    <div aria-hidden className="orbit pointer-events-none absolute inset-0">
      {HERO.orbit.map((tool, i) => {
        const a = (i / n) * 2 * Math.PI;
        return (
          <span
            key={tool}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + 47 * Math.cos(a)}%`, top: `${50 + 47 * Math.sin(a)}%` }}
          >
            <span className="orbit-counter bg-ssu-slate/80 flex size-11 items-center justify-center rounded-2xl border border-white/10 shadow-[0_8px_24px_-8px_rgba(0,0,0,.8)] backdrop-blur md:size-12">
              <ToolGlyph name={tool} className="size-5 md:size-6" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="bg-ssu-ink text-ssu-cream relative isolate flex min-h-[min(100svh,58rem)] flex-col overflow-hidden pt-24 md:pt-28"
      aria-labelledby="hero-title"
    >
      {SITE.heroImage && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-15 mix-blend-luminosity"
          style={{ backgroundImage: `url(${SITE.heroImage})` }}
        />
      )}
      <TechBackdrop glow="both" className="-z-10" />

      <div className="container-x grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="hero-in border-ssu-gold/25 bg-ssu-gold/[0.06] text-ssu-gold-light mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs">
            <span className="bg-tech-cyan size-1.5 animate-pulse rounded-full" aria-hidden />
            {HERO.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="hero-in font-display text-[3.5rem] leading-[0.92] font-semibold tracking-tight sm:text-7xl lg:text-[6.2rem]"
            style={d(0.08)}
          >
            {HERO.line1}
            <span className="gold-text block">{HERO.line2}</span>
          </h1>
          <p
            className="hero-in text-ssu-cream/70 mt-7 max-w-lg text-lg leading-relaxed md:text-xl"
            style={d(0.16)}
          >
            {HERO.sub}
          </p>
          <div className="hero-in mt-9 flex flex-wrap gap-3" style={d(0.24)}>
            <ButtonLink href="/collaborate" variant="gold" className="px-7 py-3.5 text-base">
              Start a Collaboration
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </ButtonLink>
            <ButtonLink href="/#builds" variant="outline-light" className="px-7 py-3.5 text-base">
              See student builds
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-in relative mx-auto aspect-square w-full max-w-[min(30rem,88vw)]"
          style={d(0.2)}
        >
          <Orbit />
          <div className="absolute inset-[13%]">
            <SignalVisual className="size-full" caption={false} />
          </div>
        </div>
      </div>

      <div className="container-x pb-8">
        <dl className="grid grid-cols-2 gap-y-6 border-t border-white/10 pt-6 md:grid-cols-4">
          {HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col md:border-l md:border-white/10 md:pl-6 md:first:border-0 md:first:pl-0"
            >
              <dt className="text-ssu-cream/50 order-2 text-xs">{s.label}</dt>
              <dd className="font-display text-ssu-gold-light text-3xl font-semibold md:text-4xl">
                {s.value != null
                  ? `${s.prefix ?? ""}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix ?? ""}`
                  : s.text}
              </dd>
            </div>
          ))}
        </dl>
        <a
          href="#partner"
          className="text-ssu-cream/40 hover:text-ssu-gold-light mx-auto mt-6 flex w-fit items-center gap-1 text-xs"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="size-5 animate-bounce" aria-hidden />
        </a>
      </div>
    </section>
  );
}
