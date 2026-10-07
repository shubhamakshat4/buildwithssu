"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { CalendarPlus, Check, Copy } from "lucide-react";

export function AnimatedCheck() {
  return (
    <m.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      className="relative mx-auto size-28"
    >
      <m.span
        aria-hidden
        className="bg-ssu-gold/25 absolute inset-0 rounded-full"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 1.6, repeat: 2, ease: "easeOut" }}
      />
      <svg viewBox="0 0 112 112" className="relative size-28" role="img" aria-label="Success">
        <circle cx="56" cy="56" r="52" fill="#C9A227" />
        <m.path
          d="M34 58 L50 73 L80 40"
          fill="none"
          stroke="#1A1216"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
    </m.div>
  );
}

export function CopyRef({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="border-ssu-gold/40 text-ssu-gold-light hover:border-ssu-gold hover:bg-ssu-gold/10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** Adds `n` working days (Mon–Fri) to a date. */
function addWorkingDays(d: Date, n: number) {
  const r = new Date(d);
  while (n > 0) {
    r.setDate(r.getDate() + 1);
    if (r.getDay() !== 0 && r.getDay() !== 6) n--;
  }
  return r;
}

const icsDate = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

export function IcsReminder({ refId, contactEmail }: { refId: string; contactEmail: string }) {
  const download = () => {
    const start = addWorkingDays(new Date(), 2);
    start.setHours(11, 0, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sri Sri University//Build with SSU//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${refId}@build-with-ssu`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:Follow up: Build with SSU request ${refId}`,
      `DESCRIPTION:Check for a response from SSU T&P / FET on request ${refId}. If you haven't heard back\\, email ${contactEmail} quoting the reference ID.`,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Build with SSU follow-up",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${refId}-follow-up.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      type="button"
      onClick={download}
      className="border-ssu-cream/25 text-ssu-cream hover:border-ssu-gold hover:text-ssu-gold-light inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
    >
      <CalendarPlus className="size-4" aria-hidden /> Add follow-up reminder (.ics)
    </button>
  );
}
