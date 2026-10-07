/* eslint-disable @next/next/no-img-element -- tiny local SVG/PNG, no optimisation needed */
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

/** SSU crest. Reads SITE.logoSrc so faculty can swap in the official PNG. */
export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img
      src={SITE.logoSrc}
      alt="Sri Sri University crest"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}
