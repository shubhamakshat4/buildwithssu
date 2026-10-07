"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-ssu-gold/15 bg-ssu-ink/85 border-b backdrop-blur-xl"
          : "bg-ssu-ink/40 border-b border-transparent backdrop-blur-sm",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} — home`}>
          <Logo size={34} />
          <span className="leading-none">
            <span className="font-display text-ssu-cream block text-xl font-semibold whitespace-nowrap">
              Build with <span className="text-ssu-gold">SSU</span>
            </span>
            <span className="text-ssu-cream/50 hidden font-mono text-[10px] tracking-[0.18em] uppercase sm:block">
              FET · Sri Sri University
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-ssu-cream/75 hover:text-ssu-gold-light text-sm transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/collaborate" className={buttonClass("gold", "px-5 py-2.5 max-sm:hidden")}>
            Start a Collaboration
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-ssu-cream rounded-full p-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <m.div
              key="scrim"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <m.div
              key="sheet"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="border-ssu-gold/20 bg-ssu-ink fixed inset-y-0 right-0 z-50 flex h-dvh w-[82%] max-w-sm flex-col border-l p-6 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-ssu-gold font-mono text-xs tracking-[0.2em] uppercase">
                  {"// Menu"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ssu-cream rounded-full p-2"
                  aria-label="Close menu"
                  autoFocus
                >
                  <X className="size-6" />
                </button>
              </div>
              <ul className="space-y-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-ssu-cream hover:text-ssu-gold-light block rounded-xl px-3 py-3 text-2xl hover:bg-white/5"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/projects"
                    onClick={() => setOpen(false)}
                    className="font-display text-ssu-cream hover:text-ssu-gold-light block rounded-xl px-3 py-3 text-2xl hover:bg-white/5"
                  >
                    All projects
                  </Link>
                </li>
              </ul>
              <Link
                href="/collaborate"
                onClick={() => setOpen(false)}
                className={buttonClass("gold", "mt-auto w-full")}
              >
                Start a Collaboration <ArrowRight className="size-4" aria-hidden />
              </Link>
              <p className="text-ssu-cream/40 mt-4 text-center font-mono text-xs">{SITE.tagline}</p>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
