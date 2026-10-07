/**
 * Simple in-memory token bucket, keyed by IP. Good enough to stop form spam on a
 * single serverless instance; swap for Upstash/Redis if traffic grows.
 */

type Bucket = { tokens: number; updated: number };

const CAPACITY = 5; // burst
const REFILL_PER_MS = 5 / (10 * 60 * 1000); // 5 tokens every 10 minutes
const MAX_KEYS = 5000;

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) {
      if (now - b.updated > 60 * 60 * 1000) buckets.delete(k);
    }
  }

  const b = buckets.get(key) ?? { tokens: CAPACITY, updated: now };
  b.tokens = Math.min(CAPACITY, b.tokens + (now - b.updated) * REFILL_PER_MS);
  b.updated = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    return { ok: false, retryAfterSec: Math.ceil((1 - b.tokens) / REFILL_PER_MS / 1000) };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, retryAfterSec: 0 };
}
