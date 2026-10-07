import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ADDRESS, NAV_LINKS, SITE, SOCIAL } from "@/data/site";
import { getContacts } from "@/data/team";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const contacts = getContacts();
  return (
    <footer className="bg-ssu-maroon-deep text-ssu-cream">
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="font-display text-2xl font-semibold">
                Build with <span className="text-ssu-gold">SSU</span>
              </p>
              <p className="text-ssu-cream/55 text-xs">{SITE.faculty}</p>
            </div>
          </div>
          <p className="text-ssu-cream/60 mt-5 flex gap-2 text-sm">
            <MapPin className="text-ssu-gold mt-0.5 size-4 shrink-0" aria-hidden />
            {ADDRESS.lines.join(", ")}
          </p>
          <nav aria-label="Footer" className="mt-6">
            <ul className="text-ssu-cream/70 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ssu-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={SITE.universityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ssu-gold-light"
                >
                  srisriuniversity.edu.in
                </a>
              </li>
            </ul>
          </nav>
          <ul
            className="text-ssu-cream/45 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs"
            aria-label="Social media"
          >
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ssu-gold-light"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-ssu-gold mb-4 text-sm font-semibold">Talk to a person</p>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {contacts.map((c) => (
              <li key={c.name} className="border-ssu-gold/30 border-l-2 pl-4">
                <p className="font-semibold">{c.name}</p>
                <p className="text-ssu-cream/50 text-xs">{c.role}</p>
                <div className="text-ssu-cream/75 mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="hover:text-ssu-gold-light inline-flex items-center gap-1.5"
                    >
                      <Phone className="size-3.5" aria-hidden /> {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:text-ssu-gold-light inline-flex items-center gap-1.5 break-all"
                    >
                      <Mail className="size-3.5 shrink-0" aria-hidden /> {c.email}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x text-ssu-cream/45 flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Sri Sri University</p>
          <p className="font-display text-ssu-gold-light text-base">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
