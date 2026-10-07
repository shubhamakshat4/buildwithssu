import { TechBackdrop } from "@/components/ui/TechBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { BuildsShowcase } from "./BuildsShowcase";

export function Builds() {
  return (
    <section
      id="builds"
      className="section bg-ssu-ink text-ssu-cream relative isolate overflow-hidden"
      aria-labelledby="builds-title"
    >
      <TechBackdrop glow="cyan" className="-z-10" />
      <div className="container-x">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-tech-cyan mb-3 text-sm font-semibold">Student builds</p>
          <h2
            id="builds-title"
            className="font-display text-5xl leading-none font-semibold md:text-6xl"
          >
            Real problems. <span className="gold-text">Working solutions.</span>
          </h2>
        </Reveal>
        <BuildsShowcase />
      </div>
    </section>
  );
}
