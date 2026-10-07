import type { Project } from "@/data/projects";
import { PROGRAM_COLOR } from "@/data/programs";

/**
 * Generated cover art for a project: a domain motif (ICS plant, SOC radar,
 * detection boxes, fingerprint…) drawn in the program's colour, with seeded
 * variation so every project looks different. Pure SVG — no image files.
 */

const W = 320;
const H = 180;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Motif = (c: string, r: () => number) => React.ReactNode;

const stroke = (c: string, o = 1, w = 1.6) => ({
  stroke: c,
  strokeOpacity: o,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const MOTIFS: Record<string, Motif> = {
  "OT/ICS": (c, r) => (
    <g>
      {/* tanks */}
      <rect x="70" y="70" width="40" height="70" rx="20" {...stroke(c)} />
      <rect x="125" y="88" width="34" height="52" rx="17" {...stroke(c, 0.8)} />
      {/* pipes */}
      <path d="M110 100 H125 M159 112 H190 V80 H215" {...stroke(c, 0.9)} />
      {/* PLC */}
      <rect x="205" y="62" width="58" height="76" rx="6" {...stroke(c)} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={218 + (i % 2) * 32}
          cy={80 + Math.floor(i / 2) * 18}
          r="3.2"
          fill={r() > 0.4 ? c : "#E0798C"}
        />
      ))}
      <path d="M215 118 h38 M215 126 h26" {...stroke(c, 0.5, 1.2)} />
      {/* gear */}
      <circle cx="90" cy="105" r="9" {...stroke(c, 0.7)} strokeDasharray="3 3" />
      {/* alert */}
      <path d="M272 52 l10 18 h-20 z" fill="#E0798C" fillOpacity=".85" />
      <path d="M40 140 H290" {...stroke(c, 0.35, 1)} />
    </g>
  ),
  "SOC/SIEM": (c, r) => (
    <g>
      {[22, 44, 66].map((rad) => (
        <circle key={rad} cx="110" cy="92" r={rad} {...stroke(c, 0.35)} />
      ))}
      <path d="M110 92 L170 60" {...stroke(c, 0.9, 2)} />
      <path d="M110 92 L170 60 A66 66 0 0 1 176 92 Z" fill={c} fillOpacity=".14" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle
          key={i}
          cx={70 + r() * 80}
          cy={55 + r() * 75}
          r={i === 0 ? 4 : 2.6}
          fill={i === 0 ? "#E0798C" : c}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect
            x="200"
            y={46 + i * 16}
            width="7"
            height="7"
            rx="1.5"
            fill={i === 2 ? "#E0798C" : c}
            fillOpacity={i === 2 ? 1 : 0.6}
          />
          <rect
            x="214"
            y={47.5 + i * 16}
            width={30 + r() * 50}
            height="4"
            rx="2"
            fill={c}
            fillOpacity=".35"
          />
        </g>
      ))}
    </g>
  ),
  "Network Security": (c, r) => {
    const pts = Array.from({ length: 9 }, () => [40 + r() * 240, 30 + r() * 120] as const);
    return (
      <g>
        {pts.map((p, i) =>
          pts
            .slice(i + 1, i + 3)
            .map((q, j) => (
              <line
                key={`${i}-${j}`}
                x1={p[0]}
                y1={p[1]}
                x2={q[0]}
                y2={q[1]}
                {...stroke(c, 0.3, 1)}
              />
            )),
        )}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={c} fillOpacity=".7" />
        ))}
        <path
          d="M160 40 l36 13 v28 c0 26 -16 42 -36 52 c-20 -10 -36 -26 -36 -52 v-28 z"
          fill="#1A1216"
          fillOpacity=".7"
          {...stroke(c, 1, 2)}
        />
        <path d="M146 92 l10 10 l20 -22" {...stroke(c, 1, 2.6)} />
      </g>
    );
  },
  "Cloud Security": (c, r) => (
    <g>
      <path
        d="M100 118 a26 26 0 0 1 4 -52 a36 36 0 0 1 68 -8 a28 28 0 0 1 46 26 a22 22 0 0 1 -6 34 z"
        fill={c}
        fillOpacity=".08"
        {...stroke(c, 1, 2)}
      />
      <rect x="145" y="84" width="30" height="24" rx="4" fill="#1A1216" {...stroke(c, 1, 1.8)} />
      <path d="M151 84 v-7 a9 9 0 0 1 18 0 v7" {...stroke(c, 1, 1.8)} />
      <circle cx="160" cy="96" r="3" fill={c} />
      {Array.from({ length: 4 }, (_, i) => {
        const x = 70 + i * 60 + r() * 10;
        return (
          <g key={i}>
            <path d={`M${x} 150 V128`} {...stroke(c, 0.4, 1)} strokeDasharray="2 3" />
            <rect x={x - 10} y="150" width="20" height="12" rx="2" {...stroke(c, 0.6, 1.2)} />
          </g>
        );
      })}
    </g>
  ),
  Forensics: (c, r) => (
    <g>
      {[14, 24, 34, 44, 54].map((rad, i) => (
        <path
          key={rad}
          d={`M${130 - rad} ${100 + i * 2} a${rad} ${rad + 8} 0 0 1 ${rad * 2} 0`}
          {...stroke(c, 0.85 - i * 0.12, 1.8)}
          strokeDasharray={r() > 0.5 ? undefined : `${20 + i * 6} 5`}
        />
      ))}
      <circle cx="205" cy="92" r="30" fill="#1A1216" fillOpacity=".55" {...stroke(c, 1, 2.4)} />
      <path d="M227 114 L258 145" {...stroke(c, 1, 5)} />
      <path d="M192 88 h26 M192 97 h18" {...stroke(c, 0.7, 2)} />
      <rect x="40" y="38" width="44" height="8" rx="4" fill="#E0798C" fillOpacity=".8" />
    </g>
  ),
  "Computer Vision": (c, r) => (
    <g>
      <rect x="40" y="30" width="240" height="120" rx="10" {...stroke(c, 0.35, 1)} />
      {[0, 1].map((i) => {
        const x = 70 + i * 110 + r() * 20;
        const y = 50 + r() * 20;
        return (
          <g key={i}>
            <circle cx={x + 25} cy={y + 22} r="13" {...stroke(c, 0.7)} />
            <path d={`M${x + 4} ${y + 78} q21 -32 42 0`} {...stroke(c, 0.7)} />
            <rect
              x={x}
              y={y}
              width="50"
              height="78"
              rx="3"
              {...stroke(i ? "#35D0C6" : c, 1, 1.8)}
            />
            <rect x={x} y={y - 12} width="42" height="11" rx="2" fill={i ? "#35D0C6" : c} />
            <text x={x + 4} y={y - 3.5} fontSize="7.5" fontFamily="monospace" fill="#1A1216">
              {i ? "0.97" : "0.92"}
            </text>
          </g>
        );
      })}
      <path d="M48 38 h12 M48 38 v12 M272 142 h-12 M272 142 v-12" {...stroke(c, 1, 2)} />
    </g>
  ),
  NLP: (c, r) => (
    <g>
      <rect
        x="50"
        y="40"
        width="130"
        height="38"
        rx="14"
        fill={c}
        fillOpacity=".12"
        {...stroke(c, 0.9)}
      />
      <rect
        x="140"
        y="92"
        width="130"
        height="38"
        rx="14"
        fill="#35D0C6"
        fillOpacity=".1"
        {...stroke("#35D0C6", 0.9)}
      />
      <path d="M66 55 h80 M66 64 h56" {...stroke(c, 0.7, 2.2)} />
      <path d="M156 107 h92 M156 116 h60" {...stroke("#35D0C6", 0.7, 2.2)} />
      {Array.from({ length: 22 }, (_, i) => {
        const h = 4 + r() * 22;
        return (
          <rect
            key={i}
            x={50 + i * 10}
            y={158 - h / 2}
            width="4"
            height={h}
            rx="2"
            fill={c}
            fillOpacity=".55"
          />
        );
      })}
    </g>
  ),
  "AI/ML": (c, r) => {
    const layers = [3, 5, 5, 2];
    const nodes = layers.map((n, li) =>
      Array.from({ length: n }, (_, i) => [70 + li * 60, 90 + (i - (n - 1) / 2) * 26] as const),
    );
    return (
      <g>
        {nodes
          .slice(0, -1)
          .map((layer, li) =>
            layer.map((a, i) =>
              nodes[li + 1].map((b, j) => (
                <line
                  key={`${li}-${i}-${j}`}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  {...stroke(c, 0.12 + r() * 0.35, 1)}
                />
              )),
            ),
          )}
        {nodes.flat().map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="6"
            fill="#1A1216"
            {...stroke(r() > 0.75 ? "#35D0C6" : c, 1, 1.8)}
          />
        ))}
      </g>
    );
  },
  "Data Analytics": (c, r) => {
    const vals = Array.from({ length: 8 }, () => 20 + r() * 80);
    return (
      <g>
        <path d="M40 150 H285 M40 150 V30" {...stroke(c, 0.4, 1)} />
        {vals.map((v, i) => (
          <rect
            key={i}
            x={55 + i * 28}
            y={150 - v}
            width="16"
            height={v}
            rx="3"
            fill={c}
            fillOpacity={0.25 + (i / vals.length) * 0.55}
          />
        ))}
        <path
          d={vals.map((v, i) => `${i ? "L" : "M"}${63 + i * 28} ${140 - v * 0.9}`).join(" ")}
          {...stroke("#35D0C6", 1, 2.2)}
        />
        {vals.map((v, i) => (
          <circle key={i} cx={63 + i * 28} cy={140 - v * 0.9} r="2.8" fill="#35D0C6" />
        ))}
      </g>
    );
  },
  "Web/Full-stack": (c, r) => (
    <g>
      <rect
        x="50"
        y="32"
        width="220"
        height="120"
        rx="10"
        fill="#1A1216"
        fillOpacity=".6"
        {...stroke(c, 0.9, 1.6)}
      />
      <path d="M50 52 H270" {...stroke(c, 0.5, 1)} />
      {["#E0798C", "#E8CF7A", "#8FCB6B"].map((f, i) => (
        <circle key={f} cx={64 + i * 10} cy="42" r="3" fill={f} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <rect
          key={i}
          x={68 + (i % 2) * 14}
          y={66 + i * 15}
          width={40 + r() * 90}
          height="5"
          rx="2.5"
          fill={i % 3 ? c : "#35D0C6"}
          fillOpacity=".55"
        />
      ))}
      <rect
        x="200"
        y="66"
        width="54"
        height="70"
        rx="6"
        fill={c}
        fillOpacity=".12"
        {...stroke(c, 0.6, 1)}
      />
      <path d="M212 120 l10 -14 l10 8 l12 -18" {...stroke(c, 1, 1.8)} />
    </g>
  ),
  IoT: (c, r) => (
    <g>
      <rect
        x="125"
        y="62"
        width="70"
        height="70"
        rx="8"
        fill="#1A1216"
        fillOpacity=".6"
        {...stroke(c, 1, 2)}
      />
      <rect x="143" y="80" width="34" height="34" rx="4" fill={c} fillOpacity=".2" />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} {...stroke(c, 0.7, 1.4)}>
          <path
            d={`M${135 + i * 12.5} 62 v-10 M${135 + i * 12.5} 132 v10 M125 ${72 + i * 12.5} h-10 M195 ${72 + i * 12.5} h10`}
          />
        </g>
      ))}
      {[18, 30, 42].map((rad, i) => (
        <path
          key={rad}
          d={`M${240 - rad * 0.7} ${48 - rad * 0.7} a${rad} ${rad} 0 0 1 ${rad * 1.4} ${rad * 1.4}`}
          {...stroke("#35D0C6", 0.9 - i * 0.25, 2)}
          transform="translate(10 40)"
        />
      ))}
      <circle cx={60 + r() * 20} cy={50 + r() * 30} r="4" fill={c} />
    </g>
  ),
};

const FALLBACK_ORDER = Object.keys(MOTIFS);

export function ProjectArt({
  project,
  className,
}: {
  project: Pick<Project, "id" | "program" | "domain">;
  className?: string;
}) {
  const seed = hash(project.id);
  const r = rng(seed);
  const color = PROGRAM_COLOR[project.program];
  const key =
    project.domain.find((d) => d in MOTIFS) ?? FALLBACK_ORDER[seed % FALLBACK_ORDER.length];
  const gid = `pa-${project.id}`;
  const gx = 20 + r() * 60;
  const gy = 10 + r() * 50;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${gid}-glow`} cx={`${gx}%`} cy={`${gy}%`} r="75%">
          <stop offset="0%" stopColor={color} stopOpacity=".28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#221a20" />
          <stop offset="100%" stopColor="#120d10" />
        </linearGradient>
        <pattern id={`${gid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke={color} strokeOpacity=".07" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${gid}-bg)`} />
      <rect width={W} height={H} fill={`url(#${gid}-grid)`} />
      <rect width={W} height={H} fill={`url(#${gid}-glow)`} />
      {/* fill="none" is inherited; shapes that need a fill set their own. */}
      <g fill="none" style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}>
        {MOTIFS[key](color, r)}
      </g>
    </svg>
  );
}
