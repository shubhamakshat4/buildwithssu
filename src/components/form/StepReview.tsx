"use client";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Pencil } from "lucide-react";
import { HEARD_FROM, INTENT_LABEL } from "@/data/formOptions";
import { ErrorContext, SelectField } from "./fields";
import { STEPS, type FormValues } from "./types";

type Row = [label: string, value: string | string[] | undefined];

function summarise(v: FormValues): { step: number; title: string; rows: Row[] }[] {
  const has = (k: string) => v.intents.includes(k as FormValues["intents"][number]);
  const intentRows: Row[] = [["Intents", v.intents.map((i) => INTENT_LABEL[i])]];

  if (has("build"))
    intentRows.push(
      ["Problem", v.build.problem],
      ["Domains", v.build.domains],
      ["Deliverable", v.build.deliverable],
      ["Timeline", v.build.timeline],
      ["Team size", v.build.teamSize],
      ["Data", v.build.dataAvailability],
      [
        "Budget",
        [v.build.budget, v.build.budget === "Sponsored project" ? v.build.budgetRange : ""]
          .filter(Boolean)
          .join(" · "),
      ],
      ["IP", v.build.ipPreference],
      ["NDA", v.build.nda],
      ["Industry mentor", v.build.mentor],
      ["Stack", v.build.techPrefs],
    );
  if (has("research"))
    intentRows.push(
      ["Research area", v.research.area],
      ["Research type", v.research.type],
      ["Duration", v.research.duration],
      ["Funding", v.research.funding],
      ["Faculty", v.research.faculty],
      ["Description", v.research.description],
    );
  if (has("interns"))
    intentRows.push(
      ["Interns", `${v.interns.count} × ${v.interns.role}`],
      ["Programs", v.interns.programs],
      ["Skills", v.interns.skills],
      ["Mode / location", [v.interns.mode, v.interns.location].filter(Boolean).join(" · ")],
      ["Duration / start", [v.interns.duration, v.interns.startMonth].filter(Boolean).join(" · ")],
      ["Stipend", v.interns.stipend],
      ["PPO", v.interns.ppo],
      ["Selection", v.interns.selection],
    );
  if (has("fulltime"))
    intentRows.push(
      ["Full-time", `${v.fulltime.openings} × ${v.fulltime.role}`],
      ["Programs", v.fulltime.programs],
      [
        "Eligibility",
        [
          v.fulltime.minCgpa && `CGPA ≥ ${v.fulltime.minCgpa}`,
          v.fulltime.backlogsAllowed && `Backlogs: ${v.fulltime.backlogsAllowed}`,
          v.fulltime.batches.length ? `Batch ${v.fulltime.batches.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      ],
      ["Skills", v.fulltime.skills],
      ["Location(s)", v.fulltime.locations],
      ["CTC", v.fulltime.ctc],
      ["Bond", v.fulltime.bond],
      ["Joining", v.fulltime.joiningTimeline],
      ["Selection", v.fulltime.selection],
      ["JD link", v.fulltime.jdLink],
      [
        "JD text",
        v.fulltime.jdText
          ? `${v.fulltime.jdText.slice(0, 160)}${v.fulltime.jdText.length > 160 ? "…" : ""}`
          : "",
      ],
    );
  intentRows.push(["Also interested in", v.otherEngagement]);

  return [
    {
      step: 0,
      title: STEPS[0].title,
      rows: [
        ["Organisation", v.orgName],
        ["Website", v.orgWebsite],
        ["Type / industry", [v.orgType, v.industry].filter(Boolean).join(" · ")],
        ["Size", v.companySize],
        ["HQ", v.hqLocation],
        ["About", v.orgAbout],
      ],
    },
    {
      step: 1,
      title: STEPS[1].title,
      rows: [
        ["Name", `${v.contactName}${v.designation ? `, ${v.designation}` : ""}`],
        ["Email", v.contactEmail],
        ["Phone", v.contactPhone],
        ["Preferred contact", v.preferredContact],
        ["SSU / AoL connection", v.isAlumnus === "Yes" ? v.alumnusConnection : "No"],
      ],
    },
    { step: 2, title: STEPS[2].title, rows: intentRows },
  ];
}

const show = (val: Row[1]) => (Array.isArray(val) ? val.join(", ") : (val ?? "")).trim();

export function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { watch, register } = useFormContext<FormValues>();
  const errorFor = useContext(ErrorContext);
  const values = watch();
  const consentError = errorFor("consent");

  return (
    <div className="space-y-6">
      {summarise(values).map((group) => (
        <section key={group.step} className="border-ssu-gold/30 rounded-2xl border bg-white/60 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display text-ssu-maroon text-xl font-semibold">{group.title}</h3>
            <button
              type="button"
              onClick={() => onEdit(group.step)}
              className="text-ssu-maroon hover:bg-ssu-maroon/10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
            >
              <Pencil className="size-3" aria-hidden /> Edit
              <span className="sr-only"> {group.title}</span>
            </button>
          </div>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            {group.rows
              .filter(([, val]) => show(val))
              .map(([label, val], i) => (
                <div key={`${label}-${i}`} className="contents">
                  <dt className="text-ssu-ink/50">{label}</dt>
                  <dd className="text-ssu-ink/90 break-words whitespace-pre-line">{show(val)}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}

      <SelectField name="heardFrom" label="How did you hear about us?" options={HEARD_FROM} />

      <div className="border-ssu-maroon/20 space-y-3 rounded-2xl border bg-white p-5">
        <label className="text-ssu-ink/85 flex cursor-pointer gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[#6E0F1F]"
            aria-invalid={!!consentError}
            aria-describedby={consentError ? "consent-error" : undefined}
            {...register("consent")}
          />
          <span>
            I agree to be contacted by SSU&apos;s T&amp;P/FET team and to SSU processing this
            information for collaboration purposes. <span className="text-ssu-maroon">*</span>
          </span>
        </label>
        {consentError && (
          <p id="consent-error" role="alert" className="pl-8 text-xs font-medium text-red-800">
            {consentError}
          </p>
        )}
        <label className="text-ssu-ink/85 flex cursor-pointer gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[#6E0F1F]"
            {...register("sendCopy")}
          />
          Send me a copy of this request
        </label>
      </div>
    </div>
  );
}
