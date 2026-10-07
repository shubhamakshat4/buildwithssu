"use client";

import { m } from "framer-motion";
import type { YearValue } from "@/data/stats";

const W = 360;
const H = 200;
const BASE = 170;
const TOP = 28;

/** Grouped bars: UG (gold) vs PG (cyan) average CTC per year. */
export function CtcChart({ ug, pg }: { ug: YearValue[]; pg: YearValue[] }) {
  const max = Math.max(...pg.map((d) => d.value), ...ug.map((d) => d.value)) * 1.08;
  const slot = (W - 20) / ug.length;
  const bw = slot * 0.3;
  const h = (v: number) => (v / max) * (BASE - TOP);
  const label = ug.map((d, i) => `${d.year}: UG ${d.value}, PG ${pg[i].value} LPA`).join("; ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`Average CTC in lakhs per annum. ${label}`}
    >
      <defs>
        <linearGradient id="ctc-ug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8CF7A" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="ctc-pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35D0C6" />
          <stop offset="100%" stopColor="#35D0C6" stopOpacity=".35" />
        </linearGradient>
      </defs>
      <line x1="0" x2={W} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity=".12" />
      {ug.map((d, i) => {
        const x = 10 + i * slot + slot / 2;
        const bars = [
          { v: d.value, x: x - bw - 2, fill: "url(#ctc-ug)" },
          { v: pg[i].value, x: x + 2, fill: "url(#ctc-pg)" },
        ];
        const last = i === ug.length - 1;
        return (
          <g key={d.year}>
            {bars.map((b, k) => (
              <m.rect
                key={k}
                x={b.x}
                width={bw}
                rx={4}
                fill={b.fill}
                initial={{ height: 0, y: BASE }}
                whileInView={{ height: h(b.v), y: BASE - h(b.v) }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08 + k * 0.05, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            {last &&
              bars.map((b, k) => (
                <text
                  key={k}
                  x={b.x + bw / 2}
                  y={BASE - h(b.v) - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={k ? "#35D0C6" : "#E8CF7A"}
                >
                  {b.v}
                </text>
              ))}
            <text
              x={x}
              y={BASE + 18}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,248,231,.45)"
            >
              {d.year.slice(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
