"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type Path } from "react-hook-form";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  FileLock2,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { INTENT_LABEL, type IntentKey } from "@/data/formOptions";
import { SITE } from "@/data/site";
import { STEP_SCHEMAS } from "@/lib/validation";
import { makeReferenceId } from "@/lib/ref";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { ErrorContext } from "./fields";
import { StepOrganisation } from "./StepOrganisation";
import { StepContact } from "./StepContact";
import { StepIntent } from "./StepIntent";
import { StepReview } from "./StepReview";
import { DEFAULT_VALUES, STEPS, type FormValues } from "./types";

const STORAGE_KEY = "ssu-collab-intake-v1";

/** `?intent=` deep links → pre-selected intents in step 3. */
const INTENT_PRESETS: Record<string, IntentKey[]> = {
  build: ["build"],
  hire: ["interns", "fulltime"],
  research: ["research"],
  interns: ["interns"],
  fulltime: ["fulltime"],
};

type Saved = { values: Partial<FormValues>; step: number; maxStep: number };

function mergeSaved(saved: Partial<FormValues>): FormValues {
  return {
    ...DEFAULT_VALUES,
    ...saved,
    build: { ...DEFAULT_VALUES.build, ...saved.build },
    research: { ...DEFAULT_VALUES.research, ...saved.research },
    interns: { ...DEFAULT_VALUES.interns, ...saved.interns },
    fulltime: { ...DEFAULT_VALUES.fulltime, ...saved.fulltime },
    website_url: "",
  };
}

function issueMap(step: number, values: FormValues): Record<string, string> {
  const res = STEP_SCHEMAS[step].safeParse(values);
  const out: Record<string, string> = {};
  if (!res.success) {
    for (const issue of res.error.issues) {
      const key = issue.path.join(".");
      if (!(key in out)) out[key] = issue.message;
    }
  }
  return out;
}

export function CollaborateWizard({ initialIntent }: { initialIntent?: string }) {
  const router = useRouter();
  const methods = useForm<FormValues>({ defaultValues: DEFAULT_VALUES, mode: "onTouched" });
  const { watch, reset, getValues, setValue, getFieldState, formState, handleSubmit } = methods;

  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [attempted, setAttempted] = useState([false, false, false, false]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const restored = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const preset = initialIntent ? INTENT_PRESETS[initialIntent] : undefined;

  // ── Restore progress from sessionStorage, then apply the ?intent= preset ──
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        reset(mergeSaved(saved.values ?? {}));
        const s = Math.min(Math.max(0, saved.step | 0), STEPS.length - 1);
        setStep(s);
        setMaxStep(Math.max(s, Math.min(saved.maxStep | 0, STEPS.length - 1)));
      }
    } catch {
      /* storage unavailable or corrupt — start fresh */
    }
    if (preset) {
      const current = getValues("intents");
      setValue("intents", Array.from(new Set([...current, ...preset])));
    }
    restored.current = true;
  }, [preset, reset, getValues, setValue]);

  // ── Persist progress ──
  const persist = useCallback(
    (s = step, ms = maxStep) => {
      if (!restored.current) return;
      try {
        const values = { ...getValues(), website_url: "" };
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ values, step: s, maxStep: ms } satisfies Saved),
        );
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    },
    [getValues, step, maxStep],
  );

  useEffect(() => {
    const sub = watch(() => persist());
    return () => sub.unsubscribe();
  }, [watch, persist]);

  useEffect(() => {
    persist(step, maxStep);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, maxStep, persist]);

  // ── Live validation for the current step ──
  const values = watch();
  const issues = issueMap(step, values);
  const stepValid = Object.keys(issues).length === 0;

  const errorFor = (name: string) => {
    const msg = issues[name];
    if (!msg) return undefined;
    if (attempted[step]) return msg;
    return getFieldState(name as Path<FormValues>, formState).isTouched ? msg : undefined;
  };

  const focusFirstError = () =>
    window.setTimeout(() => {
      const el = cardRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      el?.focus();
    }, 50);

  const markAttempted = (s: number) => setAttempted((a) => a.map((v, i) => (i === s ? true : v)));

  const goTo = (s: number) => {
    setServerError(null);
    setStep(s);
    setMaxStep((ms) => Math.max(ms, s));
  };

  const next = () => {
    if (!stepValid) {
      markAttempted(step);
      focusFirstError();
      return;
    }
    goTo(step + 1);
  };

  const onSubmit = async (data: FormValues) => {
    // Re-check every step (restored sessions can be stale).
    for (let s = 0; s < STEPS.length; s++) {
      if (Object.keys(issueMap(s, data)).length) {
        markAttempted(s);
        goTo(s);
        focusFirstError();
        return;
      }
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage: window.location.href }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        queued?: boolean;
        referenceId?: string;
        error?: string;
      };

      if (res.status === 429 || res.status === 422 || (!json.referenceId && !res.ok)) {
        setServerError(
          json.error ?? "Something went wrong. Please check your answers and try again.",
        );
        setSubmitting(false);
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      const q = new URLSearchParams({ ref: json.referenceId ?? makeReferenceId() });
      if (!json.ok) q.set("queued", "1");
      router.push(`/collaborate/thank-you?${q}`);
    } catch {
      // Network failure: still give the partner a reference and a fallback path.
      const q = new URLSearchParams({ ref: makeReferenceId(), queued: "1" });
      router.push(`/collaborate/thank-you?${q}`);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    if (step < STEPS.length - 1) {
      e.preventDefault();
      next();
      return;
    }
    if (!stepValid) {
      e.preventDefault();
      markAttempted(step);
      focusFirstError();
      return;
    }
    void handleSubmit(onSubmit)(e);
  };

  const missing = Object.keys(issues).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
      {/* ── Left rail ── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center gap-3">
          <Logo size={52} />
          <div>
            <p className="text-ssu-gold font-mono text-[11px] tracking-[0.18em] uppercase">
              Partner Intake
            </p>
            <p className="text-ssu-cream/70 text-sm">{SITE.faculty}</p>
          </div>
        </div>
        <h1 className="font-display text-ssu-cream mt-6 text-4xl leading-tight font-semibold md:text-5xl">
          Let&apos;s build <span className="gold-text">something together.</span>
        </h1>

        <nav aria-label="Form progress" className="mt-8">
          <ol className="relative space-y-1">
            {STEPS.map((s, i) => {
              const done =
                i < step ||
                (i <= maxStep && i !== step && Object.keys(issueMap(i, values)).length === 0);
              const current = i === step;
              const reachable = i <= maxStep;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={!reachable || current}
                    onClick={() => goTo(i)}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors",
                      current
                        ? "bg-ssu-gold/10"
                        : reachable
                          ? "hover:bg-white/5"
                          : "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-colors",
                        current && "border-ssu-gold bg-ssu-gold text-ssu-ink",
                        !current && done && "border-tech-cyan/60 bg-tech-cyan/10 text-tech-cyan",
                        !current && !done && "border-ssu-cream/20 text-ssu-cream/40",
                      )}
                    >
                      {done && !current ? <Check className="size-4" aria-hidden /> : i + 1}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          current ? "text-ssu-cream" : "text-ssu-cream/60",
                        )}
                      >
                        {s.title}
                      </span>
                      <span className="text-ssu-cream/40 block text-xs">{s.blurb}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="border-ssu-gold/15 text-ssu-cream/75 mt-8 hidden space-y-3 rounded-2xl border bg-white/[0.03] p-5 text-sm lg:block">
          <p className="flex gap-3">
            <Clock className="text-ssu-gold size-4 shrink-0" aria-hidden /> Reviewed by T&amp;P and
            FET faculty within 2 working days
          </p>
          <p className="flex gap-3">
            <Wallet className="text-ssu-gold size-4 shrink-0" aria-hidden /> No fee — ever
          </p>
          <p className="flex gap-3">
            <FileLock2 className="text-ssu-gold size-4 shrink-0" aria-hidden /> NDA available before
            you share details
          </p>
          <p className="flex gap-3">
            <ShieldCheck className="text-ssu-gold size-4 shrink-0" aria-hidden /> Your progress is
            saved in this tab
          </p>
        </div>
      </aside>

      {/* ── Form card ── */}
      <div ref={cardRef} className="scroll-mt-24">
        <FormProvider {...methods}>
          <ErrorContext.Provider value={errorFor}>
            <form
              noValidate
              onSubmit={onFormSubmit}
              className="border-ssu-gold/40 bg-ssu-cream rounded-3xl border p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] md:p-10"
              aria-labelledby="step-heading"
            >
              {/* Honeypot — invisible to people, tempting to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Leave this empty
                  <input tabIndex={-1} autoComplete="off" {...methods.register("website_url")} />
                </label>
              </div>

              <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-ssu-maroon font-mono text-xs tracking-[0.18em] uppercase">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <h2
                    id="step-heading"
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display text-ssu-ink mt-1 text-3xl font-semibold focus:outline-none md:text-4xl"
                  >
                    {STEPS[step].title}
                  </h2>
                </div>
                {preset && step < 3 && (
                  <p className="bg-ssu-maroon/10 text-ssu-maroon rounded-full px-3 py-1.5 text-xs font-medium">
                    Pre-selected: {preset.map((p) => INTENT_LABEL[p]).join(" + ")}
                  </p>
                )}
              </div>

              <div className="bg-ssu-maroon/10 mb-8 h-1 overflow-hidden rounded-full" aria-hidden>
                <m.div
                  className="from-ssu-maroon to-ssu-gold h-full rounded-full bg-gradient-to-r"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 0 && <StepOrganisation />}
                  {step === 1 && <StepContact />}
                  {step === 2 && <StepIntent />}
                  {step === 3 && <StepReview onEdit={goTo} />}
                </m.div>
              </AnimatePresence>

              {serverError && (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-red-800/30 bg-red-50 px-4 py-3 text-sm text-red-900"
                >
                  {serverError}
                </p>
              )}

              <div className="border-ssu-maroon/10 mt-10 flex flex-col-reverse items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="text-ssu-maroon hover:bg-ssu-maroon/5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                  >
                    <ArrowLeft className="size-4" aria-hidden /> Back
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <button
                    type="submit"
                    aria-disabled={!stepValid || submitting}
                    disabled={submitting}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all",
                      step === STEPS.length - 1
                        ? "bg-ssu-gold text-ssu-ink hover:bg-ssu-gold-light shadow-[0_10px_30px_-10px_rgba(201,162,39,.8)]"
                        : "bg-ssu-maroon text-ssu-cream hover:bg-ssu-maroon-deep",
                      (!stepValid || submitting) &&
                        "cursor-not-allowed opacity-50 hover:bg-inherit",
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden /> Submitting…
                      </>
                    ) : step === STEPS.length - 1 ? (
                      <>
                        Submit request <ArrowRight className="size-4" aria-hidden />
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="size-4" aria-hidden />
                      </>
                    )}
                  </button>
                  {!stepValid && (
                    <p
                      className="text-ssu-ink/50 text-center text-xs sm:text-right"
                      aria-live="polite"
                    >
                      {missing === 1 ? "1 required field left" : `${missing} required fields left`}{" "}
                      ·{" "}
                      <button
                        type="button"
                        className="hover:text-ssu-maroon underline underline-offset-2"
                        onClick={() => {
                          markAttempted(step);
                          focusFirstError();
                        }}
                      >
                        show me
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </form>
          </ErrorContext.Provider>
        </FormProvider>
      </div>
    </div>
  );
}
