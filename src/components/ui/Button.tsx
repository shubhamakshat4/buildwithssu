import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "gold" | "outline-light" | "outline-dark" | "maroon" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "bg-ssu-gold text-ssu-ink hover:bg-ssu-gold-light shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)] hover:shadow-[0_14px_40px_-10px_rgba(201,162,39,0.9)]",
  maroon: "bg-ssu-maroon text-ssu-cream hover:bg-ssu-maroon-deep",
  "outline-light":
    "border border-ssu-cream/30 text-ssu-cream hover:border-ssu-gold hover:text-ssu-gold-light",
  "outline-dark":
    "border border-ssu-maroon/40 text-ssu-maroon hover:border-ssu-maroon hover:bg-ssu-maroon/5",
  ghost: "text-ssu-cream/80 hover:text-ssu-gold-light",
};

export function buttonClass(variant: Variant = "gold", className?: string) {
  return cn(base, variants[variant], className);
}

type LinkProps = React.ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "gold", className, ...rest }: LinkProps) {
  return <Link className={buttonClass(variant, className)} {...rest} />;
}
