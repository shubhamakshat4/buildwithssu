"use client";

import { COMPANY_SIZES, INDUSTRIES, ORG_TYPES } from "@/data/formOptions";
import { SelectField, TextArea, TextField } from "./fields";

export function StepOrganisation() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextField
        name="orgName"
        label="Organisation name"
        required
        autoComplete="organization"
        className="md:col-span-2"
      />
      <TextField
        name="orgWebsite"
        label="Website / LinkedIn"
        required
        inputMode="url"
        autoComplete="url"
        placeholder="acme.com or linkedin.com/company/acme"
        className="md:col-span-2"
      />
      <SelectField name="orgType" label="Organisation type" required options={ORG_TYPES} />
      <SelectField name="industry" label="Industry" required options={INDUSTRIES} />
      <SelectField
        name="companySize"
        label="Company size"
        required
        options={COMPANY_SIZES}
        hint="Employees"
      />
      <TextField
        name="hqLocation"
        label="HQ city / country"
        required
        placeholder="Bengaluru, India"
      />
      <TextArea
        name="orgAbout"
        label="Brief about the organisation"
        maxLength={400}
        rows={3}
        placeholder="What you build, who you serve, what stage you're at."
        className="md:col-span-2"
      />
    </div>
  );
}
