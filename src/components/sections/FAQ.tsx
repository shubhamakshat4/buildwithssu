import { Plus } from "lucide-react";
import { FAQS } from "@/data/faq";
import { Reveal } from "@/components/ui/Reveal";

/** Native <details> accordion: zero JS, keyboard accessible, works without hydration. */
export function FAQ() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="section bg-ssu-cream" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="text-ssu-maroon mb-3 text-sm font-semibold">FAQ</p>
          <h2 id="faq-title" className="font-display text-5xl leading-none font-semibold">
            Quick answers.
          </h2>
        </Reveal>
        <Reveal>
          <div className="divide-ssu-maroon/15 border-ssu-maroon/15 divide-y border-y">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="text-ssu-ink flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus
                    className="text-ssu-maroon size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="text-ssu-ink/65 -mt-1 pb-5">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
