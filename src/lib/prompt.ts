// reportPrompt.ts
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
  • You must never fabricate statistics, quotes, or information.
  • Only include data, facts, or quotes that you have verified from reputable sources.
  • If a requested data point cannot be found from a credible, cited source, clearly state that it is unavailable rather than inventing it.
  • Statistics and benchmarks must be from 2023 or newer. Foundational frameworks older than 2023 may be cited only if they remain standard and in use.
  • Reputable organizations include: McKinsey & Company (mckinsey.com), Gartner (gartner.com), Deloitte (deloitte.com), PwC (pwc.com), Accenture (accenture.com), Forrester (forrester.com), World Economic Forum (weforum.org), OECD (oecd.org), MIT Technology Review (technologyreview.com), Harvard Business Review (hbr.org), Stanford AI Index (aiindex.stanford.edu), or equivalent.
  • Provide citations listing only the domain names, e.g., "mckinsey.com", "gartner.com".
  • Do not write generic claims like "studies show" without a citation. Remove any statement you cannot back with a 2023+ source.

Task: Generate a report grounded in current, verifiable research.

Report Structure:
  1. Executive Summary
    • Overall AI readiness score and tier (AI-Enhanced, Getting Started, Not Ready Yet).
    • One-paragraph summary of the key finding(s).
    • Brief comparison to industry averages or relevant sector benchmarks, with cited sources from 2023+.
    • Add a short "Limitations & Assumptions" note if sector or region context is missing.

  2. Readiness Score & Tier Interpretation
    • Numeric score and tier classification.
    • Show each section score, its maximum, and the percentage.
    • Reference reputable AI maturity models or digital transformation frameworks (2023+ if available).
    • Explain what this tier means in practical business terms, citing recent sources.
    • If the tier was downgraded due to very low data maturity, note that explicitly.

  3. Detailed Section Analysis
    For each questionnaire section:
      • Section title, score, max, and percentage.
      • Interpretation of the score.
      • Benchmark comparison against sector/region if provided, otherwise cross-industry.
      • Cite trusted 2023+ statistics where available; otherwise state that none were found.
      • Risks and opportunities linked to this result, supported by evidence.

  4. Pain Points Analysis
    • Summarize the selected pain points.
    • Explain their impact on operational efficiency, customer experience, and competitiveness.
    • Reference relevant case studies or surveys from consulting firms and research bodies (2023+).

  5. Recommendations & Next Steps
    • Provide 3–5 specific, actionable steps tailored to the client's readiness tier.
    • Back each recommendation with proven strategies, case studies, or research from reputable sources (2023+).
    • Include expected benefits and high-level ROI indicators where credible data is available.

  6. Sources
    • List all sources at the end, domain names only (e.g., "mckinsey.com", "gartner.com").

Tone & Style:
  • Business consulting style: factual, evidence-driven, concise.
  • Avoid hype; insights must be strictly research-based.
  • Use clear formatting with headings, subheadings, and bullet points.
  • Emphasize current trends and recent developments in AI adoption.

Inputs:
  • Total score: ${score.score} of ${score.maxScore} (${score.overallPct}%)
  • Tier: ${score.tier}
  • Tier adjustment note: ${score.notes?.tierAdjustedDueToLowDataMaturity ? "Adjusted due to low data maturity" : "None"}
  • Section scores:
      - S1 Automation Level: ${score.breakdown.s1}/${score.breakdownMax.s1} (${score.breakdownPct.s1}%)
      - S2 Data Infrastructure: ${score.breakdown.s2}/${score.breakdownMax.s2} (${score.breakdownPct.s2}%)
      - S3 Workforce Readiness: ${score.breakdown.s3}/${score.breakdownMax.s3} (${score.breakdownPct.s3}%)
      - S4 Scalability: ${score.breakdown.s4}/${score.breakdownMax.s4} (${score.breakdownPct.s4}%)
      - S5 KPI Tracking: ${score.breakdown.s5}/${score.breakdownMax.s5} (${score.breakdownPct.s5}%)
      - S6 Security & Compliance: ${score.breakdown.s6}/${score.breakdownMax.s6} (${score.breakdownPct.s6}%)
      - S7 Budget & Executive Buy-in: ${score.breakdown.s7}/${score.breakdownMax.s7} (${score.breakdownPct.s7}%)
  • Current tools in use (Q1): ${joinOrNone(answers.q1)}
  • Data maturity (Q2): ${answers.q2 || "not specified"}
  • Workforce readiness (Q3): ${answers.q3 || "not specified"}
  • Scalability (Q4): ${answers.q4 || "not specified"}
  • KPIs tracked (Q5): ${joinOrNone(answers.q5)}
  • Security & compliance (Q6): ${joinOrNone(answers.q6)}
  • Leadership commitment (Q7): ${answers.q7 || "not specified"}
  • Pain points (non-scored): ${painPoints}
  • Urgency (Q9): ${urgency}
  • Sector: ${answers.sector || "not specified"}
  • Region: ${answers.region || "not specified"}
  • Scoring guide: Max Score = 35; AI-Enhanced = 25–35; Getting Started = 15–24; Not Ready Yet = 0–14.

Output Requirements:
  • Length: 1,500–2,000 words.
  • All sources must be from 2023 or newer, unless otherwise noted for evergreen frameworks.
  • Flag any section where data was not available instead of making assumptions.
  • Include a "Sources" section at the end with all citations, listing only domain names.
`;
}