import type { ProgramCode } from "./projects";

export type Program = {
  code: ProgramCode;
  name: string;
  short: string;
  pitch: string;
  building: string[];
  tools: string[];
  icon: "Brain" | "BarChart3" | "ShieldCheck" | "Fingerprint" | "Code2";
  /** CSS background for the tile. */
  gradient: string;
  accent: string;
  footnote?: string;
  /** [VERIFY] flag for faculty. */
  verify?: boolean;
};

export const PROGRAMS: Program[] = [
  {
    code: "AIML",
    name: "B.Tech CSE — Artificial Intelligence & Machine Learning",
    short: "AI & ML",
    pitch:
      "Engineers who go from notebook to deployed model — computer vision, NLP and LLM applications with real users.",
    building: [
      "Computer-vision systems — detection, recognition, drowsiness alerts",
      "LLM apps with RAG, agents and multilingual interfaces",
      "Predictive models for HR, retail and healthcare data",
      "Resume screeners, recommenders and decision-support tools",
      "Edge-AI prototypes on low-cost hardware",
    ],
    tools: ["PyTorch", "TensorFlow", "Hugging Face", "LangChain", "OpenCV", "FastAPI"],
    icon: "Brain",
    gradient: "linear-gradient(135deg, #3b0a45 0%, #6E0F1F 55%, #a57f16 120%)",
    accent: "#E8CF7A",
  },
  {
    code: "DS",
    name: "B.Tech CSE — Data Science",
    short: "Data Science",
    pitch:
      "Analysts and data engineers who turn messy operational data into pipelines, dashboards and decisions.",
    building: [
      "SQL-heavy market and workforce analyses on real datasets",
      "Data-cleaning and EDA pipelines with reproducible notebooks",
      "Live-API ingestion and time-series analysis",
      "BI dashboards for business stakeholders",
      "Forecasting and recommender prototypes",
    ],
    tools: ["pandas", "PostgreSQL", "Power BI", "Spark", "Airflow", "Streamlit"],
    icon: "BarChart3",
    gradient: "linear-gradient(135deg, #0e2230 0%, #1d4f63 60%, #2aa39b 130%)",
    accent: "#35D0C6",
  },
  {
    code: "CSCD",
    name: "B.Tech CSE — Cyber Security & Cyber Defense",
    short: "Cyber Defense",
    pitch:
      "Blue- and red-team engineers who build SOC pipelines, simulate ICS attacks and harden cloud workloads.",
    building: [
      "SCADA/ICS attack-simulation and detection labs",
      "Multi-VM SOC pipelines with custom IDS rules",
      "ML-assisted web application firewalls",
      "Cloud deception — honeypots and canaries on AWS",
      "Enterprise network designs with segmentation & VPN",
    ],
    tools: ["Suricata", "Wazuh", "Zeek", "Burp Suite", "Splunk", "MITRE ATT&CK"],
    icon: "ShieldCheck",
    gradient: "linear-gradient(135deg, #120d10 0%, #133a3a 60%, #1f7f79 130%)",
    accent: "#35D0C6",
  },
  {
    code: "FORENSICS",
    name: "Cyber Security & Digital Forensics",
    short: "Digital Forensics",
    pitch:
      "Investigators who recover evidence, analyse malware and automate cloud incident response — with admissible reporting.",
    building: [
      "Memory forensics and malware triage with Volatility",
      "Automated evidence collection on AWS",
      "Ransomware and insider-threat detection",
      "Dark-web and leaked-credential monitoring via OSINT",
      "Zero-trust architectures with forensic logging",
    ],
    tools: ["Autopsy", "Volatility", "YARA", "FTK", "CloudTrail", "GuardDuty"],
    icon: "Fingerprint",
    gradient: "linear-gradient(135deg, #2B2430 0%, #4A0A15 60%, #8a6a14 130%)",
    accent: "#C9A227",
    footnote: "M.Tech / M.Sc. CSDF · B.Sc. Forensic Science",
    verify: true,
  },
  {
    code: "CORE",
    name: "B.Tech CSE — Core Computer Science",
    short: "Core CS",
    pitch:
      "Full-stack builders with strong fundamentals — systems, web, mobile and cloud — who ship complete products.",
    building: [
      "Real-time web apps — auctions, chat, trackers",
      "Full-stack products on React/Next.js + Node",
      "Mobile-first apps with Firebase backends",
      "CI/CD pipelines and containerised services",
      "System-design and distributed-systems projects",
    ],
    tools: ["React", "Next.js", "Node", "Spring", "Docker", "AWS"],
    icon: "Code2",
    gradient: "linear-gradient(135deg, #4A0A15 0%, #6E0F1F 55%, #2B2430 120%)",
    accent: "#E8CF7A",
    footnote: "Also: BCA · MCA · B.Sc. (Hons.) Computer Science",
  },
];

export const OTHER_FET_PROGRAMS =
  "Also at FET: Electrical (AI & EV), Mechanical (AI & Robotics), ECE (AI & VLSI), B.Sc. AI Animation, MCA (AI / Cyber / Data Science).";

export const PROGRAM_LABEL: Record<ProgramCode, string> = {
  AIML: "AI & ML",
  DS: "Data Science",
  CSCD: "Cyber Defense",
  FORENSICS: "Forensics",
  CORE: "Core CS",
};

/** Tag colours for project cards. */
export const PROGRAM_COLOR: Record<ProgramCode, string> = {
  AIML: "#E8CF7A",
  DS: "#7AA5E8",
  CSCD: "#35D0C6",
  FORENSICS: "#E0798C",
  CORE: "#C79AE3",
};
