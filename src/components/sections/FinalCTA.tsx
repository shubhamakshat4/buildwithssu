import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="bg-ssu-cream px-4 pb-20 md:pb-28" aria-labelledby="cta-title">
      <Reveal className="bg-ssu-maroon text-ssu-cream relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center md:py-20">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="bg-ssu-gold/25 absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full blur-3xl"
        />
        <h2
          id="cta-title"
          className="font-display relative text-5xl leading-none font-semibold md:text-7xl"
        >
          Let&apos;s build <span className="gold-text">something real.</span>
        </h2>
        <p className="text-ssu-cream/75 relative mx-auto mt-5 max-w-md text-lg">
          3-minute form. A reply within 2 working days.
        </p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink
            href="/collaborate?intent=build"
            variant="gold"
            className="px-7 py-3.5 text-base"
          >
            Propose a project <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink
            href="/collaborate?intent=hire"
            variant="outline-light"
            className="px-7 py-3.5 text-base"
          >
            Hire our students
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
