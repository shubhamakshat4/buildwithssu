#!/usr/bin/env node
/**
 * npm run test:webhook            → posts a sample flattened payload straight to SHEETS_WEBHOOK_URL
 * npm run test:webhook -- --api   → posts a sample form submission to http://localhost:3000/api/collaborate
 *                                   (run `npm run dev` first; tests validation + flattening + webhook)
 * Env is read from .env.local (Node ≥ 20.6 --env-file-if-exists).
 */

const useApi = process.argv.includes("--api");
const apiBase = process.env.TEST_API_BASE || "http://localhost:3000";

const now = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().replace(/\.\d+Z$/, "+05:30");
const ref = `SSU-FET-${now.slice(0, 4)}${now.slice(5, 7)}-TEST`;

const formSubmission = {
  orgName: "Acme Test Labs",
  orgWebsite: "https://acme.example.com",
  orgType: "Startup",
  industry: "Cybersecurity",
  companySize: "11–50",
  hqLocation: "Bengaluru, India",
  orgAbout: "Test submission from scripts/test-webhook.mjs — safe to delete.",
  contactName: "Test Person",
  designation: "CTO",
  contactEmail: "test@acme.example.com",
  contactPhone: "+91 90000 00000",
  preferredContact: "Email",
  isAlumnus: "No",
  alumnusConnection: "",
  intents: ["build", "interns"],
  build: {
    problem: "Build a Suricata rule-tuning assistant that cuts false positives by 50%.",
    domains: ["Cyber Security", "AI/ML"],
    deliverable: "Prototype",
    timeline: "8–12 weeks",
    teamSize: "3–5",
    techPrefs: "Python, Suricata, Elastic",
    dataAvailability: "We'll provide data",
    budget: "Stipend for students",
    budgetRange: "",
    ipPreference: "Joint",
    nda: "Yes",
    mentor: "Yes",
  },
  research: { area: "", type: "", duration: "", funding: "", faculty: "", description: "" },
  interns: {
    count: "3",
    programs: ["CSCD", "AIML"],
    role: "SOC Analyst Intern",
    skills: ["Wazuh", "Python", "Linux"],
    mode: "Hybrid",
    location: "Bengaluru",
    duration: "6 months",
    startMonth: "2027-01",
    stipend: "₹20k–40k / month",
    ppo: "Yes",
    selection: "Résumé screen → assessment → interview",
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
  otherEngagement: ["Guest lecture", "Hackathon sponsorship"],
  heardFrom: "Email from SSU",
  consent: true,
  sendCopy: false,
  website_url: "",
  sourcePage: "scripts/test-webhook.mjs",
};

function flatSample() {
  const flat = {
    referenceId: ref,
    submittedAt: now,
    intents: "build,interns",
    orgName: formSubmission.orgName,
    orgWebsite: formSubmission.orgWebsite,
    orgType: formSubmission.orgType,
    industry: formSubmission.industry,
    companySize: formSubmission.companySize,
    hqLocation: formSubmission.hqLocation,
    orgAbout: formSubmission.orgAbout,
    contactName: formSubmission.contactName,
    designation: formSubmission.designation,
    contactEmail: formSubmission.contactEmail,
    freeMail: "false",
    contactPhone: formSubmission.contactPhone,
    preferredContact: "Email",
    isAlumnus: "No",
    alumnusConnection: null,
    otherEngagement: formSubmission.otherEngagement.join(", "),
    heardFrom: formSubmission.heardFrom,
    consent: "true",
    sendCopy: "false",
    userAgent: "test-webhook.mjs",
    sourcePage: "scripts/test-webhook.mjs",
  };
  for (const [section, data] of Object.entries({
    build: formSubmission.build,
    research: formSubmission.research,
    interns: formSubmission.interns,
    fulltime: formSubmission.fulltime,
  })) {
    const active = flat.intents.split(",").includes(section);
    for (const [k, v] of Object.entries(data)) {
      const val = Array.isArray(v) ? v.join(", ") : v;
      flat[`${section}_${k}`] = active && val ? val : null;
    }
  }
  return flat;
}

async function main() {
  if (useApi) {
    const url = `${apiBase}/api/collaborate`;
    console.log(`→ POST ${url}`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formSubmission),
    });
    console.log(`← ${res.status}`, await res.text());
    process.exit(res.ok ? 0 : 1);
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SHARED_SECRET;
  if (!url || !secret) {
    console.error("✗ Set SHEETS_WEBHOOK_URL and SHEETS_SHARED_SECRET in .env.local first.");
    process.exit(1);
  }
  console.log(`→ POST ${url.replace(/\/s\/[^/]+/, "/s/…")}  (ref ${ref})`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...flatSample(), secret }),
    redirect: "follow",
  });
  const text = await res.text();
  console.log(`← ${res.status}`, text.slice(0, 500));
  let ok = false;
  try {
    ok = JSON.parse(text).ok === true;
  } catch {}
  console.log(
    ok
      ? "✓ Row written — check the 'All Submissions' tab."
      : "✗ Webhook did not return { ok: true }.",
  );
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("✗", err);
  process.exit(1);
});
