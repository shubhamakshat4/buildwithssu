import type { Metadata } from "next";
import { Suspense } from "react";
import { PROJECTS } from "@/data/projects";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export const metadata: Metadata = {
  title: "Student Builds",
  description:
    "Projects built by FET, Sri Sri University students — AI/ML, data science, cyber defense, SOC/SIEM, OT/ICS security, cloud forensics and full-stack.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="bg-ssu-ink text-ssu-cream relative isolate min-h-screen pt-28 pb-24 md:pt-36">
      <TechBackdrop particles={false} glow="cyan" className="-z-10 h-[40rem]" />
      <div className="container-x">
        <header className="mb-10 max-w-3xl">
          <p className="text-tech-cyan mb-3 text-sm font-semibold">
            {PROJECTS.length} student builds
          </p>
          <h1 className="font-display text-5xl leading-none font-semibold md:text-7xl">
            Real problems. <span className="gold-text">Working solutions.</span>
          </h1>
          <p className="text-ssu-cream/65 mt-5 text-lg">
            Tap any build to see the problem, the solution and the stack.
          </p>
        </header>
        <Suspense fallback={<div className="h-96" />}>
          <ProjectsExplorer />
        </Suspense>
      </div>
    </div>
  );
}
