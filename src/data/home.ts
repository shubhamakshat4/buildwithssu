/** Short-form copy for the home page. Keep every line short — this page is skimmed, not read. */
import type { ProgramCode } from "./projects";

export const HERO = {
  eyebrow: "Faculty of Engineering & Technology · Sri Sri University",
  line1: "Build with SSU.",
  line2: "Hire with SSU.",
  sub: "Engineers in AI, Data, Cyber Defense and Forensics — ready to build with you, and to join you.",
  /** Tools orbiting the hero visual. Must exist in src/lib/toolIcons.ts. */
  orbit: [
    "PyTorch",
    "Kali Linux",
    "Docker",
    "Splunk",
    "OpenCV",
    "Wireshark",
    "Hugging Face",
    "React",
  ],
};

export type PathStep = {
  icon:
    | "MessageSquareText"
    | "Users"
    | "MonitorPlay"
    | "Rocket"
    | "FileText"
    | "ListChecks"
    | "Video"
    | "BadgeCheck";
  label: string;
};

export const PATHS = [
  {
    key: "build",
    title: "Build with us",
    promise: "Your problem. Our student team + faculty mentor.",
    meta: "6–16 week sprints",
    steps: [
      { icon: "MessageSquareText", label: "Share a problem" },
      { icon: "Users", label: "Get a matched team" },
      { icon: "MonitorPlay", label: "Weekly demos" },
      { icon: "Rocket", label: "Ship it — your IP" },
    ] as PathStep[],
    cta: "Propose a project",
    href: "/collaborate?intent=build",
  },
  {
    key: "hire",
    title: "Hire from us",
    promise: "Interns and full-time engineers, pre-screened.",
    meta: "Shortlist in 5 working days",
    steps: [
      { icon: "FileText", label: "Share the JD" },
      { icon: "ListChecks", label: "Shortlist in 5 days" },
      { icon: "Video", label: "Interview your way" },
      { icon: "BadgeCheck", label: "Make offers" },
    ] as PathStep[],
    cta: "Post a requirement",
    href: "/collaborate?intent=hire",
  },
] as const;

export const PROMISES = [
  "₹0 recruitment fee",
  "NDA on request",
  "Remote internships OK",
  "Reply within 2 working days",
];

/** Home showcase tabs. "All" uses SHOWCASE_PICKS; the rest pick featured builds by program. */
export const SHOWCASE_TABS: { key: string; label: string; programs: ProgramCode[] }[] = [
  { key: "all", label: "Highlights", programs: [] },
  { key: "cyber", label: "Cyber Defense", programs: ["CSCD"] },
  { key: "ai", label: "AI & ML", programs: ["AIML"] },
  { key: "forensics", label: "Forensics", programs: ["FORENSICS"] },
  { key: "data", label: "Data & Core", programs: ["DS", "CORE"] },
];

/** First id is the large spotlight card. */
export const SHOWCASE_PICKS = [
  "ics-redsim",
  "maya-sentinel-x",
  "skinova",
  "volatility-memory-forensics",
  "adaptive-firewall",
  "drowsiness-detection",
];

export type ProofTile = {
  value: string;
  label: string;
  detail?: string;
  size?: "lg";
  accent?: "cyan" | "gold";
};

export const PROOF: ProofTile[] = [
  {
    value: "Top 3.4%",
    label: "worldwide",
    detail: "HTB Holmes CTF 2025 · 240 of 7,085 teams",
    size: "lg",
    accent: "cyan",
  },
  { value: "Top 5", label: "Smart India Hackathon", detail: "University finalist, 2024" },
  { value: "9th", label: "nationally", detail: "CMR HackFest, Hyderabad" },
  {
    value: "#1",
    label: "in Odisha for employability",
    detail: "IIRF 2024 · Pvt. universities",
    accent: "gold",
  },
  { value: "~1,100", label: "students / year", detail: "through placement prep (PPP)" },
];

export const ACCREDITATIONS = [
  "NAAC 'A'",
  "UGC",
  "AICTE",
  "NBA",
  "AIU",
  "QS I-GAUGE",
  "UI GreenMetric #1 Odisha",
];
