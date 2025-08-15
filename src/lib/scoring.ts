export type Answers = {
  q1: string[]; // Section 1 multi - Current Automation Level (2 points each, max 8)
  q2: string;   // Section 2 single - Data Infrastructure Maturity (0-4 points)
  q3: string;   // Section 3 single - Workforce AI Adoption Readiness (0-4 points)
  q4: string;   // Section 4 single - Scalability of CX Operations (0-4 points)
  q5: string[]; // Section 5 multi - KPI Tracking Sophistication (1 point each, max 5)
  q6: string[]; // Section 6 multi - Security & Compliance (2 points each, max 6)
  q7: string;   // Section 7 single - Budget & Executive Buy-In (0-4 points)
  q8: string[]; // Section 8 multi - Pain Points (non-scored, max 3 selections)
  q9: string;   // Section 9 single - Urgency Assessment (non-scored)
};

export type ScoreResult = { 
  score: number; 
  tier: "AI-Enhanced" | "Getting Started" | "Not Ready Yet"; 
  breakdown: Record<string, number>;
  maxScore: number;
};

export function scoreAnswers(a: Answers): ScoreResult {
  // Section 1 – Q1: Current Automation Level (2 points each, max 8)
  const q1Set = new Set(a.q1);
  const q1Count = [
    "chatbots",
    "rpa", 
    "ai_assistants",
    "qa_analytics",
  ].reduce((acc, key) => acc + (q1Set.has(key) ? 1 : 0), 0);
  const s1 = Math.min(q1Count * 2, 8);

  // Section 2 – Q2: Data Infrastructure Maturity (0-4 points)
  const mapQ2: Record<string, number> = {
    fully_integrated: 4,
    crm_dashboards: 2,
    separate_systems: 1,
    no_centralized: 0,
  };
  const s2 = mapQ2[a.q2] ?? 0;

  // Section 3 – Q3: Workforce AI Adoption Readiness (0-4 points)
  const mapQ3: Record<string, number> = {
    fully_trained: 4,
    some_trained: 2,
    no_training_open: 1,
    resistant: 0,
  };
  const s3 = mapQ3[a.q3] ?? 0;

  // Section 4 – Q4: Scalability of CX Operations (0-4 points)
  const mapQ4: Record<string, number> = {
    full_scalable: 4,
    extended_multi: 2,
    limited_scaling: 1,
    no_scalability: 0,
  };
  const s4 = mapQ4[a.q4] ?? 0;

  // Section 5 – Q5: KPI Tracking Sophistication (1 point each, max 5)
  const s5 = Math.min(a.q5.filter(q => q !== 'none').length, 5);

  // Section 6 – Q6: Security & Compliance (2 points each, max 6)
  const s6 = Math.min(a.q6.filter(q => q !== 'none').length * 2, 6);

  // Section 7 – Q7: Budget & Executive Buy-In (0-4 points)
  const mapQ7: Record<string, number> = {
    dedicated_budget: 4,
    interest_no_budget: 2,
    limited_engagement: 0,
  };
  const s7 = mapQ7[a.q7] ?? 0;

  const score = s1 + s2 + s3 + s4 + s5 + s6 + s7; // max 29
  const maxScore = 29;
  
  // Tier classification based on LSG questionnaire
  const tier = score >= 21 ? "AI-Enhanced" : score >= 11 ? "Getting Started" : "Not Ready Yet";
  
  return { 
    score, 
    tier, 
    breakdown: { s1, s2, s3, s4, s5, s6, s7 },
    maxScore
  };
}
