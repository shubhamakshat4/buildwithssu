import { RECRUITERS } from "@/data/recruiters";
import { CompanyChip } from "@/components/ui/CompanyLogo";

function Row({
  names,
  reverse,
  duration,
}: {
  names: string[];
  reverse?: boolean;
  duration: number;
}) {
  const style = {
    "--marquee-duration": `${duration}s`,
    animationDirection: reverse ? "reverse" : undefined,
  } as React.CSSProperties;
  return (
    <div className="marquee overflow-hidden">
      <ul className="marquee-track gap-3 py-1.5" style={style}>
        {names.map((n) => (
          <li key={n} className="shrink-0">
            <CompanyChip name={n} />
          </li>
        ))}
        {names.map((n) => (
          <li key={`d-${n}`} className="shrink-0" aria-hidden="true">
            <CompanyChip name={n} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Credibility band right under the hero: recruiter logos in two opposing rows. */
export function LogoMarquee() {
  // Interleave unicorns with the rest so both rows carry recognisable names.
  const regular = RECRUITERS.filter((r) => !r.unicorn).map((r) => r.name);
  const unicorns = RECRUITERS.filter((r) => r.unicorn).map((r) => r.name);
  const all: string[] = [];
  for (let i = 0; i < Math.max(regular.length, unicorns.length); i++) {
    if (regular[i]) all.push(regular[i]);
    if (i % 3 === 0 && unicorns[i / 3]) all.push(unicorns[i / 3]);
  }
  all.push(...unicorns.filter((u) => !all.includes(u)));
  const half = Math.ceil(all.length / 2);
  return (
    <section
      className="border-ssu-ink/[0.06] bg-ssu-cream border-b py-10"
      aria-labelledby="logos-title"
    >
      <h2 id="logos-title" className="text-ssu-ink/55 mb-6 text-center text-sm font-medium">
        Our graduates work at{" "}
        <span className="text-ssu-maroon font-semibold">{RECRUITERS.length}+ companies</span>,
        including 19 of India&apos;s 117 unicorns
      </h2>
      <div className="space-y-3">
        <Row names={all.slice(0, half)} duration={70} />
        <Row names={all.slice(half)} duration={80} reverse />
      </div>
    </section>
  );
}
