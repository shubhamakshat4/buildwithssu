import type { CollaborationInput } from "./validation";
import { isFreeMail } from "./validation";

/**
 * Stable column order for the Google Sheet. The Apps Script HEADERS array in
 * scripts/google-apps-script/Code.gs mirrors this list — keep them in sync
 * (the script also appends any unknown keys as new columns, so nothing is lost).
 */
export const FLAT_KEYS = [
  "referenceId",
  "submittedAt",
  "intents",
  // organisation
  "orgName",
  "orgWebsite",
  "orgType",
  "industry",
  "companySize",
  "hqLocation",
  "orgAbout",
  // contact
  "contactName",
  "designation",
  "contactEmail",
  "freeMail",
  "contactPhone",
  "preferredContact",
  "isAlumnus",
  "alumnusConnection",
  // build
  "build_problem",
  "build_domains",
  "build_deliverable",
  "build_timeline",
  "build_teamSize",
  "build_techPrefs",
  "build_dataAvailability",
  "build_budget",
  "build_budgetRange",
  "build_ipPreference",
  "build_nda",
  "build_mentor",
  // research
  "research_area",
  "research_type",
  "research_duration",
  "research_funding",
  "research_faculty",
  "research_description",
  // interns
  "interns_count",
  "interns_programs",
  "interns_role",
  "interns_skills",
  "interns_mode",
  "interns_location",
  "interns_duration",
  "interns_startMonth",
  "interns_stipend",
  "interns_ppo",
  "interns_selection",
  // full-time
  "fulltime_openings",
  "fulltime_role",
  "fulltime_programs",
  "fulltime_minCgpa",
  "fulltime_backlogsAllowed",
  "fulltime_batches",
  "fulltime_skills",
  "fulltime_locations",
  "fulltime_ctc",
  "fulltime_bond",
  "fulltime_joiningTimeline",
  "fulltime_selection",
  "fulltime_jdLink",
  "fulltime_jdText",
  // any intent
  "otherEngagement",
  "heardFrom",
  "consent",
  "sendCopy",
  // meta
  "userAgent",
  "sourcePage",
] as const;

export type FlatKey = (typeof FLAT_KEYS)[number];
export type FlatPayload = Record<FlatKey, string | null>;

export type FlattenMeta = {
  referenceId: string;
  submittedAt: string;
  userAgent: string | null;
  sourcePage: string | null;
};

function cell(v: unknown): string | null {
  if (v == null) return null;
  if (Array.isArray(v)) return v.length ? v.join(", ") : null;
  if (typeof v === "boolean") return v ? "true" : "false";
  const s = String(v).trim();
  return s.length ? s : null;
}

/** Prefix every key of a sub-form, or null them all when that intent wasn't chosen. */
function section<T extends Record<string, unknown>>(
  prefix: string,
  data: T,
  active: boolean,
): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(data)) out[`${prefix}_${k}`] = active ? cell(v) : null;
  return out;
}

export function flattenSubmission(data: CollaborationInput, meta: FlattenMeta): FlatPayload {
  const has = (k: string) => (data.intents as string[]).includes(k);

  const loose: Record<string, string | null> = {
    referenceId: meta.referenceId,
    submittedAt: meta.submittedAt,
    intents: data.intents.join(","),
    orgName: cell(data.orgName),
    orgWebsite: cell(data.orgWebsite),
    orgType: cell(data.orgType),
    industry: cell(data.industry),
    companySize: cell(data.companySize),
    hqLocation: cell(data.hqLocation),
    orgAbout: cell(data.orgAbout),
    contactName: cell(data.contactName),
    designation: cell(data.designation),
    contactEmail: cell(data.contactEmail),
    freeMail: isFreeMail(data.contactEmail) ? "true" : "false",
    contactPhone: cell(data.contactPhone),
    preferredContact: cell(data.preferredContact),
    isAlumnus: cell(data.isAlumnus),
    alumnusConnection: data.isAlumnus === "Yes" ? cell(data.alumnusConnection) : null,
    ...section("build", data.build, has("build")),
    ...section("research", data.research, has("research")),
    ...section("interns", data.interns, has("interns")),
    ...section("fulltime", data.fulltime, has("fulltime")),
    otherEngagement: cell(data.otherEngagement),
    heardFrom: cell(data.heardFrom),
    consent: cell(data.consent),
    sendCopy: cell(data.sendCopy ?? false),
    userAgent: meta.userAgent,
    sourcePage: meta.sourcePage,
  };

  if (loose.build_budget !== "Sponsored project") loose.build_budgetRange = null;

  // Emit exactly FLAT_KEYS, in order.
  const out = {} as FlatPayload;
  for (const k of FLAT_KEYS) out[k] = loose[k] ?? null;
  return out;
}
