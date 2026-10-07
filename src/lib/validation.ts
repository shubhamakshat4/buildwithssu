import { z } from "zod";
import { FREE_MAIL_DOMAINS, type IntentKey } from "@/data/formOptions";

/**
 * Validation for the partner intake form. Shared by the client wizard (per step)
 * and the /api/collaborate route handler (full payload).
 *
 * Intent sub-forms are lenient in shape and made strict by `refineIntents`,
 * so a field is only required when its intent is selected.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const PHONE_RE = /^\+\d[\d\s-]{6,18}$/;

const req = (msg: string, max = 200) =>
  z.string().trim().min(1, msg).max(max, `Max ${max} characters`);
const opt = (max = 200) => z.string().trim().max(max, `Max ${max} characters`).optional();
const list = () => z.array(z.string().trim().max(80)).max(30).optional();

// ── Step 1 · Organisation ──
export const orgSchema = z.object({
  orgName: req("Organisation name is required", 120),
  orgWebsite: req("Website or LinkedIn is required", 300).regex(
    URLISH_RE,
    "Enter a valid URL, e.g. acme.com or linkedin.com/company/acme",
  ),
  orgType: req("Choose an organisation type"),
  industry: req("Choose an industry"),
  companySize: req("Choose a company size"),
  hqLocation: req("HQ city / country is required", 120),
  orgAbout: opt(400),
});

// ── Step 2 · Point of contact ──
export const contactShape = z.object({
  contactName: req("Your name is required", 120),
  designation: req("Designation is required", 120),
  contactEmail: req("Work email is required", 200).regex(EMAIL_RE, "Enter a valid email address"),
  contactPhone: req("Phone is required", 30).regex(
    PHONE_RE,
    "Include the country code, e.g. +91 98765 43210",
  ),
  preferredContact: opt(20),
  isAlumnus: opt(5),
  alumnusConnection: opt(300),
});

type RefineCtx = z.RefinementCtx;

function need(ctx: RefineCtx, path: (string | number)[], ok: boolean, message: string) {
  if (!ok) ctx.addIssue({ code: "custom", path, message });
}

const filled = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;

function refineContact(v: z.infer<typeof contactShape>, ctx: RefineCtx) {
  if (v.isAlumnus === "Yes")
    need(ctx, ["alumnusConnection"], filled(v.alumnusConnection), "Tell us how you're connected");
}

export const contactSchema = contactShape.superRefine(refineContact);

// ── Step 3 · Intent ──
const buildShape = z.object({
  problem: opt(1500),
  domains: list(),
  deliverable: opt(),
  timeline: opt(),
  teamSize: opt(),
  techPrefs: opt(500),
  dataAvailability: opt(),
  budget: opt(),
  budgetRange: opt(),
  ipPreference: opt(),
  nda: opt(5),
  mentor: opt(5),
});

const researchShape = z.object({
  area: opt(200),
  type: opt(),
  duration: opt(),
  funding: opt(10),
  faculty: opt(200),
  description: opt(1500),
});

const internsShape = z.object({
  count: opt(5),
  programs: list(),
  role: opt(120),
  skills: list(),
  mode: opt(),
  location: opt(120),
  duration: opt(),
  startMonth: opt(10),
  stipend: opt(),
  ppo: opt(10),
  selection: opt(300),
});

const fulltimeShape = z.object({
  openings: opt(5),
  role: opt(120),
  programs: list(),
  minCgpa: opt(5),
  backlogsAllowed: opt(5),
  batches: list(),
  skills: list(),
  locations: opt(200),
  ctc: opt(),
  bond: opt(5),
  joiningTimeline: opt(),
  selection: opt(300),
  jdLink: opt(500),
  jdText: opt(4000),
});

const INTENT_KEYS = [
  "build",
  "research",
  "interns",
  "fulltime",
] as const satisfies readonly IntentKey[];

export const intentShape = z.object({
  intents: z.array(z.enum(INTENT_KEYS)).min(1, "Choose at least one way to work with us"),
  build: buildShape,
  research: researchShape,
  interns: internsShape,
  fulltime: fulltimeShape,
  otherEngagement: list(),
});

const POS_INT = /^[1-9]\d{0,3}$/;

function refineIntents(v: z.infer<typeof intentShape>, ctx: RefineCtx) {
  const has = (k: IntentKey) => v.intents.includes(k);

  if (has("build")) {
    const b = v.build;
    need(ctx, ["build", "problem"], filled(b.problem), "Describe the problem you'd like solved");
    need(ctx, ["build", "domains"], filled(b.domains), "Pick at least one domain");
    need(ctx, ["build", "deliverable"], filled(b.deliverable), "Choose an expected deliverable");
    need(ctx, ["build", "timeline"], filled(b.timeline), "Choose a timeline");
    need(
      ctx,
      ["build", "dataAvailability"],
      filled(b.dataAvailability),
      "Tell us about data availability",
    );
    need(ctx, ["build", "ipPreference"], filled(b.ipPreference), "Choose an IP preference");
    if (b.budget === "Sponsored project")
      need(ctx, ["build", "budgetRange"], filled(b.budgetRange), "Choose a sponsorship range");
  }

  if (has("research")) {
    const r = v.research;
    need(ctx, ["research", "area"], filled(r.area), "Research area is required");
    need(ctx, ["research", "type"], filled(r.type), "Choose a collaboration type");
    need(ctx, ["research", "description"], filled(r.description), "Add a short description");
  }

  if (has("interns")) {
    const i = v.interns;
    need(ctx, ["interns", "count"], POS_INT.test(i.count ?? ""), "Enter the number of interns");
    need(ctx, ["interns", "programs"], filled(i.programs), "Pick at least one program");
    need(ctx, ["interns", "role"], filled(i.role), "Role / title is required");
    need(ctx, ["interns", "skills"], filled(i.skills), "Add at least one skill");
    need(ctx, ["interns", "mode"], filled(i.mode), "Choose a work mode");
    need(ctx, ["interns", "duration"], filled(i.duration), "Choose a duration");
    need(ctx, ["interns", "startMonth"], filled(i.startMonth), "Choose a start month");
  }

  if (has("fulltime")) {
    const f = v.fulltime;
    need(
      ctx,
      ["fulltime", "openings"],
      POS_INT.test(f.openings ?? ""),
      "Enter the number of openings",
    );
    need(ctx, ["fulltime", "role"], filled(f.role), "Role / title is required");
    need(ctx, ["fulltime", "programs"], filled(f.programs), "Pick at least one program");
    need(ctx, ["fulltime", "skills"], filled(f.skills), "Add at least one skill");
    need(ctx, ["fulltime", "locations"], filled(f.locations), "Job location(s) are required");
    need(ctx, ["fulltime", "ctc"], filled(f.ctc), "Choose a CTC band");
    need(
      ctx,
      ["fulltime", "joiningTimeline"],
      filled(f.joiningTimeline),
      "Choose a joining timeline",
    );
    if (filled(f.minCgpa))
      need(
        ctx,
        ["fulltime", "minCgpa"],
        /^(10(\.0+)?|\d(\.\d{1,2})?)$/.test(f.minCgpa ?? ""),
        "CGPA must be between 0 and 10",
      );
    if (filled(f.jdLink))
      need(ctx, ["fulltime", "jdLink"], URLISH_RE.test(f.jdLink ?? ""), "Enter a valid link");
  }
}

export const intentSchema = intentShape.superRefine(refineIntents);

// ── Step 4 · Review ──
export const reviewSchema = z.object({
  heardFrom: opt(60),
  consent: z.boolean().refine((v) => v === true, "Please agree so we can contact you"),
  sendCopy: z.boolean().optional(),
});

// ── Full payload (server) ──
export const collaborationSchema = z
  .object({
    ...orgSchema.shape,
    ...contactShape.shape,
    ...intentShape.shape,
    ...reviewSchema.shape,
    /** Honeypot — must stay empty. */
    website_url: z.string().max(200).optional(),
    sourcePage: z.string().max(300).optional(),
  })
  .superRefine((v, ctx) => {
    refineContact(v, ctx);
    refineIntents(v, ctx);
  });

export type CollaborationInput = z.infer<typeof collaborationSchema>;

export const STEP_SCHEMAS = [orgSchema, contactSchema, intentSchema, reviewSchema] as const;

export function isFreeMail(email: string | undefined): boolean {
  const domain = email?.split("@")[1]?.trim().toLowerCase();
  return !!domain && FREE_MAIL_DOMAINS.includes(domain);
}
