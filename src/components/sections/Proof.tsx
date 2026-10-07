import { Trophy } from "lucide-react";
import { ACCREDITATIONS, PROOF } from "@/data/home";
import { ALSO_COMPETED, INTERNSHIP_HOSTS } from "@/data/achievements";
import { INDUSTRY_PARTNERS } from "@/data/curriculum";
import { CompanyChip } from "@/components/ui/CompanyLogo";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function Proof() {
  return (
    <section id="achievements" className="section bg-ssu-cream" aria-labelledby="proof-title">
      <div className="container-x">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-ssu-maroon mb-3 text-sm font-semibold">Achievements</p>
          <h2
            id="proof-title"
            className="font-display text-5xl leading-none font-semibold md:text-6xl"
          >
            Tested against <em className="text-ssu-maroon">the best.</em>
          </h2>
        </Reveal>

        {/* Bento of wins */}
        <ul className="grid auto-rows-[minmax(9.5rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((t, i) => (
            <RevealItem
              key={t.value + t.label}
              delay={i * 0.06}
              className={cn(
                "relative flex flex-col justify-end overflow-hidden rounded-3xl p-6",
                t.size === "lg" && "sm:col-span-2 sm:row-span-2 lg:p-9",
                t.size === "lg"
                  ? "bg-ssu-ink text-ssu-cream"
                  : t.accent === "gold"
                    ? "bg-ssu-maroon text-ssu-cream"
                    : "border-ssu-ink/[0.08] text-ssu-ink border bg-white",
              )}
            >
              {t.size === "lg" && (
                <>
                  <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
                  <div
                    aria-hidden
                    className="bg-tech-cyan/20 absolute -top-16 -right-16 size-72 rounded-full blur-3xl"
                  />
                  <Trophy
                    aria-hidden
                    className="text-tech-cyan/70 absolute top-8 right-8 size-14"
                    strokeWidth={1.4}
                  />
                </>
              )}
              <p
                className={cn(
                  "font-display relative leading-none font-semibold",
                  t.size === "lg" ? "text-tech-cyan text-7xl md:text-8xl" : "text-5xl",
                  !t.size && t.accent !== "gold" && "text-ssu-maroon",
                  t.accent === "gold" && "text-ssu-gold-light",
                )}
              >
                {t.value}
              </p>
              <p className={cn("relative mt-2 font-semibold", t.size === "lg" && "text-xl")}>
                {t.label}
              </p>
              {t.detail && (
                <p
                  className={cn(
                    "relative mt-1 text-sm",
                    t.size === "lg" || t.accent === "gold"
                      ? "text-ssu-cream/60"
                      : "text-ssu-ink/50",
                  )}
                >
                  {t.detail}
                </p>
              )}
            </RevealItem>
          ))}
        </ul>

        <Reveal>
          <p className="text-ssu-ink/45 mt-6 text-center text-sm">
            Also competing at {ALSO_COMPETED.join(" · ")}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Accreditations">
            {ACCREDITATIONS.map((a) => (
              <li
                key={a}
                className="border-ssu-maroon/20 text-ssu-maroon rounded-full border px-3.5 py-1.5 text-xs font-semibold"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="font-display mb-6 text-center text-3xl font-semibold">
            Where they&apos;ve interned
          </h3>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {INTERNSHIP_HOSTS.map((h) => (
              <li key={h}>
                <CompanyChip name={h} size={28} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h3 className="font-display mb-6 text-center text-3xl font-semibold">
            Industry partners
          </h3>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {INDUSTRY_PARTNERS.map((h) => (
              <li key={h}>
                <CompanyChip name={h} size={28} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
