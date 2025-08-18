// scoring.ts

export type Answers = {
  sector?: string;
  region?: string;

  q1?: string[]; // multi
  q2?: string;   // single
  q3?: string;   // single
  q4?: string;   // single
  q5?: string[]; // multi
  q6?: string[]; // multi
  q7?: string;   // single
  q8?: string[]; // multi (non-scored)
  q9?: string;   // single (non-scored)
};

export type ScoreResult = {
  score: number;
  overallPct: number; // 0..100
  tier: "AI-Enhanced" | "Developing" | "Foundation Stage";

  // raw section math
  breakdown: Record<"s1"|"s2"|"s3"|"s4"|"s5"|"s6"|"s7", number>;
  breakdownMax: Record<"s1"|"s2"|"s3"|"s4"|"s5"|"s6"|"s7", number>;
  breakdownPct: Record<"s1"|"s2"|"s3"|"s4"|"s5"|"s6"|"s7", number>;

  // label-aligned view for the prompt/rendering
  sections: Array<{
    id: "s1"|"s2"|"s3"|"s4"|"s5"|"s6"|"s7";
    label: "Technology Infrastructure" | "Data Foundation" | "Human Capital" | "Strategic Planning" | "Measurement & Analytics" | "Risk Management" | "Organizational Support";
    score: number;
    max: number;
    pct: number; // 0..100
  }>;

  maxScore: number;

  notes?: {
    tierAdjustedDueToLowDataMaturity?: boolean;
    redFlags?: string[]; // surfaced for the writer
  };
};

/* helpers */
function norm(val?: string) {
  return (val || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniq<T>(arr?: T[]) {
  return Array.from(new Set(arr || []));
}

// Enforce "none" exclusivity and de-dupe
function cleanMulti(arr?: string[]) {
  const set = new Set(uniq(arr).map(norm));
  if (set.has("none") && set.size > 1) set.delete("none");
  return Array.from(set);
}

function pct(part: number, max: number) {
  return max > 0 ? Math.round((part / max) * 100) : 0;
}

export function scoreAnswers(a: Answers): ScoreResult {
  // Section labels aligned to your report
  const labels = {
    s1: "Technology Infrastructure",
    s2: "Data Foundation",
    s3: "Human Capital",
    s4: "Strategic Planning",
    s5: "Measurement & Analytics",
    s6: "Risk Management",
    s7: "Organizational Support",
  } as const;

  // Max points (kept as your original totals = 35)
  const maxes = { s1: 8, s2: 4, s3: 4, s4: 4, s5: 5, s6: 6, s7: 4 } as const;

  // S1 Technology Infrastructure (automation level)
  const q1Set = new Set(cleanMulti(a.q1));
  const s1Keys = ["chatbots", "rpa", "ai_assistants", "qa_analytics"];
  const s1Raw = s1Keys.reduce((acc, k) => acc + (q1Set.has(k) ? 1 : 0), 0);
  const s1 = Math.min(s1Raw * 2, maxes.s1);

  // S2 Data Foundation
  const mapQ2: Record<string, number> = {
    fully_integrated: 4,
    crm_dashboards: 2,
    separate_systems: 1,
    no_centralized: 0,
  };
  const s2 = mapQ2[norm(a.q2)] ?? 0;

  // S3 Human Capital (workforce readiness)
  const mapQ3: Record<string, number> = {
    fully_trained: 4,
    some_trained: 2,
    no_training_open: 1,
    resistant: 0,
  };
  const s3 = mapQ3[norm(a.q3)] ?? 0;

  // S4 Strategic Planning (scalability)
  const mapQ4: Record<string, number> = {
    full_scalable: 4,
    extended_multi: 2,
    limited_scaling: 1,
    no_scalability: 0,
  };
  const s4 = mapQ4[norm(a.q4)] ?? 0;

  // S5 Measurement & Analytics (KPI tracking)
  const s5 = Math.min(cleanMulti(a.q5).filter(x => x !== "none").length, maxes.s5);

  // S6 Risk Management (security & compliance)
  const s6 = Math.min(cleanMulti(a.q6).filter(x => x !== "none").length * 2, maxes.s6);

  // S7 Organizational Support (leadership buy-in)
  const mapQ7: Record<string, number> = {
    dedicated_budget: 4,
    pilot_budget: 3,
    interest_no_budget: 2,
    limited_engagement: 0,
  };
  const s7 = mapQ7[norm(a.q7)] ?? 0;

  // Aggregate
  const score = s1 + s2 + s3 + s4 + s5 + s6 + s7;
  const maxScore = Object.values(maxes).reduce((a, b) => a + b, 0); // 35
  const overallPct = pct(score, maxScore);

  const breakdown = { s1, s2, s3, s4, s5, s6, s7 };
  const breakdownMax = { s1: maxes.s1, s2: maxes.s2, s3: maxes.s3, s4: maxes.s4, s5: maxes.s5, s6: maxes.s6, s7: maxes.s7 };
  const breakdownPct = {
    s1: pct(s1, maxes.s1),
    s2: pct(s2, maxes.s2),
    s3: pct(s3, maxes.s3),
    s4: pct(s4, maxes.s4),
    s5: pct(s5, maxes.s5),
    s6: pct(s6, maxes.s6),
    s7: pct(s7, maxes.s7),
  };

  // Label-aligned sections (used by prompt to keep names consistent)
  const sections = (Object.keys(breakdown) as Array<keyof typeof breakdown>).map((id) => ({
    id,
    label: labels[id],
    score: breakdown[id],
    max: breakdownMax[id],
    pct: breakdownPct[id],
  }));

  // Tier by percentage (future-proof if you ever reweight)
  let tier: ScoreResult["tier"];
  if (overallPct >= 72) tier = "AI-Enhanced";       // ≈ 25/35
  else if (overallPct >= 43) tier = "Developing"; // ≈ 15/35
  else tier = "Foundation Stage";

  const notes: ScoreResult["notes"] = {};

  // Original data maturity downgrade: can't be top tier if Data is too low
  if (tier === "AI-Enhanced" && s2 <= 1) {
    tier = "Developing";
    notes.tierAdjustedDueToLowDataMaturity = true;
  }

  // Fundamental gates (optional but recommended): zero in Data or Security blocks top tier
  if ((s2 === 0 || s6 === 0) && tier === "AI-Enhanced") {
    tier = "Developing";
    notes.tierAdjustedDueToLowDataMaturity = true;
  }
  // Both zero pushes to Foundation Stage
  if (s2 === 0 && s6 === 0) {
    tier = "Foundation Stage";
    notes.tierAdjustedDueToLowDataMaturity = true;
  }

  // Red flags to surface in the report (optional)
  const redFlags: string[] = [];
  if (s2 === 0) redFlags.push("Data Foundation is 0/4");
  if (s6 === 0) redFlags.push("Risk Management is 0/6");
  if (s5 === 0) redFlags.push("No KPI tracking");
  if (s7 === 0) redFlags.push("No executive sponsor or budget");
  if (redFlags.length) {
    notes.redFlags = redFlags;
  }

  return { score, overallPct, tier, breakdown, breakdownMax, breakdownPct, sections, maxScore, notes };
}