// reportPrompt.ts
import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  const joinOrNone = (arr?: string[]) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "none";

  const painPoints =
    Array.isArray(answers.q8) && answers.q8.length ? answers.q8.join(", ") : "not specified";

  const urgency = answers.q9 || "not specified";

  // Derive high/low sections using the aligned labels from scoring.ts
  const highSections =
    score.sections
      .filter(s => s.pct >= 75)
      .map(s => `${s.label} ${s.score}/${s.max} (${s.pct}%)`)
      .join("; ") || "none";

  const lowSections =
    score.sections
      .filter(s => s.pct <= 50)
      .map(s => `${s.label} ${s.score}/${s.max} (${s.pct}%)`)
      .join("; ") || "none";

  // Render a breakdown list using aligned labels
  const sectionBreakdownList = score.sections
    .map(s => `         - ${s.label}: ${s.score}/${s.max} (${s.pct}%)`)
    .join("\n");

  return `
Critical Rule:
  • Never fabricate statistics, quotes, or information.
  • Use only verifiable data from reputable sources.
  • If a requested data point cannot be found from a credible source, say it is unavailable.
  • Statistics and benchmarks must be from 2023 or newer. Foundational frameworks older than 2023 may be cited only if still standard.
  • Approved domains: mckinsey.com, gartner.com, deloitte.com, pwc.com, accenture.com, forrester.com, weforum.org, oecd.org, technologyreview.com, hbr.org, aiindex.stanford.edu (or equivalent).
  • Cite with domain names only. No full URLs.
  • Do not write generic claims like "studies show" without a citation.
  • If no stat from approved domains (2023+), insert "[no reliable 2023+ benchmark found]" instead of fabricating or using outside sources.
  • Sector/region-specific data is preferred; if missing, explicitly state its absence.
  • No two consecutive sections may start with the same subject phrase; vary sentence openings.
  • Confidence Meter must include a one-line reason (for example: "Low — limited workforce data provided").

Style & Evidence Rules:
  • For each section, write one short narrative paragraph, 3–5 sentences, following Insight → Evidence → Implication.
  • Vary sentence openings and verbs. Avoid repeating the same phrasing across sections.
  • Use at most one quantified stat per section. Executive Summary may include two.
  • Do not use phrases like "up to X%", "~X%", or "Yx more likely" unless they appear exactly in a 2023+ cited source.
  • Provide at least two sections that use a brief qualitative vignette from a cited report instead of a percentage.
  • Do not cite the same domain in consecutive sections if another credible 2023+ source exists. Avoid using any single domain more than twice across the whole report.
  • End each section with one line: "If unchanged: ...".
  • For sections scoring ≥75%, the "If unchanged" line should state what to preserve and the risk of backsliding.
  • If you cannot locate a reliable 2023+ benchmark for a claim, write: "No reliable 2023+ benchmark found," and provide a qualitative insight instead.
  • Recommendations must tie only to sections or pain points with a direct causal link.

Task:
  Generate a report grounded in current, verifiable research with varied narrative. Use the inputs below exactly.

Report Structure:
  1) Executive Summary
     • One tight paragraph with overall score and tier, where the org is strong vs fragile, and what that means in practice.
     • Benchmark comparison with at most two stats, each cited from 2023+.
     • Limitations & Assumptions: call out missing sector or region and any other input gaps.
     • Confidence Meter: High, Medium, or Low, with one-line reason.
       Guidance:
         - High: all major claims have 2023+ citations.
         - Medium: one or two claims lack 2023+ citations.
         - Low: more than two claims lack 2023+ citations.

  2) Readiness Score & Tier Interpretation
     • Total score: ${score.score}/${score.maxScore} (${score.overallPct}%).
     • Tier: ${score.tier}.
     • Tier adjustment note: ${score.notes?.tierAdjustedDueToLowDataMaturity ? "Adjusted due to low data maturity" : "No adjustment"}.
     • Section scores:
${sectionBreakdownList}
     • Interpret what this tier means in practical business terms, citing a 2023+ framework if available.

  3) Detailed Section Analysis
     • Use the Insight → Evidence → Implication paragraph pattern.
     • Tie the analysis to these pain points where relevant: ${painPoints}.
     • Include at most one quantified 2023+ stat with a domain citation, or use a qualitative vignette with a citation.
     • If unchanged: one sentence on the likely consequence in 6–12 months.
     • Treat high-scoring sections as "preserve and guard against backsliding": ${highSections}.
     • Treat low-scoring sections as priority fixes: ${lowSections}.
     • Reference sections by their labels exactly as listed above (do not use codes like S1).

  4) Pain Points Analysis
     • Reflect the selected pain points: ${painPoints}.
     • Explicitly map each pain point to low-scoring section(s). Example: "Scaling bottlenecks → Strategic Planning 0/4; KPI gaps → Measurement & Analytics 0/5".
     • Use one cited data point from 2023+ and one brief case or vignette. Avoid stacking percentages.

  5) Recommendations & Next Steps
     • Provide 3–5 items. For each:
       - Action (clear and specific).
       - Owner and horizon (who; 30, 60, or 90 days).
       - Tied scores/pains with a direct link (for example: "Addresses Data Foundation and Measurement & Analytics; pain: SLA misses").
       - Evidence: one 2023+ source, domain only.
       - Expected benefit or leading indicator to watch.

  6) Sources
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