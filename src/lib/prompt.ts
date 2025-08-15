import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  const painPoints = answers.q8.join(", ");
  const urgency = answers.q9;

  return `
You are an operations and CX transformation consultant. Create a concise, board‑ready AI Readiness report based on the inputs below. Keep the tone clear and practical. Avoid hype. Use short sections and bullets.

Inputs
- Total score: ${score.score} of 29
- Tier: ${score.tier}
- Section breakdown: ${JSON.stringify(score.breakdown)}
- Current tools in use (Q1): ${answers.q1.join(", ") || "none"}
- Data maturity (Q2): ${answers.q2}
- Workforce readiness (Q3): ${answers.q3}
- Scalability (Q4): ${answers.q4}
- KPIs tracked (Q5): ${answers.q5.join(", ") || "none"}
- Security & compliance (Q6): ${answers.q6.join(", ") || "none"}
- Leadership commitment (Q7): ${answers.q7}
- Pain points (non‑scored): ${painPoints || "not specified"}
- Urgency (Q9): ${urgency}

Output format
1) Executive Summary – 3 to 5 bullets with the single most important insight first.
2) Readiness Tier Rationale – 3 bullets linking tier to concrete evidence from the answers.
3) Section‑by‑Section Gaps – for each section with < 60% of max, list gaps and why they matter.
4) 30‑60‑90 Roadmap – each phase with 3 to 5 concrete actions, owners, and simple success metrics.
5) Quick Wins – 5 items that can be executed in < 2 weeks with minimal budget.
6) Data and Security Considerations – one paragraph with safeguards and compliance notes.
7) Suggested KPIs – 6 metrics with definitions and weekly reporting cadence.
8) Tooling Suggestions – name 3 to 5 vendor‑agnostic capability categories to explore.
9) Buying Readiness Signals – indicators to proceed vs pause.

Constraints
- No vendor names. Use capability categories only.
- Keep total output under 900 words.
- Use plain language. No marketing fluff.
`;
}
