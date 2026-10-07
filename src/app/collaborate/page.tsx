import type { Metadata } from "next";
import { CollaborateWizard } from "@/components/form/CollaborateWizard";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export const metadata: Metadata = {
  title: "Start a Collaboration",
  description:
    "Partner intake for Build with SSU — sponsor a project, start a research collaboration, or hire interns and graduates from the Faculty of Engineering & Technology, Sri Sri University.",
  alternates: { canonical: "/collaborate" },
};

export default async function CollaboratePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const { intent } = await searchParams;
  return (
    <div className="bg-ssu-ink relative isolate min-h-screen pt-24 pb-20 md:pt-32">
      <TechBackdrop particles={false} glow="both" className="-z-10" />
      <div className="container-x">
        <CollaborateWizard initialIntent={Array.isArray(intent) ? intent[0] : intent} />
      </div>
    </div>
  );
}
