"use client";

import { useContext } from "react";
import { useController, useFormContext } from "react-hook-form";
import { AnimatePresence, m } from "framer-motion";
import { Briefcase, Check, FlaskConical, GraduationCap, Rocket } from "lucide-react";
import {
  BATCHES,
  BUDGETS,
  BUILD_DOMAINS,
  CTC_BANDS,
  DATA_AVAILABILITY,
  DELIVERABLES,
  INTENTS,
  INTERN_DURATIONS,
  IP_PREFS,
  JOINING_TIMELINES,
  OTHER_ENGAGEMENT,
  PROGRAM_CHOICES,
  RESEARCH_DURATIONS,
  RESEARCH_TYPES,
  SPONSOR_RANGES,
  STIPENDS,
  TEAM_SIZES,
  TIMELINES,
  WORK_MODES,
  YES_NO,
  YES_NO_DISCUSS,
  YES_NO_MAYBE,
  type IntentKey,
} from "@/data/formOptions";
import { cn } from "@/lib/cn";
import {
  CheckPills,
  ChipInput,
  ErrorContext,
  RadioPills,
  SelectField,
  SubSection,
  TextArea,
  TextField,
} from "./fields";
import type { FormValues } from "./types";

const ICONS = { Rocket, FlaskConical, GraduationCap, Briefcase };

function IntentCards() {
  const { field } = useController<FormValues, "intents">({ name: "intents" });
  const error = useContext(ErrorContext)("intents");
  const value = field.value ?? [];
  const toggle = (k: IntentKey) => {
    field.onChange(value.includes(k) ? value.filter((v) => v !== k) : [...value, k]);
    field.onBlur();
  };
  return (
    <fieldset>
      <legend className="text-ssu-ink/85 mb-3 text-sm font-semibold">
        How would you like to work with us? <span className="text-ssu-maroon">*</span>
        <span className="text-ssu-ink/55 ml-2 font-normal">Choose one or more</span>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {INTENTS.map((it) => {
          const on = value.includes(it.key);
          const Icon = ICONS[it.icon];
          return (
            <label
              key={it.key}
              className={cn(
                "has-[:focus-visible]:ring-ssu-gold relative flex cursor-pointer gap-4 rounded-2xl border-2 p-4 transition-all has-[:focus-visible]:ring-2",
                on
                  ? "border-ssu-maroon bg-ssu-maroon/[0.06] shadow-[0_10px_30px_-18px_rgba(110,15,31,.6)]"
                  : "border-ssu-maroon/15 hover:border-ssu-maroon/40 bg-white",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={on}
                onChange={() => toggle(it.key)}
              />
              <span
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  on ? "bg-ssu-maroon text-ssu-gold-light" : "bg-ssu-maroon/10 text-ssu-maroon",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="text-ssu-ink block font-semibold">{it.title}</span>
                <span className="text-ssu-ink/60 block text-sm">{it.blurb}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute top-3 right-3 inline-flex size-5 items-center justify-center rounded-full border",
                  on ? "border-ssu-maroon bg-ssu-maroon text-white" : "border-ssu-maroon/25",
                )}
              >
                {on && <Check className="size-3" />}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-800">
          {error}
        </p>
      )}
    </fieldset>
  );
}

const reveal = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3 },
};

export function StepIntent() {
  const { watch } = useFormContext<FormValues>();
  const intents = watch("intents") ?? [];
  const budget = watch("build.budget");
  const has = (k: IntentKey) => intents.includes(k);

  return (
    <div className="space-y-6">
      <IntentCards />

      <AnimatePresence initial={false}>
        {has("build") && (
          <m.div key="build" {...reveal} className="overflow-hidden">
            <SubSection title="Build a Project / Prototype / MVP">
              <TextArea
                name="build.problem"
                label="Problem statement"
                required
                maxLength={1500}
                rows={5}
                placeholder="What should exist at the end that doesn't today? Who uses it? What does success look like?"
                className="md:col-span-2"
              />
              <CheckPills
                name="build.domains"
                label="Domain(s)"
                required
                options={BUILD_DOMAINS}
                className="md:col-span-2"
              />
              <SelectField
                name="build.deliverable"
                label="Expected deliverable"
                required
                options={DELIVERABLES}
              />
              <SelectField
                name="build.timeline"
                label="Desired timeline"
                required
                options={TIMELINES}
              />
              <RadioPills name="build.teamSize" label="Preferred team size" options={TEAM_SIZES} />
              <SelectField
                name="build.dataAvailability"
                label="Data availability"
                required
                options={DATA_AVAILABILITY}
              />
              <TextField
                name="build.techPrefs"
                label="Tech constraints / stack preferences"
                placeholder="e.g. Python + AWS, must run on-prem"
                className="md:col-span-2"
              />
              <SelectField name="build.budget" label="Budget / sponsorship" options={BUDGETS} />
              {budget === "Sponsored project" ? (
                <SelectField
                  name="build.budgetRange"
                  label="Sponsorship range"
                  required
                  options={SPONSOR_RANGES}
                />
              ) : (
                <div className="hidden md:block" />
              )}
              <SelectField
                name="build.ipPreference"
                label="IP preference"
                required
                options={IP_PREFS}
              />
              <RadioPills name="build.nda" label="NDA required?" options={YES_NO} />
              <RadioPills
                name="build.mentor"
                label="Would you assign an industry mentor?"
                options={YES_NO}
              />
            </SubSection>
          </m.div>
        )}

        {has("research") && (
          <m.div key="research" {...reveal} className="overflow-hidden">
            <SubSection title="Research Collaboration">
              <TextField
                name="research.area"
                label="Research area"
                required
                placeholder="e.g. Adversarial ML for IDS"
              />
              <SelectField name="research.type" label="Type" required options={RESEARCH_TYPES} />
              <SelectField name="research.duration" label="Duration" options={RESEARCH_DURATIONS} />
              <RadioPills
                name="research.funding"
                label="Funding available?"
                options={YES_NO_DISCUSS}
              />
              <TextField
                name="research.faculty"
                label="Named faculty you'd like to work with"
                hint="Optional"
                className="md:col-span-2"
              />
              <TextArea
                name="research.description"
                label="Description"
                required
                maxLength={1500}
                rows={4}
                className="md:col-span-2"
              />
            </SubSection>
          </m.div>
        )}

        {has("interns") && (
          <m.div key="interns" {...reveal} className="overflow-hidden">
            <SubSection title="Hire Interns">
              <TextField
                name="interns.count"
                label="Number of interns"
                required
                type="number"
                min={1}
                max={999}
                inputMode="numeric"
              />
              <TextField
                name="interns.role"
                label="Role / title"
                required
                placeholder="SOC Analyst Intern"
              />
              <CheckPills
                name="interns.programs"
                label="Programs of interest"
                required
                options={PROGRAM_CHOICES}
                className="md:col-span-2"
              />
              <ChipInput
                name="interns.skills"
                label="Skills required"
                required
                placeholder="Python, Wazuh, SQL…"
                className="md:col-span-2"
              />
              <RadioPills name="interns.mode" label="Mode" required options={WORK_MODES} />
              <TextField
                name="interns.location"
                label="Location"
                placeholder="City (if on-site / hybrid)"
              />
              <SelectField
                name="interns.duration"
                label="Duration"
                required
                options={INTERN_DURATIONS}
              />
              <TextField name="interns.startMonth" label="Start month" required type="month" />
              <SelectField name="interns.stipend" label="Stipend range" options={STIPENDS} />
              <RadioPills name="interns.ppo" label="PPO possibility" options={YES_NO_MAYBE} />
              <TextField
                name="interns.selection"
                label="Selection process"
                placeholder="Résumé screen → assessment → 2 interview rounds"
                className="md:col-span-2"
              />
            </SubSection>
          </m.div>
        )}

        {has("fulltime") && (
          <m.div key="fulltime" {...reveal} className="overflow-hidden">
            <SubSection title="Hire Full-time">
              <TextField
                name="fulltime.openings"
                label="Number of openings"
                required
                type="number"
                min={1}
                max={999}
                inputMode="numeric"
              />
              <TextField
                name="fulltime.role"
                label="Role / title"
                required
                placeholder="Software Engineer – Security"
              />
              <CheckPills
                name="fulltime.programs"
                label="Programs of interest"
                required
                options={PROGRAM_CHOICES}
                className="md:col-span-2"
              />
              <TextField
                name="fulltime.minCgpa"
                label="Minimum CGPA"
                inputMode="decimal"
                placeholder="e.g. 7.0"
                hint="Optional, out of 10"
              />
              <RadioPills
                name="fulltime.backlogsAllowed"
                label="Backlogs allowed?"
                options={YES_NO}
              />
              <CheckPills
                name="fulltime.batches"
                label="Eligible batch"
                options={BATCHES}
                className="md:col-span-2"
              />
              <ChipInput
                name="fulltime.skills"
                label="Skills required"
                required
                placeholder="Java, React, SIEM…"
                className="md:col-span-2"
              />
              <TextField
                name="fulltime.locations"
                label="Job location(s)"
                required
                placeholder="Bengaluru, Pune, Remote"
              />
              <SelectField
                name="fulltime.ctc"
                label="CTC range"
                required
                options={CTC_BANDS}
                hint="₹ per annum"
              />
              <RadioPills name="fulltime.bond" label="Bond / service agreement?" options={YES_NO} />
              <SelectField
                name="fulltime.joiningTimeline"
                label="Joining timeline"
                required
                options={JOINING_TIMELINES}
              />
              <TextField
                name="fulltime.selection"
                label="Selection process"
                placeholder="Online test → technical interview → HR"
                className="md:col-span-2"
              />
              <TextField
                name="fulltime.jdLink"
                label="JD link (Drive / Notion / URL)"
                inputMode="url"
                placeholder="https://…"
                hint="Make sure the link is viewable by anyone with it"
                className="md:col-span-2"
              />
              <TextArea
                name="fulltime.jdText"
                label="Or paste the JD"
                maxLength={4000}
                rows={4}
                className="md:col-span-2"
              />
            </SubSection>
          </m.div>
        )}
      </AnimatePresence>

      {intents.length > 0 && (
        <CheckPills
          name="otherEngagement"
          label="Other ways you'd like to engage"
          hint="Optional — pick any"
          options={OTHER_ENGAGEMENT}
        />
      )}
    </div>
  );
}
