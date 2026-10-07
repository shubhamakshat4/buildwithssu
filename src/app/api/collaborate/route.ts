import { NextResponse, type NextRequest } from "next/server";
import { collaborationSchema } from "@/lib/validation";
import { flattenSubmission } from "@/lib/flatten";
import { rateLimit } from "@/lib/rateLimit";
import { istIso, makeReferenceId } from "@/lib/ref";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Apps Script cold starts (plus sending mail) can take 10–20 s. */
export const maxDuration = 30;

const WEBHOOK_TIMEOUT_MS = 25_000;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = collaborationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const referenceId = makeReferenceId();

  // Honeypot: bots fill hidden fields. Pretend success, forward nothing.
  if (data.website_url && data.website_url.trim() !== "") {
    return NextResponse.json({ ok: true, referenceId });
  }

  const payload = flattenSubmission(data, {
    referenceId,
    submittedAt: istIso(),
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    sourcePage: data.sourcePage ?? req.headers.get("referer") ?? null,
  });

  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SHARED_SECRET;

  if (!url || !secret) {
    console.error(
      `[collaborate] SHEETS_WEBHOOK_URL / SHEETS_SHARED_SECRET not set — submission ${referenceId} not forwarded`,
      JSON.stringify(payload),
    );
    return NextResponse.json({ ok: false, queued: true, referenceId });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      // Apps Script reads e.postData.contents; text/plain avoids a CORS preflight edge case.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      cache: "no-store",
    });

    const text = await res.text();
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(text);
    } catch {
      /* non-JSON (e.g. an Apps Script HTML error page) */
    }

    if (!res.ok || result.ok !== true) {
      throw new Error(`Webhook responded ${res.status}: ${result.error ?? text.slice(0, 200)}`);
    }

    return NextResponse.json({ ok: true, referenceId });
  } catch (err) {
    // Log the full payload so nothing is lost; Vercel keeps function logs.
    console.error(`[collaborate] webhook failed for ${referenceId}:`, err, JSON.stringify(payload));
    return NextResponse.json({ ok: false, queued: true, referenceId });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
