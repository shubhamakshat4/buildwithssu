import type { IntentKey } from "@/data/formOptions";

export type FormValues = {
  // Step 1
  orgName: string;
  orgWebsite: string;
  orgType: string;
  industry: string;
  companySize: string;
  hqLocation: string;
  orgAbout: string;
  // Step 2
  contactName: string;
  designation: string;
  contactEmail: string;
  contactPhone: string;
  preferredContact: string;
  isAlumnus: string;
  alumnusConnection: string;
  // Step 3
  intents: IntentKey[];
  build: {
    problem: string;
    domains: string[];
    deliverable: string;
    timeline: string;
    teamSize: string;
    techPrefs: string;
    dataAvailability: string;
    budget: string;
    budgetRange: string;
    ipPreference: string;
    nda: string;
    mentor: string;
  };
  research: {
    area: string;
    type: string;
    duration: string;
    funding: string;
    faculty: string;
    description: string;
  };
  interns: {
    count: string;
    programs: string[];
    role: string;
    skills: string[];
    mode: string;
    location: string;
    duration: string;
    startMonth: string;
    stipend: string;
    ppo: string;
    selection: string;
  };
  fulltime: {
    openings: string;
    role: string;
    programs: string[];
    minCgpa: string;
    backlogsAllowed: string;
    batches: string[];
    skills: string[];
    locations: string;
    ctc: string;
    bond: string;
    joiningTimeline: string;
    selection: string;
    jdLink: string;
    jdText: string;
  };
  otherEngagement: string[];
  // Step 4
  heardFrom: string;
  consent: boolean;
  sendCopy: boolean;
  /** Honeypot */
  website_url: string;
};

export const DEFAULT_VALUES: FormValues = {
  orgName: "",
  orgWebsite: "",
  orgType: "",
  industry: "",
  companySize: "",
  hqLocation: "",
  orgAbout: "",
  contactName: "",
  designation: "",
  contactEmail: "",
  contactPhone: "+91 ",
  preferredContact: "Email",
  isAlumnus: "No",
  alumnusConnection: "",
  intents: [],
  build: {
    problem: "",
    domains: [],
    deliverable: "",
    timeline: "",
    teamSize: "",
    techPrefs: "",
    dataAvailability: "",
    budget: "",
    budgetRange: "",
    ipPreference: "",
    nda: "No",
    mentor: "Yes",
  },
  research: { area: "", type: "", duration: "", funding: "", faculty: "", description: "" },
  interns: {
    count: "",
    programs: [],
    role: "",
    skills: [],
    mode: "",
    location: "",
    duration: "",
    startMonth: "",
    stipend: "",
    ppo: "",
    selection: "",
  },
  fulltime: {
    openings: "",
    role: "",
    programs: [],
    minCgpa: "",
    backlogsAllowed: "",
    batches: [],
    skills: [],
    locations: "",
    ctc: "",
    bond: "",
    joiningTimeline: "",
    selection: "",
    jdLink: "",
    jdText: "",
  },
  otherEngagement: [],
  heardFrom: "",
  consent: false,
  sendCopy: true,
  website_url: "",
};

export const STEPS = [
  { title: "Organisation", blurb: "Who you are" },
  { title: "Point of contact", blurb: "Who we talk to" },
  { title: "Collaboration intent", blurb: "What you need" },
  { title: "Review & submit", blurb: "Check and send" },
] as const;
