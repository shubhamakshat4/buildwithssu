import { Mail, Phone } from "lucide-react";
import type { Contact } from "@/data/team";
import { cn } from "@/lib/cn";

export function ContactCard({ c, tone = "dark" }: { c: Contact; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  const link = cn(
    "flex items-center gap-2 break-all transition-colors",
    dark ? "text-ssu-cream/70 hover:text-ssu-gold-light" : "text-ssu-ink/70 hover:text-ssu-maroon",
  );
  return (
    <div className={cn("p-5", dark ? "card-dark" : "card-light")}>
      <p className={cn("font-semibold", dark ? "text-ssu-cream" : "text-ssu-ink")}>{c.name}</p>
      <p className={cn("mb-3 text-xs", dark ? "text-ssu-gold/80" : "text-ssu-maroon/80")}>
        {c.role}
      </p>
      <div className="space-y-1.5 text-sm">
        {c.phone && (
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={link}>
            <Phone className="size-3.5 shrink-0" aria-hidden /> {c.phone}
          </a>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className={link}>
            <Mail className="size-3.5 shrink-0" aria-hidden /> {c.email}
          </a>
        )}
      </div>
    </div>
  );
}
