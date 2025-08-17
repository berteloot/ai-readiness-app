import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  const joinOrNone = (arr?: string[]) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "none";

  const painPoints =
    Array.isArray(answers.q8) && answers.q8.length
      ? answers.q8.join(", ")
      : "not specified";

  const urgency = answers.q9 || "not specified";

  return `
Critical Rule:
  • Never fabricate statistics, quotes, or information.
  • Use only verifiable data from reputable sources.
  • If a requested data point cannot be found from a credible source, say it is unavailable.
  • Statistics and benchmarks must be from 2023 or newer. Foundational frameworks older than 2023 may be cited only if still standard.
  • Approved domains: mckinsey.com, gartner.com, deloitte.com, pwc.com, accenture.com, forrester.com, weforum.org, oecd.org, technologyreview.com, hbr.org, aiindex.stanford.edu (and equivalent caliber only).
  • Cite with domain names only (e.g., "mckinsey.com"). Do not include full URLs.
  • Do not write generic claims like "studies show" without a citation.

Style & Anti-Template Rules:
  • Prefer a short narrative paragraph per section (3–5 sentences) that follows: Insight → Evidence → Implication.
  • Vary sentence openings and verbs. Avoid repeating the same phrasing across sections.
  • Use at most one quantified stat per section (two maximum for Executive Summary).
  • Do not repeat the same source in consecutive sections if another credible 2023+ source exists.
  • At least one section (your choice) should use a brief vignette or qualitative example from a cited report instead of another percentage.
  • Include a single “Do nothing” consequence line per section (start with "If unchanged: ...").
  • Avoid filler like “in today’s world,” “leveraging synergies,” or “unlock value.”

Task: Generate a report grounded in current, verifiable research with varied narrative.

Report Structure:
  1. Executive Summary
    • Overall AI readiness score and tier.
    • One tight paragraph synthesizing where the org is strong vs fragile (do not list sections mechanically).
    • Benchmark comparison (cap at two stats) with citations from 2023+.
    • Limitations & Assumptions: call out missing sector/region or data that constrained precision.
    • Confidence Meter (High/Medium/Low) based on citation coverage across the report.

  2. Readiness Score & Tier Interpretation
    • Total score: ${score.score}/${score.maxScore} (${score.overallPct}%).
    • Tier: ${score.tier}.
    • Tier adjustment note: ${score.notes?.tierAdjustedDueToLowDataMaturity ? "Adjusted due to low data maturity" : "No adjustment"}.
    • Show each section score with max and percentage:
        - S1 Automation: ${score.breakdown.s1}/${score.breakdownMax.s1} (${score.breakdownPct.s1}%)
        - S2 Data: ${score.breakdown.s2}/${score.breakdownMax.s2} (${score.breakdownPct.s2}%)
        - S3 Workforce: ${score.breakdown.s3}/${score.breakdownMax.s3} (${score.breakdownPct.s3}%)
        - S4 Scalability: ${score.breakdown.s4}/${score.breakdownMax.s4} (${score.breakdownPct.s4}%)
        - S5 KPIs: ${score.breakdown.s5}/${score.breakdownMax.s5} (${score.breakdownPct.s5}%)
        - S6 Security: ${score.breakdown.s6}/${score.breakdownMax.s6} (${score.breakdownPct.s6}%)
        - S7 Leadership: ${score.breakdown.s7}/${score.breakdownMax.s7} (${score.breakdownPct.s7}%)
    • Interpret the tier in practical terms, citing a 2023+ framework if available.

  3. Detailed Section Analysis (write 1 short narrative paragraph per section that follows Insight → Evidence → Implication; then add the two one-liners)
     For each section S1..S7:
       • Narrative paragraph tying this section’s score to business impact.
       • If applicable, show how this section connects to selected pain points: ${painPoints}.
       • Benchmark: include at most one quantified 2023+ stat with a domain citation, or a qualitative vignette with a citation.
       • If unchanged: one sentence on the likely consequence in 6–12 months.

  4. Pain Points Analysis (tailored)
     • Reflect the selected pain points: ${painPoints}.
     • Explicitly map each pain point to the relevant low-scoring section(s) here (e.g., "Scaling bottlenecks → S4 0/4; KPI gaps → S5 0/5").
     • Use one cited data point (2023+) and one brief case or vignette; avoid stacking percentages.

  5. Recommendations & Next Steps (3–5 items)
     For each recommendation:
       • Action (clear and specific).
       • Owner & horizon (who drives it; 30/60/90 days).
       • Tied scores/pains (e.g., “Addresses S2, S5; pain: SLA misses”).
       • Evidence: one 2023+ source (domain only).
       • Expected benefit or leading indicator to watch (not just ROI; e.g., data completeness, model adoption rate).

  6. Sources
     • List all domains used, once each.

Tone:
  • Consulting, factual, succinct. No hype.
  • Vary sentence structure. Avoid repetitive templates.

Inputs:
  • Sector: ${answers.sector || "not specified"}
  • Region: ${answers.region || "not specified"}
  • Current tools (Q1): ${joinOrNone(answers.q1)}
  • Data maturity (Q2): ${answers.q2 || "not specified"}
  • Workforce readiness (Q3): ${answers.q3 || "not specified"}
  • Scalability (Q4): ${answers.q4 || "not specified"}
  • KPIs (Q5): ${joinOrNone(answers.q5)}
  • Security & compliance (Q6): ${joinOrNone(answers.q6)}
  • Leadership commitment (Q7): ${answers.q7 || "not specified"}
  • Pain points (Q8): ${painPoints}
  • Urgency (Q9): ${urgency}
  • Scoring guide: Max 35; AI-Enhanced 25–35; Getting Started 15–24; Not Ready Yet 0–14.
`;
}