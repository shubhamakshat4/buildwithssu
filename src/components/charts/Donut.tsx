"use client";

import { m } from "framer-motion";
import type { Slice } from "@/data/stats";

const R = 70;
const STROKE = 26;
const C = 2 * Math.PI * R;
const GAP = 2; // px gap between segments

/** Animated SVG donut with a legend. Segments sweep in on reveal. */
export function Donut({ title, data }: { title: string; data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const segs = data.map((d) => {
    const len = (d.value / total) * C;
    const seg = { ...d, len: Math.max(0, len - GAP), offset: acc };
    acc += len;
    return seg;
  });

  return (
    <figure className="card-dark p-5">
      <figcaption className="text-ssu-cream/70 mb-4 font-mono text-xs tracking-wider uppercase">
        {title}
      </figcaption>
      <div className="grid items-center gap-6 sm:grid-cols-[180px_1fr]">
        <svg
          viewBox="0 0 200 200"
          className="mx-auto w-44 -rotate-90"
          role="img"
          aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value}%`).join(", ")}`}
        >
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,.05)"
            strokeWidth={STROKE}
          />
          {segs.map((s, i) => (
            <m.circle
              key={s.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeDashoffset={-s.offset}
              initial={{ strokeDasharray: `0 ${C}` }}
              whileInView={{ strokeDasharray: `${s.len} ${C}` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.09, ease: "easeOut" }}
            />
          ))}
        </svg>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1 lg:grid-cols-2">
          {data.map((d) => (
            <li key={d.label} className="text-ssu-cream/80 flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-sm"
                style={{ background: d.color }}
              />
              <span className="flex-1">{d.label}</span>
              <span className="text-ssu-cream/55 font-mono text-xs">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
