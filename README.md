# Build with SSU

Industry collaboration and hiring portal for the **Faculty of Engineering & Technology (FET), Sri Sri University, Cuttack**.

- **Build with SSU**: companies sponsor projects, prototypes, MVPs and research with student teams and faculty mentors.
- **Hire with SSU**: companies post intern and full-time requirements for the Training & Placement cell.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, react-hook-form and zod. Form submissions go to a Google Sheet through a Google Apps Script web app.

| Route                    | What it is                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/`                      | Marketing home page: hero, programs, curriculum, student builds, placements, FAQ                              |
| `/projects`              | Filterable gallery of student projects. Filters are stored in the URL, e.g. `/projects?program=CSCD&github=1` |
| `/collaborate`           | 4-step partner intake form. Deep links: `?intent=build` and `?intent=hire`                                    |
| `/collaborate/thank-you` | Confirmation page with the reference ID, next steps and an `.ics` reminder                                    |
| `/api/collaborate`       | Validates the form, rate-limits, and forwards to Google Sheets                                                |

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the values (see "Google Sheets setup")
npm run dev                    # http://localhost:3000
```

| Script                               | Purpose                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `npm run dev`                        | Local development server                                                     |
| `npm run build` / `npm start`        | Production build and server                                                  |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks                                                 |
| `npm run format`                     | Prettier                                                                     |
| `npm run test:webhook`               | Posts a sample row straight to your Apps Script (reads `.env.local`)         |
| `npm run test:webhook -- --api`      | Posts a sample form through `localhost:3000/api/collaborate` (full pipeline) |
| `npm run logos`                      | Re-downloads company logos into `public/logos/` (see "Company logos")        |

---

## Editing content

All content lives in `src/data/`. Components never hard-code text, so you can change the site without touching the UI code.

| File              | Contents                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `site.ts`         | Name, tagline, URLs, address, social links, nav links, logo/hero image paths, `SHOW_STUDENT_NAMES` |
| `home.ts`         | Home-page copy: hero lines, orbiting tools, the two partner paths, showcase picks, proof tiles     |
| `stats.ts`        | Hero numbers, CTC chart data, sector split                                                         |
| `programs.ts`     | The five programs (Talent section) and the "Also at FET" footnote                                  |
| `curriculum.ts`   | Foundations → Core → Advanced → Capstone per program, tooling, industry partners                   |
| `projects.ts`     | Every student project (schema below)                                                               |
| `achievements.ts` | Internship hosts, other competitions, enterprise tools                                             |
| `recruiters.ts`   | Recruiter and unicorn names                                                                        |
| `companies.ts`    | Company name → website domain, used to fetch logos                                                 |
| `team.ts`         | T&P contacts and the **FET faculty coordinator** slot                                              |
| `faq.ts`          | FAQ questions and answers                                                                          |
| `formOptions.ts`  | Every dropdown and pill option in the intake form                                                  |

Items marked **[VERIFY]** in the data files, and projects with `verify: true`, were inferred from repository names or need faculty confirmation. Please review them before wide distribution.

### Adding a project

```ts
{
  id: "unique-slug",
  title: "Project name — optional subtitle",
  problem: "The problem in plain English, one line.",   // shown on the card
  program: "CSCD",               // AIML | DS | CSCD | FORENSICS | CORE
  domain: ["SOC/SIEM", "Cloud Security"],   // first match picks the cover-art motif
  description: "What they built — technical, one or two sentences.",
  tech: ["Wazuh", "AWS"],
  github: "https://github.com/…",  // optional
  live: "https://…",               // optional
  badge: "SIH 2025 finalist",      // optional
  featured: true,                  // include in the home-page rotation
  team: "Names…",                  // only shown when student names are enabled
  verify: false,
}
```

Every card gets **generated cover art** (an SVG motif chosen from the first domain, coloured by program), so no images are needed. Tools with a known brand logo (see `src/lib/toolIcons.ts`) show that logo.

The home **Highlights** tab shows `SHOWCASE_PICKS` from `home.ts`, and the first one is the large spotlight. The program tabs automatically pick the strongest builds (featured, then badged, then with code).

**Link straight to a build:** `/projects?build=<id>` (or `/?build=<id>`) opens that project's detail view. This is useful in outreach emails.

### Enabling student names

Student names are hidden by default for privacy. To show them, set `NEXT_PUBLIC_SHOW_STUDENT_NAMES=true` in `.env.local` and in Vercel, then redeploy. Each project's `team` field then appears on its card.

### FET faculty coordinator

Either fill `FET_FACULTY_COORDINATOR_DEFAULT` in `src/data/team.ts`, or set `FET_COORDINATOR_NAME`, `FET_COORDINATOR_EMAIL` and `FET_COORDINATOR_PHONE` as environment variables (these take priority). The coordinator then appears first in the footer and on the thank-you page. Also add their email to `NOTIFY` in `Code.gs`.

### Adding logos and images

See [`public/README-assets.md`](public/README-assets.md). In short:

- Official crest: add `public/logo-ssu.png`, then set `logoSrc` in `site.ts`.
- Campus photo: add `public/campus-hero.jpg`, then set `heroImage` in `site.ts`.

### Company logos

Recruiter, unicorn, internship-host and partner logos are **self-hosted** in `public/logos/`, and the site never hot-links them. `npm run logos` downloads each company's icon (domains come from `src/data/companies.ts`) and writes `src/data/logos.generated.json`. Companies with no domain or no usable icon show a maroon monogram tile instead.

- **Add a company:** add its name to the relevant list (`recruiters.ts`, `achievements.ts` or `curriculum.ts`), add `"Name": "domain.com"` to `companies.ts`, then run `npm run logos`.
- **Use a better logo:** drop `public/logos/<slug>.png` (or `.svg`) in by hand and add it to `logos.generated.json`. The slug is the lower-cased name with `-` for spaces, e.g. `axis-bank`.
- **Before wide distribution, check the logo wall once.** Icons are fetched automatically, so make sure each one is the right company and that you're comfortable displaying it.

---

## Google Sheets setup

The data flows like this:

```
Browser ──POST JSON──▶ /api/collaborate ──zod + rate limit + honeypot──▶ flatten ──POST──▶ Apps Script doPost ──▶ Google Sheet (+ email)
```

The Apps Script URL and the shared secret stay on the server and are never sent to the browser.

1. **Create the sheet.** Make a Google Sheet named **Build with SSU — Submissions**. Copy its ID from the URL: `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.
2. **Add the script.** In the sheet, open **Extensions › Apps Script**. Delete the sample code and paste the whole of [`scripts/google-apps-script/Code.gs`](scripts/google-apps-script/Code.gs).
3. **Fill in the constants** at the top of the script:
   - `SHEET_ID`: the ID from step 1.
   - `SECRET`: any long random string. You can generate one with `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`.
   - `NOTIFY`: comma-separated addresses that receive a notification email for each submission. Add the FET coordinator here.
4. **Deploy.** Click **Deploy › New deployment**, choose the gear icon › **Web app**, and set:
   - _Execute as_: **Me**
   - _Who has access_: **Anyone**

   Click **Deploy** and authorise the Sheets and Mail permissions. Copy the **Web app URL** (it ends in `/exec`).

5. **Configure `.env.local`:**
   ```bash
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   SHEETS_SHARED_SECRET=<the same SECRET as in Code.gs>
   NEXT_PUBLIC_SHOW_STUDENT_NAMES=false
   ```
6. **Test the webhook directly:**
   ```bash
   npm run test:webhook
   ```
   A row should appear in **All Submissions**, plus the per-intent tabs **Build — Projects** and **Hire — Interns**. Delete the test rows afterwards.
7. **Test the whole pipeline:**
   ```bash
   npm run dev
   npm run test:webhook -- --api
   ```
   Or use curl:
   ```bash
   curl -X POST http://localhost:3000/api/collaborate \
     -H "Content-Type: application/json" \
     -d '{"orgName":"Acme","orgWebsite":"acme.com","orgType":"Startup","industry":"SaaS","companySize":"11–50","hqLocation":"Pune","contactName":"A B","designation":"CTO","contactEmail":"a@acme.com","contactPhone":"+91 90000 00000","intents":["research"],"build":{},"research":{"area":"LLM security","type":"Joint publication","description":"Test"},"interns":{},"fulltime":{},"consent":true}'
   # → {"ok":true,"referenceId":"SSU-FET-202609-7KQD"}
   ```

**How the sheet behaves**

- Columns follow `FLAT_KEYS` in `src/lib/flatten.ts`. If you add a field later, the script adds a new column for it automatically.
- Each submission is written to _All Submissions_ and to one tab per selected intent.
- If the "Send me a copy" box is ticked, the partner gets an acknowledgement email.
- **Updating the script:** after editing `Code.gs`, go to **Deploy › Manage deployments › Edit › Version: New version**. This keeps the same URL.
- **If the webhook is down:** the API still returns the reference ID with `ok:false, queued:true`. The partner sees a "we've recorded your request — email us if you don't hear back in 24 h" message, and the full payload is written to the server logs (Vercel › Logs) so nothing is lost.

**Built-in protections:** zod validation on the server, a hidden honeypot field, an in-memory rate limit of 5 submissions per IP per 10 minutes, and a 10-second webhook timeout.

---

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, click **Add New › Project** and import the repository. The framework preset is detected automatically.
3. Add these environment variables for Production and Preview:
   - `SHEETS_WEBHOOK_URL`
   - `SHEETS_SHARED_SECRET`
   - `NEXT_PUBLIC_SHOW_STUDENT_NAMES` (`false`)
   - `NEXT_PUBLIC_SITE_URL` (your final domain, e.g. `https://build.srisriuniversity.edu.in`)
   - Optional: `FET_COORDINATOR_NAME`, `FET_COORDINATOR_EMAIL`, `FET_COORDINATOR_PHONE`
4. Click **Deploy**. No `vercel.json` is needed.
5. Submit one real test through `/collaborate` and check the sheet.

---

## Sending this to companies

Share deep links so the form opens with the right intent already selected:

| Audience              | Link                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| HR / talent heads     | `https://<your-domain>/collaborate?intent=hire` (pre-selects interns + full-time) |
| Founders / CTOs / R&D | `https://<your-domain>/collaborate?intent=build`                                  |
| Research labs         | `https://<your-domain>/collaborate?intent=research`                               |
| Security teams        | `https://<your-domain>/projects?program=CSCD`                                     |
| AI teams              | `https://<your-domain>/projects?program=AIML`                                     |

Link previews use the generated maroon and gold OpenGraph card (`/opengraph-image`). In your emails, lead with one concrete student build that matches the recipient's domain, then link to the gallery filtered to that domain.

---

## Project structure

```
src/
  app/                      routes, layout, OG image, sitemap, robots, API
  components/
    ui/                     Reveal, Counter, Marquee, Button, Logo, TechBackdrop…
    sections/               home-page sections, navbar, footer, project cards, explorer
    form/                   collaboration wizard, steps, field components
    charts/                 SVG bar and donut charts
  data/                     all editable content
  lib/                      validation.ts · flatten.ts · rateLimit.ts · ref.ts
scripts/
  google-apps-script/Code.gs
  test-webhook.mjs
public/                     logo placeholder, asset guide, recruiters/
```

**Accessibility and performance:** the site uses skip links, labelled fields with inline errors, keyboard-navigable tabs, and native `<details>` for the FAQ. It respects `prefers-reduced-motion`. The hero animates with CSS so the headline appears before JavaScript loads. Framer Motion loads a reduced feature set (`LazyMotion`), fonts load through `next/font`, and there are no external images.
