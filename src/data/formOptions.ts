/** Option lists for the partner intake form. Edit labels here — values are stored in the Sheet. */

export const ORG_TYPES = [
  "Startup",
  "SME",
  "Enterprise",
  "Research Lab",
  "Government / PSU",
  "NGO",
  "Other",
];

export const INDUSTRIES = [
  "IT Services",
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Cybersecurity",
  "AI / Analytics",
  "Manufacturing",
  "AgriTech",
  "E-commerce",
  "Consulting",
  "Other",
];

export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

export const PREFERRED_CONTACT = ["Email", "Phone", "WhatsApp"];

export const YES_NO = ["Yes", "No"];
export const YES_NO_MAYBE = ["Yes", "No", "Maybe"];
export const YES_NO_DISCUSS = ["Yes", "No", "Discuss"];

export type IntentKey = "build" | "research" | "interns" | "fulltime";

export const INTENTS: {
  key: IntentKey;
  title: string;
  blurb: string;
  icon: "Rocket" | "FlaskConical" | "GraduationCap" | "Briefcase";
}[] = [
  {
    key: "build",
    title: "Build a Project / Prototype / MVP",
    blurb: "Student team + faculty mentor, 6–16 week sprints.",
    icon: "Rocket",
  },
  {
    key: "research",
    title: "Research Collaboration",
    blurb: "Joint publications, sponsored research, lab access.",
    icon: "FlaskConical",
  },
  {
    key: "interns",
    title: "Hire Interns",
    blurb: "2–6 month interns, on-site, remote or hybrid.",
    icon: "GraduationCap",
  },
  {
    key: "fulltime",
    title: "Hire Full-time",
    blurb: "Campus hiring for 2026–2028 batches.",
    icon: "Briefcase",
  },
];

export const INTENT_LABEL: Record<IntentKey, string> = {
  build: "Build a Project",
  research: "Research",
  interns: "Hire Interns",
  fulltime: "Hire Full-time",
};

// ── Build ──
export const BUILD_DOMAINS = [
  "AI/ML",
  "Data Science",
  "Cyber Security",
  "Digital Forensics",
  "Cloud",
  "Web/Mobile",
  "IoT",
  "Other",
];
export const DELIVERABLES = ["PoC", "Prototype", "MVP", "Production module", "Technical study"];
export const TIMELINES = ["4–6 weeks", "8–12 weeks", "16+ weeks", "Ongoing"];
export const TEAM_SIZES = ["1–2", "3–5", "6+"];
export const DATA_AVAILABILITY = [
  "We'll provide data",
  "Public data",
  "Synthetic OK",
  "Needs discussion",
];
export const BUDGETS = [
  "Unfunded – academic credit",
  "Stipend for students",
  "Sponsored project",
  "Discuss",
];
export const SPONSOR_RANGES = ["< ₹1 L", "₹1–3 L", "₹3–10 L", "₹10–25 L", "₹25 L+"];
export const IP_PREFS = ["Assigned to company", "Joint", "Open-source", "Discuss"];

// ── Research ──
export const RESEARCH_TYPES = [
  "Joint publication",
  "Sponsored research",
  "Dataset or lab access",
  "PhD co-guidance",
  "Consultancy",
];
export const RESEARCH_DURATIONS = ["< 3 months", "3–6 months", "6–12 months", "12+ months"];

// ── Hiring ──
export const PROGRAM_CHOICES = ["AIML", "DS", "CSCD", "Forensics", "Core CS", "Any"];
export const WORK_MODES = ["On-site", "Remote", "Hybrid"];
export const INTERN_DURATIONS = ["1–2 months", "3 months", "6 months", "12 months"];
export const STIPENDS = [
  "Unpaid – academic credit",
  "< ₹5k / month",
  "₹5k–10k / month",
  "₹10k–20k / month",
  "₹20k–40k / month",
  "₹40k+ / month",
];
export const BATCHES = ["2026", "2027", "2028"];
export const CTC_BANDS = ["< 4 L", "4–6 L", "6–10 L", "10–15 L", "15 L+"];
export const JOINING_TIMELINES = [
  "Immediately after graduation",
  "Within 3 months of graduation",
  "Flexible",
];

// ── Any intent ──
export const OTHER_ENGAGEMENT = [
  "Guest lecture",
  "Curriculum co-design",
  "Hackathon sponsorship",
  "Lab setup",
  "Campus visit",
  "Faculty development",
];

export const HEARD_FROM = [
  "Email from SSU",
  "LinkedIn",
  "Referral / colleague",
  "SSU alumnus",
  "Event / hackathon",
  "Search",
  "Other",
];

export const FREE_MAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.in",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "rediffmail.com",
  "yandex.com",
  "gmx.com",
  "mail.com",
];
