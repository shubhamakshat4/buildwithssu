import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Paths } from "@/components/sections/Paths";
import { Builds } from "@/components/sections/Builds";
import { Talent } from "@/components/sections/Talent";
import { Proof } from "@/components/sections/Proof";
import { Placements } from "@/components/sections/Placements";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Paths />
      <Builds />
      <section id="talent" className="section bg-ssu-cream" aria-labelledby="talent-title">
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <p className="text-ssu-maroon mb-3 text-sm font-semibold">Talent</p>
            <h2
              id="talent-title"
              className="font-display text-5xl leading-none font-semibold md:text-6xl"
            >
              Five specialisations. <em className="text-ssu-maroon">One standard.</em>
            </h2>
          </Reveal>
          <Talent />
        </div>
      </section>
      <Placements />
      <Proof />
      <FAQ />
      <FinalCTA />
    </>
  );
}
