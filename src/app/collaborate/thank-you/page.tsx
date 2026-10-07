import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";
import { getContacts } from "@/data/team";
import { REFERENCE_RE } from "@/lib/ref";
import { ContactCard } from "@/components/sections/ContactCard";
import { AnimatedCheck, CopyRef, IcsReminder } from "@/components/sections/ThankYouClient";
import { buttonClass } from "@/components/ui/Button";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    when: "Within 24 h",
    title: "Acknowledgement",
    body: "You'll get a confirmation from our team with your reference ID.",
  },
  {
    when: "Within 2 working days",
    title: "Fit call",
    body: "A short call with FET faculty + Training & Placement to understand scope, timelines and constraints.",
  },
  {
    when: "Within 5 working days",
    title: "Proposal / shortlist",
    body: "A project proposal with team and mentor — or a shortlist of candidates in your selection format.",
  },
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; queued?: string }>;
}) {
  const { ref, queued } = await searchParams;
  const refId = ref && REFERENCE_RE.test(ref) ? ref : null;
  const isQueued = queued === "1";
  const contacts = getContacts();

  return (
    <div className="bg-ssu-ink text-ssu-cream relative isolate min-h-screen pt-28 pb-24 md:pt-36">
      <TechBackdrop glow="gold" className="-z-10" />
      <div className="container-x max-w-4xl">
        <div className="text-center">
          <AnimatedCheck />
          <p className="text-ssu-gold mt-8 font-mono text-xs tracking-[0.2em] uppercase">
            {"// Request received"}
          </p>
          <h1 className="font-display mt-3 text-5xl leading-tight font-semibold md:text-6xl">
            Thank you. <span className="gold-text">We&apos;re on it.</span>
          </h1>

          {refId && (
            <div className="border-ssu-gold/30 mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border bg-white/[0.04] px-5 py-3">
              <span className="text-ssu-cream/60 text-sm">Reference ID</span>
              <code className="text-ssu-gold-light font-mono text-lg font-medium tracking-wider">
                {refId}
              </code>
              <CopyRef value={refId} />
            </div>
          )}

          {isQueued && (
            <p
              role="status"
              className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left text-sm text-amber-100"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden />
              <span>
                We&apos;ve recorded your request. If you don&apos;t hear back within 24 hours,
                please email{" "}
                <a
                  href={`mailto:${SITE.fallbackEmail}?subject=${encodeURIComponent(`Build with SSU — ${refId ?? "request"}`)}`}
                  className="font-semibold underline"
                >
                  {SITE.fallbackEmail}
                </a>{" "}
                quoting {refId ? "the reference ID above" : "your organisation name"}.
              </span>
            </p>
          )}
        </div>

        <section aria-labelledby="next-title" className="mt-16">
          <h2 id="next-title" className="font-display mb-8 text-center text-3xl font-semibold">
            What happens next
          </h2>
          <ol className="relative grid gap-5 md:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="card-dark p-6">
                <span className="border-ssu-gold/50 text-ssu-gold-light inline-flex size-9 items-center justify-center rounded-full border font-mono text-sm">
                  {i + 1}
                </span>
                <p className="text-tech-cyan mt-4 font-mono text-[11px] tracking-wider uppercase">
                  {s.when}
                </p>
                <p className="font-display mt-1 text-2xl font-semibold">{s.title}</p>
                <p className="text-ssu-cream/65 mt-2 text-sm leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/projects" className={buttonClass("gold")}>
            Explore student builds <ArrowRight className="size-4" aria-hidden />
          </Link>
          {refId && <IcsReminder refId={refId} contactEmail={SITE.fallbackEmail} />}
        </div>

        <section aria-labelledby="contacts-title" className="mt-16">
          <h2
            id="contacts-title"
            className="text-ssu-gold mb-6 text-center font-mono text-xs tracking-[0.2em] uppercase"
          >
            {"// Need us sooner?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map((c) => (
              <ContactCard key={c.name} c={c} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
