"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Animated lattice that morphs between a brain graph (AI), a shield (Cyber)
 * and a fingerprint (Forensics). 40 nodes keep their identity across shapes,
 * so edges stretch and re-form as the nodes glide. Pure SVG, no images.
 */

type Pt = [number, number];
const N_OUTER = 28;
const N_INNER = 6; // two inner chains of 6

function sampleOpen(path: Pt[], n: number): Pt[] {
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const out: Pt[] = [];
  for (let k = 0; k < n; k++) {
    let d = (total * k) / (n - 1);
    let i = 0;
    while (i < seg.length - 1 && d > seg[i]) d -= seg[i++];
    const t = seg[i] ? d / seg[i] : 0;
    out.push([
      path[i][0] + (path[i + 1][0] - path[i][0]) * t,
      path[i][1] + (path[i + 1][1] - path[i][1]) * t,
    ]);
  }
  return out;
}

function sampleClosed(poly: Pt[], n: number): Pt[] {
  // sample n+1 on the closed path and drop the duplicate end point
  return sampleOpen([...poly, poly[0]], n + 1).slice(0, n);
}

const arc = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  a0: number,
  a1: number,
  n: number,
): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

const round = (p: Pt): Pt => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];

// ── Brain ──
const brainOuter: Pt[] = Array.from({ length: N_OUTER }, (_, i) => {
  const a = (i / N_OUTER) * Math.PI * 2;
  const bump = 1 + 0.07 * Math.sin(7 * a);
  return [200 + 150 * Math.cos(a) * bump, 200 + 118 * Math.sin(a) * bump];
});
const brainA: Pt[] = Array.from({ length: N_INNER }, (_, i) => [
  200 + (i % 2 ? 9 : -9),
  98 + i * 40,
]);
const brainB: Pt[] = Array.from({ length: N_INNER }, (_, i) => [
  95 + i * 42,
  222 + (i % 2 ? -14 : 10),
]);

// ── Shield ──
const shieldPoly: Pt[] = [
  [200, 70],
  [300, 108],
  [296, 205],
  [262, 272],
  [200, 330],
  [138, 272],
  [104, 205],
  [100, 108],
];
const shieldOuter = sampleClosed(shieldPoly, N_OUTER);
const shieldA = sampleOpen(
  [
    [150, 200],
    [188, 240],
    [256, 158],
  ],
  N_INNER,
);
const shieldB = sampleOpen(
  [
    [140, 128],
    [200, 104],
    [260, 128],
  ],
  N_INNER,
);

// ── Fingerprint ──
const fpOuter = arc(200, 218, 122, 140, 150, 390, N_OUTER);
const fpA = arc(200, 222, 80, 96, 160, 380, N_INNER);
const fpB = arc(200, 226, 40, 52, 175, 365, N_INNER);

const SHAPES = [
  { key: "ai", label: "AI", nodes: [...brainOuter, ...brainA, ...brainB].map(round), closed: true },
  {
    key: "cyber",
    label: "Cyber",
    nodes: [...shieldOuter, ...shieldA, ...shieldB].map(round),
    closed: true,
  },
  {
    key: "forensics",
    label: "Forensics",
    nodes: [...fpOuter, ...fpA, ...fpB].map(round),
    closed: false,
  },
] as const;

type Edge = { a: number; b: number; kind: "outer" | "inner" | "cross" | "closing" };

const EDGES: Edge[] = [
  ...Array.from({ length: N_OUTER - 1 }, (_, i) => ({ a: i, b: i + 1, kind: "outer" as const })),
  { a: N_OUTER - 1, b: 0, kind: "closing" },
  ...Array.from({ length: N_INNER - 1 }, (_, i) => ({
    a: N_OUTER + i,
    b: N_OUTER + i + 1,
    kind: "inner" as const,
  })),
  ...Array.from({ length: N_INNER - 1 }, (_, i) => ({
    a: N_OUTER + N_INNER + i,
    b: N_OUTER + N_INNER + i + 1,
    kind: "inner" as const,
  })),
  ...Array.from({ length: N_INNER }, (_, k) => ({
    a: N_OUTER + k,
    b: (k * 5) % N_OUTER,
    kind: "cross" as const,
  })),
  ...Array.from({ length: N_INNER }, (_, k) => ({
    a: N_OUTER + N_INNER + k,
    b: (k * 5 + 14) % N_OUTER,
    kind: "cross" as const,
  })),
];

const HOT = new Set([3, 11, 19, 25, N_OUTER + 2, N_OUTER + N_INNER + 3]);
const TRANSITION = { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const };

export function SignalVisual({
  className,
  caption = true,
}: {
  className?: string;
  caption?: boolean;
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % SHAPES.length), 3800);
    return () => window.clearInterval(id);
  }, [reduced]);

  const shape = SHAPES[idx];
  const P = shape.nodes;

  return (
    <figure
      className={cn("relative", className)}
      aria-label="Animated lattice morphing between a brain, a shield and a fingerprint — AI, Cyber Security and Forensics"
    >
      <div aria-hidden className="bg-ssu-gold/10 absolute inset-8 rounded-full blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full" role="presentation">
        <defs>
          <radialGradient id="sv-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor="#C9A227" />
          </radialGradient>
          <filter id="sv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="182"
          fill="none"
          stroke="#C9A227"
          strokeOpacity="0.12"
          strokeDasharray="2 6"
        />
        <circle cx="200" cy="200" r="194" fill="none" stroke="#35D0C6" strokeOpacity="0.08" />

        <g>
          {EDGES.map((e, i) => {
            const visible = e.kind !== "closing" || shape.closed;
            const stroke = e.kind === "cross" ? "#35D0C6" : "#C9A227";
            const baseOpacity = e.kind === "cross" ? 0.28 : e.kind === "inner" ? 0.55 : 0.7;
            return (
              <m.line
                key={i}
                initial={false}
                animate={{
                  x1: P[e.a][0],
                  y1: P[e.a][1],
                  x2: P[e.b][0],
                  y2: P[e.b][1],
                  opacity: visible ? baseOpacity : 0,
                }}
                transition={TRANSITION}
                stroke={stroke}
                strokeWidth={e.kind === "cross" ? 0.8 : 1.2}
                strokeDasharray={e.kind === "cross" ? "3 4" : undefined}
              />
            );
          })}
        </g>

        <g filter="url(#sv-glow)">
          {P.map((p, i) => (
            <m.circle
              key={i}
              initial={false}
              animate={{ cx: p[0], cy: p[1] }}
              transition={{ ...TRANSITION, delay: (i % 7) * 0.02 }}
              r={HOT.has(i) ? 4.2 : i >= N_OUTER ? 2.6 : 3.1}
              fill={HOT.has(i) ? "#35D0C6" : "url(#sv-node)"}
            />
          ))}
        </g>
      </svg>

      <figcaption
        className={cn(
          "mt-2 flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase",
          !caption && "sr-only",
        )}
      >
        {SHAPES.map((s, i) => (
          <span key={s.key} className="flex items-center gap-3">
            <span
              className={cn(
                "transition-colors duration-500",
                i === idx ? "text-tech-cyan" : "text-ssu-cream/35",
              )}
            >
              {s.label}
            </span>
            {i < SHAPES.length - 1 && <span className="text-ssu-gold/40">→</span>}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
