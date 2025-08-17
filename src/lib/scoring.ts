// scoring.ts

export type Answers = {
  q1?: string[];
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string[];
  q6?: string[];
  q7?: string;
  q8?: string[];
  q9?: string;
  sector?: string;
  region?: string;
};

export type ScoreResult = {
  score: number;
  overallPct: number; // 0..100, rounded
  tier: "AI-Enhanced" | "Getting Started" | "Not Ready Yet";

  breakdown: Record<"s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7", number>;
  breakdownMax: Record<"s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7", number>;
  breakdownPct: Record<"s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7", number>; // 0..100, rounded

  maxScore: number;
  notes?: {
    tierAdjustedDueToLowDataMaturity?: boolean;
  };
};

function norm(val?: string) {
  return (val || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniq<T>(arr?: T[]): T[] {
  return Array.from(new Set(arr || []));
}

function pct(part: number, max: number) {
  if (max <= 0) return 0;
  return Math.round((part / max) * 100);
}

export function scoreAnswers(a: Answers): ScoreResult {
  const maxes = { s1: 8, s2: 4, s3: 4, s4: 4, s5: 5, s6: 6, s7: 4 } as const;

  // S1 Current Automation Level
  const q1Set = new Set(uniq(a.q1).map(norm));
  const s1Keys = ["chatbots", "rpa", "ai_assistants", "qa_analytics"];
  const s1Raw = s1Keys.reduce((acc, key) => acc + (q1Set.has(key) ? 1 : 0), 0);
  const s1 = Math.min(s1Raw * 2, maxes.s1);

  // S2 Data Infrastructure
  const mapQ2: Record<string, number> = {
    fully_integrated: 4,
    crm_dashboards: 2,
    separate_systems: 1,
    no_centralized: 0,
  };
  const s2 = mapQ2[norm(a.q2)] ?? 0;

  // S3 Workforce Readiness
  const mapQ3: Record<string, number> = {
    fully_trained: 4,
    some_trained: 2,
    no_training_open: 1,
    resistant: 0,
  };
  const s3 = mapQ3[norm(a.q3)] ?? 0;

  // S4 Scalability
  const mapQ4: Record<string, number> = {
    full_scalable: 4,
    extended_multi: 2,
    limited_scaling: 1,
    no_scalability: 0,
  };
  const s4 = mapQ4[norm(a.q4)] ?? 0;

  // S5 KPI Tracking
  const s5 = Math.min(
    uniq(a.q5).map(norm).filter((x) => x && x !== "none").length,
    maxes.s5
  );

  // S6 Security and Compliance
  const s6 = Math.min(
    uniq(a.q6).map(norm).filter((x) => x && x !== "none").length * 2,
    maxes.s6
  );

  // S7 Budget and Executive Buy-in
  const mapQ7: Record<string, number> = {
    dedicated_budget: 4,
    pilot_budget: 3,
    interest_no_budget: 2,
    limited_engagement: 0,
  };
  const s7 = mapQ7[norm(a.q7)] ?? 0;

  // Totals and percentages
  const score = s1 + s2 + s3 + s4 + s5 + s6 + s7;
  const maxScore = Object.values(maxes).reduce((a, b) => a + b, 0); // 35
  const overallPct = pct(score, maxScore);

  const breakdown = { s1, s2, s3, s4, s5, s6, s7 };
  const breakdownMax = {
    s1: maxes.s1,
    s2: maxes.s2,
    s3: maxes.s3,
    s4: maxes.s4,
    s5: maxes.s5,
    s6: maxes.s6,
    s7: maxes.s7,
  };
  const breakdownPct = {
    s1: pct(s1, maxes.s1),
    s2: pct(s2, maxes.s2),
    s3: pct(s3, maxes.s3),
    s4: pct(s4, maxes.s4),
    s5: pct(s5, maxes.s5),
    s6: pct(s6, maxes.s6),
    s7: pct(s7, maxes.s7),
  };

  // Tier plus data maturity gate
  let tentativeTier: ScoreResult["tier"];
  if (score >= 25) tentativeTier = "AI-Enhanced";
  else if (score >= 15) tentativeTier = "Getting Started";
  else tentativeTier = "Not Ready Yet";

  let tier = tentativeTier;
  const notes: ScoreResult["notes"] = {};
  if (tentativeTier === "AI-Enhanced" && s2 <= 1) {
    tier = "Getting Started";
    notes.tierAdjustedDueToLowDataMaturity = true;
  }

  return {
    score,
    overallPct,
    tier,
    breakdown,
    breakdownMax,
    breakdownPct,
    maxScore,
    notes,
  };
}