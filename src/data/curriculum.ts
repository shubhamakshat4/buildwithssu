import type { ProgramCode } from "./projects";

/**
 * [VERIFY] against the official syllabus. Edit here — the Curriculum section
 * renders whatever is in this file.
 */

export type CurriculumTrack = {
  program: ProgramCode;
  label: string;
  layers: {
    foundations: string[];
    core: string[];
    advanced: string[];
    capstone: string[];
  };
  tooling: string[];
};

export const LAYER_META = [
  { key: "foundations", title: "Foundations", years: "Year 1–2" },
  { key: "core", title: "Core", years: "Year 2–3" },
  { key: "advanced", title: "Advanced", years: "Year 3–4" },
  { key: "capstone", title: "Industry Capstone", years: "Year 4" },
] as const;

export const CURRICULUM: CurriculumTrack[] = [
  {
    program: "AIML",
    label: "AI & ML",
    layers: {
      foundations: ["Python", "DSA", "Linear Algebra & Probability", "DBMS", "Operating Systems"],
      core: [
        "Machine Learning",
        "Deep Learning (CNN / RNN / Transformers)",
        "NLP",
        "Computer Vision",
        "MLOps basics",
      ],
      advanced: [
        "Generative AI & LLM Engineering (RAG, fine-tuning, agents)",
        "Reinforcement Learning",
        "Edge AI",
        "Responsible / Explainable AI",
      ],
      capstone: ["Industry-sponsored project", "Hackathons — SIH, Adobe, ISRO Bharatiya Antariksh"],
    },
    tooling: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "OpenCV",
      "YOLOv8",
      "Hugging Face",
      "LangChain",
      "Streamlit",
      "FastAPI",
      "Docker",
      "Git",
    ],
  },
  {
    program: "DS",
    label: "Data Science",
    layers: {
      foundations: ["Python / R", "Statistics", "SQL", "Data Structures"],
      core: [
        "EDA & Visualisation",
        "ML for Analytics",
        "Big Data (Spark)",
        "Data Engineering & Pipelines",
        "Time-series",
      ],
      advanced: [
        "Deep Learning for Data",
        "Recommender Systems",
        "Cloud Data Platforms",
        "Business Analytics & Storytelling",
      ],
      capstone: ["Live-data industry project"],
    },
    tooling: [
      "pandas",
      "NumPy",
      "PostgreSQL",
      "Power BI",
      "Tableau",
      "Spark",
      "Airflow",
      "AWS",
      "GCP",
      "Streamlit",
    ],
  },
  {
    program: "CSCD",
    label: "Cyber Defense",
    layers: {
      foundations: ["Networking (CCNA-level)", "Linux", "OS internals", "Cryptography"],
      core: [
        "Network Security & Firewalls",
        "Ethical Hacking & VAPT",
        "SOC Operations & SIEM",
        "Web App Security (OWASP Top 10)",
        "Secure Coding",
      ],
      advanced: [
        "ICS/SCADA & OT Security",
        "Cloud Security (AWS)",
        "Threat Intelligence & Threat Hunting",
        "Zero-Trust Architecture",
        "Red / Blue Team labs",
        "AI for Security",
      ],
      capstone: ["Enterprise network design", "Live SOC internship — OCAC CSOC, Govt. of Odisha"],
    },
    tooling: [
      "Kali Linux",
      "Nmap",
      "Wireshark",
      "Burp Suite",
      "Metasploit",
      "Suricata",
      "Snort",
      "Zeek",
      "Wazuh",
      "ArcSight",
      "Splunk",
      "Cisco Packet Tracer",
      "OpenPLC",
      "MITRE ATT&CK",
    ],
  },
  {
    program: "FORENSICS",
    label: "Digital Forensics",
    layers: {
      foundations: [
        "Computer & Network Forensics",
        "Legal & Ethical Framework (IT Act, chain of custody)",
        "Cryptography",
      ],
      core: [
        "Disk & File-system Forensics",
        "Memory Forensics",
        "Malware Analysis",
        "Mobile & Android Forensics",
        "OSINT",
      ],
      advanced: [
        "Cloud Forensics & Incident Response on AWS",
        "Dark-web Monitoring",
        "Ransomware & Insider-threat Detection",
        "Digital Twin Security",
        "Zero-Trust & Continuous Verification",
      ],
      capstone: ["End-to-end incident investigation with admissible reporting"],
    },
    tooling: [
      "Autopsy",
      "Volatility",
      "FTK",
      "WinHex",
      "YARA",
      "Steghide",
      "ExifTool",
      "JADX",
      "Apktool",
      "AWS Lambda",
      "EC2",
      "SNS",
      "CloudTrail",
      "GuardDuty",
      "Tor / OSINT stacks",
    ],
  },
  {
    program: "CORE",
    label: "Core CS",
    layers: {
      foundations: ["C / C++ / Java / Python", "DSA", "Discrete Math", "Digital Logic"],
      core: [
        "Operating Systems",
        "DBMS",
        "Computer Networks",
        "Software Engineering",
        "Web & Mobile Dev",
        "Cloud & DevOps",
      ],
      advanced: [
        "Distributed Systems",
        "System Design",
        "Compiler & Architecture",
        "AI/ML electives",
        "Blockchain",
      ],
      capstone: ["Full-stack product", "Apprenticeship"],
    },
    tooling: [
      "React",
      "Next.js",
      "Node",
      "Spring",
      "Flask",
      "Django",
      "PostgreSQL",
      "Firebase",
      "Docker",
      "Jenkins CI/CD",
      "AWS",
    ],
  },
];

export const INDUSTRY_PARTNERS: string[] = [
  "L&T EduTech",
  "Intel",
  "HCLTech",
  "IBM",
  "IESA",
  "Cyber Dojo",
  "Hi-Tech Animation",
];
