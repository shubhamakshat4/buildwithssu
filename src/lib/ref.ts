/** Reference IDs (SSU-FET-YYYYMM-XXXX) and IST timestamps. Works on server and client. */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istParts(date: Date) {
  const d = new Date(date.getTime() + IST_OFFSET_MS);
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return {
    y: d.getUTCFullYear(),
    m: pad(d.getUTCMonth() + 1),
    day: pad(d.getUTCDate()),
    hh: pad(d.getUTCHours()),
    mm: pad(d.getUTCMinutes()),
    ss: pad(d.getUTCSeconds()),
  };
}

export function makeReferenceId(date = new Date()): string {
  const { y, m } = istParts(date);
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SSU-FET-${y}${m}-${suffix}`;
}

export const REFERENCE_RE = /^SSU-FET-\d{6}-[A-Z0-9]{4}$/;

/** ISO-8601 timestamp in Indian Standard Time, e.g. 2026-09-28T14:03:11+05:30. */
export function istIso(date = new Date()): string {
  const { y, m, day, hh, mm, ss } = istParts(date);
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}+05:30`;
}
