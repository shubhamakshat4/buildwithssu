/** Hero counters, trust badges and placement numbers. [VERIFY] each academic year. */

export type HeroStat = {
  /** Numeric part animates up from 0. Omit for text-only chips. */
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Used instead of `value` when the chip is not numeric. */
  text?: string;
  label: string;
};

export const HERO_STATS: HeroStat[] = [
  { value: 2009, label: "Established" },
  { text: "NAAC 'A'", label: "Accredited" },
  { value: 7.15, decimals: 2, prefix: "₹", suffix: " L", label: "Avg PG CTC 2025-26" },
  { value: 19, suffix: " of 117", label: "Indian unicorns recruit from SSU" },
];

export type YearValue = { year: string; value: number };

export const AVG_UG_CTC: YearValue[] = [
  { year: "2021-22", value: 3.7 },
  { year: "2022-23", value: 3.95 },
  { year: "2023-24", value: 4.2 },
  { year: "2024-25", value: 4.3 },
  { year: "2025-26", value: 4.6 },
];

export const AVG_PG_CTC: YearValue[] = [
  { year: "2021-22", value: 6.2 },
  { year: "2022-23", value: 6.73 },
  { year: "2023-24", value: 6.89 },
  { year: "2024-25", value: 7.1 },
  { year: "2025-26", value: 7.15 },
];

export type Slice = { label: string; value: number; color: string };

export const SECTOR_SPLIT: Slice[] = [
  { label: "BFSI", value: 27, color: "#C9A227" },
  { label: "IT & ITES", value: 23, color: "#35D0C6" },
  { label: "Research & Consulting", value: 15, color: "#E8CF7A" },
  { label: "FMCG / Retail", value: 12, color: "#E0798C" },
  { label: "Agri", value: 8, color: "#8FCB6B" },
  { label: "Manufacturing", value: 7, color: "#7AA5E8" },
  { label: "Real Estate", value: 4, color: "#C79AE3" },
  { label: "Others", value: 4, color: "#9A8E93" },
];
