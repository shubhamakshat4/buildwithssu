import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { TechBackdrop } from "@/components/ui/TechBackdrop";

export default function NotFound() {
  return (
    <div className="bg-ssu-ink text-ssu-cream relative isolate flex min-h-[80vh] items-center pt-24">
      <TechBackdrop glow="cyan" className="-z-10" />
      <div className="container-x text-center">
        <p className="text-tech-cyan font-mono text-sm">{"// 404 — route not found"}</p>
        <h1 className="font-display mt-4 text-6xl font-semibold">
          Nothing built here <span className="gold-text">yet.</span>
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass("gold")}>
            Back to home
          </Link>
          <Link href="/collaborate?intent=build" className={buttonClass("outline-light")}>
            Propose it as a project
          </Link>
        </div>
      </div>
    </div>
  );
}
