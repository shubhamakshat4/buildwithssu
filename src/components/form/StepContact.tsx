"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { PREFERRED_CONTACT, YES_NO } from "@/data/formOptions";
import { isFreeMail } from "@/lib/validation";
import { RadioPills, TextField } from "./fields";
import type { FormValues } from "./types";

export function StepContact() {
  const { watch } = useFormContext<FormValues>();
  const email = watch("contactEmail");
  const alumnus = watch("isAlumnus");

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextField name="contactName" label="Full name" required autoComplete="name" />
      <TextField
        name="designation"
        label="Designation"
        required
        autoComplete="organization-title"
        placeholder="CTO, HR Head…"
      />
      <TextField
        name="contactEmail"
        label="Work email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        hint={
          isFreeMail(email) ? (
            <span className="inline-flex items-center gap-1 text-amber-800">
              <AlertTriangle className="size-3.5" aria-hidden />
              Looks like a personal address — a work email helps us verify faster. You can still
              continue.
            </span>
          ) : undefined
        }
      />
      <TextField
        name="contactPhone"
        label="Phone (with country code)"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        placeholder="+91 98765 43210"
      />
      <RadioPills
        name="preferredContact"
        label="Preferred contact"
        options={PREFERRED_CONTACT}
        className="md:col-span-2"
      />
      <RadioPills
        name="isAlumnus"
        label="Are you an SSU / Art of Living alumnus or associate?"
        options={YES_NO}
        className="md:col-span-2"
      />
      {alumnus === "Yes" && (
        <TextField
          name="alumnusConnection"
          label="How are you connected?"
          required
          placeholder="e.g. B.Tech 2016, SSU · Art of Living volunteer"
          className="md:col-span-2"
        />
      )}
    </div>
  );
}
