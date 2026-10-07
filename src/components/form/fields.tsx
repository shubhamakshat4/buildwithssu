"use client";

import { createContext, useContext, useId, useState } from "react";
import { useController, useFormContext, type Path } from "react-hook-form";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FormValues } from "./types";

type Name = Path<FormValues>;

/** Supplied by the wizard: returns the error to show for a field (already touch/attempt-gated). */
export const ErrorContext = createContext<(name: string) => string | undefined>(() => undefined);
const useError = (name: string) => useContext(ErrorContext)(name);

export const inputCls =
  "w-full rounded-xl border border-ssu-maroon/20 bg-white px-4 py-3 text-[15px] text-ssu-ink placeholder:text-ssu-ink/35 transition-colors focus:border-ssu-maroon focus:ring-2 focus:ring-ssu-gold/40 focus:outline-none aria-[invalid=true]:border-red-700/70";

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-ssu-ink/85 mb-1.5 block text-sm font-semibold">
      {children}
      {required && (
        <span className="text-ssu-maroon ml-0.5" aria-hidden>
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  );
}

function Help({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-ssu-ink/55 mt-1.5 text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-800">
          {error}
        </p>
      )}
    </>
  );
}

const describedBy = (id: string, error?: string, hint?: unknown) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type Base = {
  name: Name;
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  className?: string;
};

export function TextField({
  name,
  label,
  required,
  hint,
  className,
  ...input
}: Base & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  const { register } = useFormContext<FormValues>();
  const id = useId();
  const error = useError(name);
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        className={inputCls}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
        {...register(name)}
      />
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({
  name,
  label,
  required,
  hint,
  className,
  maxLength,
  rows = 4,
  placeholder,
}: Base & { maxLength?: number; rows?: number; placeholder?: string }) {
  const { register, watch } = useFormContext<FormValues>();
  const id = useId();
  const error = useError(name);
  const value = (watch(name) as string | undefined) ?? "";
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className={cn(inputCls, "resize-y")}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        {...register(name)}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Help id={id} error={error} hint={hint} />
        </div>
        {maxLength && (
          <p className="text-ssu-ink/45 mt-1.5 font-mono text-[11px]" aria-live="polite">
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectField({
  name,
  label,
  required,
  hint,
  className,
  options,
  placeholder = "Select…",
}: Base & { options: readonly string[]; placeholder?: string }) {
  const { register } = useFormContext<FormValues>();
  const id = useId();
  const error = useError(name);
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        className={cn(
          inputCls,
          "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10",
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236E0F1F' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
        }}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

const pillCls = (on: boolean) =>
  cn(
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors select-none",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ssu-gold",
    on
      ? "border-ssu-maroon bg-ssu-maroon text-ssu-cream"
      : "border-ssu-maroon/20 bg-white text-ssu-ink/80 hover:border-ssu-maroon/50",
  );

/** Single-choice pill group (radio semantics). */
export function RadioPills({
  name,
  label,
  required,
  hint,
  className,
  options,
}: Base & { options: readonly string[] }) {
  const { field } = useController<FormValues>({ name });
  const id = useId();
  const error = useError(name);
  return (
    <fieldset className={className} aria-describedby={describedBy(id, error, hint)}>
      <legend className="text-ssu-ink/85 mb-2 text-sm font-semibold">
        {label}
        {required && (
          <span className="text-ssu-maroon ml-0.5" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-required={required}
        aria-invalid={!!error}
      >
        {options.map((o) => {
          const on = field.value === o;
          return (
            <label key={o} className={pillCls(on)}>
              <input
                type="radio"
                className="sr-only"
                name={field.name}
                value={o}
                checked={on}
                onChange={() => {
                  field.onChange(o);
                  field.onBlur();
                }}
              />
              {o}
            </label>
          );
        })}
      </div>
      <Help id={id} error={error} hint={hint} />
    </fieldset>
  );
}

/** Multi-choice pill group (checkbox semantics). */
export function CheckPills({
  name,
  label,
  required,
  hint,
  className,
  options,
}: Base & { options: readonly string[] }) {
  const { field } = useController<FormValues>({ name });
  const id = useId();
  const error = useError(name);
  const value = (field.value as string[] | undefined) ?? [];
  return (
    <fieldset className={className} aria-describedby={describedBy(id, error, hint)}>
      <legend className="text-ssu-ink/85 mb-2 text-sm font-semibold">
        {label}
        {required && (
          <span className="text-ssu-maroon ml-0.5" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <label key={o} className={pillCls(on)}>
              <input
                type="checkbox"
                className="sr-only"
                checked={on}
                onChange={() => {
                  field.onChange(on ? value.filter((v) => v !== o) : [...value, o]);
                  field.onBlur();
                }}
              />
              {on && <Check className="size-3.5" aria-hidden />}
              {o}
            </label>
          );
        })}
      </div>
      <Help id={id} error={error} hint={hint} />
    </fieldset>
  );
}

/** Free-text chips (skills). Enter or comma adds; Backspace on empty removes the last chip. */
export function ChipInput({
  name,
  label,
  required,
  hint = "Press Enter or comma to add",
  className,
  placeholder,
}: Base & { placeholder?: string }) {
  const { field } = useController<FormValues>({ name });
  const id = useId();
  const error = useError(name);
  const [draft, setDraft] = useState("");
  const value = (field.value as string[] | undefined) ?? [];

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length) field.onChange([...value, ...parts].slice(0, 30));
    setDraft("");
  };

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div
        className={cn(
          inputCls,
          "focus-within:border-ssu-maroon focus-within:ring-ssu-gold/40 flex min-h-[50px] flex-wrap items-center gap-1.5 px-2.5 py-2 focus-within:ring-2",
          error && "border-red-700/70",
        )}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className="bg-ssu-maroon/10 text-ssu-maroon inline-flex items-center gap-1 rounded-lg py-1 pr-1 pl-2.5 font-mono text-xs"
          >
            {chip}
            <button
              type="button"
              onClick={() => field.onChange(value.filter((v) => v !== chip))}
              className="hover:bg-ssu-maroon/15 rounded p-0.5"
              aria-label={`Remove ${chip}`}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(",")) add(v);
            else setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              field.onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (draft.trim()) add(draft);
            field.onBlur();
          }}
          className="text-ssu-ink placeholder:text-ssu-ink/35 min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-[15px] focus:outline-none"
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, error, hint)}
        />
      </div>
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-ssu-gold/30 rounded-2xl border bg-white/60 p-5 md:p-6">
      <h3 className="font-display text-ssu-maroon mb-5 flex items-center gap-2 text-2xl font-semibold">
        <span aria-hidden className="bg-ssu-gold h-5 w-1 rounded-full" />
        {title}
      </h3>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}
