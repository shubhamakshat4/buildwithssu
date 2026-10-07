import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileText,
  ListChecks,
  MessageSquareText,
  MonitorPlay,
  Rocket,
  Users,
  Video,
} from "lucide-react";
import { PATHS, PROMISES, type PathStep } from "@/data/home";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ICONS: Record<PathStep["icon"], typeof Rocket> = {
  MessageSquareText,
  Users,
  MonitorPlay,
  Rocket,
  FileText,
  ListChecks,
  Video,
  BadgeCheck,
};

export function Paths() {
  return (
    <section id="partner" className="section bg-ssu-cream" aria-labelledby="partner-title">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="partner-title"
            className="font-display text-5xl leading-none font-semibold md:text-6xl"
          >
            Two ways to <em className="text-ssu-maroon">work with us.</em>
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {PATHS.map((p, i) => {
            const dark = i === 0;
            return (
              <Reveal key={p.key} delay={i * 0.1} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 md:p-10",
                    dark
                      ? "bg-ssu-maroon text-ssu-cream"
                      : "border-ssu-ink/10 text-ssu-ink border bg-white",
                  )}
                >
                  {dark && (
                    <div
                      aria-hidden
                      className="bg-ssu-gold/25 absolute -top-24 -right-24 size-80 rounded-full blur-3xl"
                    />
                  )}
                  <div className="relative flex items-start justify-between gap-4">
                    <h3 className="font-display text-4xl font-semibold md:text-5xl">{p.title}</h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                        dark ? "bg-ssu-gold text-ssu-ink" : "bg-ssu-maroon/10 text-ssu-maroon",
                      )}
                    >
                      {p.meta}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "relative mt-3 text-lg",
                      dark ? "text-ssu-cream/75" : "text-ssu-ink/65",
                    )}
                  >
                    {p.promise}
                  </p>

                  <ol className="relative my-10 grid grid-cols-4 gap-2">
                    {p.steps.map((s, k) => {
                      const Icon = ICONS[s.icon];
                      return (
                        <li
                          key={s.label}
                          className="relative flex flex-col items-center text-center"
                        >
                          {k < p.steps.length - 1 && (
                            <span
                              aria-hidden
                              className={cn(
                                "absolute top-7 left-[calc(50%+2rem)] h-px w-[calc(100%-4rem)]",
                                dark ? "bg-ssu-gold/40" : "bg-ssu-maroon/20",
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "relative mb-3 inline-flex size-14 items-center justify-center rounded-2xl",
                              dark
                                ? "text-ssu-gold-light bg-white/10"
                                : "bg-ssu-maroon/[0.07] text-ssu-maroon",
                            )}
                          >
                            <Icon className="size-6" aria-hidden />
                            <span
                              className={cn(
                                "absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                                dark ? "bg-ssu-gold text-ssu-ink" : "bg-ssu-maroon text-ssu-cream",
                              )}
                            >
                              {k + 1}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "text-xs leading-snug font-medium md:text-sm",
                              dark ? "text-ssu-cream/85" : "text-ssu-ink/75",
                            )}
                          >
                            {s.label}
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  <Link
                    href={p.href}
                    className={buttonClass(
                      dark ? "gold" : "maroon",
                      "relative mt-auto self-start px-7 py-3.5",
                    )}
                  >
                    {p.cta}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <ul className="text-ssu-ink/70 mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="bg-ssu-maroon text-ssu-cream inline-flex size-5 items-center justify-center rounded-full">
                  <Check className="size-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
