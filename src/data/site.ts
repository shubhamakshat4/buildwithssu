/**
 * Site-wide constants. Edit freely — components read everything from here.
 */

export const SITE = {
  name: "Build with SSU",
  tagline: "Learn · Lead · Serve",
  faculty: "Faculty of Engineering & Technology",
  university: "Sri Sri University",
  city: "Cuttack, Odisha",
  description:
    "Co-create prototypes, MVPs and research with engineers trained in AI, Data Science, Cyber Defense and Digital Forensics at the Faculty of Engineering & Technology, Sri Sri University — and hire them before anyone else does.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://build.srisriuniversity.edu.in").replace(
    /\/$/,
    "",
  ),
  universityUrl: "https://srisriuniversity.edu.in",
  /** Swap to "/logo-ssu.png" after dropping the official logo into /public. */
  logoSrc: "/logo-ssu.svg",
  /** Optional campus photo shown faintly behind the hero, e.g. "/campus-hero.jpg". null = none. */
  heroImage: null as string | null,
  /** Shown when the Sheets webhook is down. */
  fallbackEmail: "akshat.s@srisriuniversity.edu.in",
} as const;

/** Privacy switch: student team names are hidden unless this env var is "true". */
export const SHOW_STUDENT_NAMES = process.env.NEXT_PUBLIC_SHOW_STUDENT_NAMES === "true";

export const NAV_LINKS = [
  { label: "Work with us", href: "/#partner" },
  { label: "Builds", href: "/#builds" },
  { label: "Talent", href: "/#talent" },
  { label: "Placements", href: "/#placements" },
  { label: "Achievements", href: "/#achievements" },
] as const;

export const ADDRESS = {
  lines: [
    "Sri Sri University",
    "Bidyadharpur Arilo, Ward No. 3, Godisahi",
    "Cuttack, Odisha – 754006",
  ],
  street: "Bidyadharpur Arilo, Ward No. 3, Godisahi",
  locality: "Cuttack",
  region: "Odisha",
  postalCode: "754006",
  country: "IN",
};

/** [VERIFY] handles — the brief specified "/SriSriU". */
export const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/SriSriU" },
  { label: "Instagram", href: "https://www.instagram.com/SriSriU" },
  { label: "X", href: "https://x.com/SriSriU" },
  { label: "YouTube", href: "https://www.youtube.com/@SriSriU" },
];
