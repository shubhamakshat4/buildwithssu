/* eslint-disable @next/next/no-img-element -- small self-hosted logo files */
import logos from "@/data/logos.generated.json";
import { logoSlug } from "@/data/companies";
import { cn } from "@/lib/cn";

const MANIFEST = logos as Record<string, { src: string; size: number }>;

function initials(name: string) {
  const words = name
    .replace(/\(.*?\)/g, "")
    .split(/[\s&·/-]+/)
    .filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

/** Square logo tile (white background so every favicon reads cleanly). Monogram fallback. */
export function CompanyMark({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const logo = MANIFEST[logoSlug(name)];
  const style = { width: size, height: size };
  if (logo)
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1",
          className,
        )}
        style={style}
      >
        <img
          src={logo.src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
        />
      </span>
    );
  return (
    <span
      aria-hidden
      className={cn(
        "from-ssu-maroon to-ssu-maroon-deep font-display text-ssu-gold-light inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-semibold",
        className,
      )}
      style={{ ...style, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}

/** Logo + name. */
export function CompanyChip({
  name,
  label,
  tone = "light",
  size = 32,
  className,
}: {
  name: string;
  label?: string;
  tone?: "light" | "dark";
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border py-1.5 pr-4 pl-1.5 text-sm font-medium whitespace-nowrap",
        tone === "light"
          ? "border-ssu-ink/[0.08] text-ssu-ink/85 bg-white shadow-[0_1px_2px_rgba(26,18,22,.06)]"
          : "text-ssu-cream/90 border-white/10 bg-white/[0.04]",
        className,
      )}
    >
      <CompanyMark name={name} size={size} />
      {label ?? name}
    </span>
  );
}
