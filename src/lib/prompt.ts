// reportPrompt.ts
import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  const joinOrNone = (arr?: string[]) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "none";

  const painPoints =
    Array.isArray(answers.q8) && answers.q8.length ? answers.q8.join(", ") : "not specified";

  const urgency = answers.q9 || "not specified";

  // Identify high and low sections from computed percentages
  const sectionNames: Record<keyof ScoreResult["breakdownPct"], string> = {
    s1: "Automation",
    s2: "Data",
    s3: "Workforce",
    s4: "Scalability",
    s5: "KPIs",
    s6: "Security",
    s7: "Leadership",
  };

  const highSections = (Object.keys(score.breakdownPct) as Array<keyof ScoreResult["breakdownPct"]>)
    .filter(k => score.breakdownPct[k] >= 75)
    .map(k => `${sectionNames[k]} ${score.breakdown[k]}/${score.breakdownMax[k]} (${score.breakdownPct[k]}%)`)
    .join("; ") || "none";

  const lowSections = (Object.keys(score.breakdownPct) as Array<keyof ScoreResult["breakdownPct"]>)
    .filter(k => score.breakdownPct[k] <= 50)
    .map(k => `${sectionNames[k]} ${score.breakdown[k]}/${score.breakdownMax[k]} (${score.breakdownPct[k]}%)`)
    .join("; ") || "none";

  return `
Critical Rule:
  • Never fabricate statistics, quotes, or information.
  • Use only verifiable data from reputable sources.
  • If a requested data point cannot be found from a credible source, say it is unavailable.
  • Statistics and benchmarks must be from 2023 or newer. Foundational frameworks older than 2023 may be cited only if still standard.
  • Approved domains: mckinsey.com, gartner.com, deloitte.com, pwc.com, accenture.com, forrester.com, weforum.org, oecd.org, technologyreview.com, hbr.org, aiindex.stanford.edu (or equivalent).
  • Cite with domain names only. No full URLs.
  • Do not write generic claims like "studies show" without a citation.

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
     • Confidence Meter: High, Medium, or Low. Base this on evidence coverage:
         - High: all major claims have 2023+ citations.
         - Medium: one or two claims lack 2023+ citations.
         - Low: more than two claims lack 2023+ citations.

  2) Readiness Score & Tier Interpretation
     • Total score: ${score.score}/${score.maxScore} (${score.overallPct}%).
     • Tier: ${score.tier}.
     • Tier adjustment note: ${score.notes?.tierAdjustedDueToLowDataMaturity ? "Adjusted due to low data maturity" : "No adjustment"}.
     • Section scores:
         - S1 Automation: ${score.breakdown.s1}/${score.breakdownMax.s1} (${score.breakdownPct.s1}%)
         - S2 Data: ${score.breakdown.s2}/${score.breakdownMax.s2} (${score.breakdownPct.s2}%)
         - S3 Workforce: ${score.breakdown.s3}/${score.breakdownMax.s3} (${score.breakdownPct.s3}%)
         - S4 Scalability: ${score.breakdown.s4}/${score.breakdownMax.s4} (${score.breakdownPct.s4}%)
         - S5 KPIs: ${score.breakdown.s5}/${score.breakdownMax.s5} (${score.breakdownPct.s5}%)
         - S6 Security: ${score.breakdown.s6}/${score.breakdownMax.s6} (${score.breakdownPct.s6}%)
         - S7 Leadership: ${score.breakdown.s7}/${score.breakdownMax.s7} (${score.breakdownPct.s7}%)
     • Interpret what this tier means in practical business terms, citing a 2023+ framework if available.

  3) Detailed Section Analysis (S1..S7)
     • Use the Insight → Evidence → Implication paragraph pattern.
     • Tie the analysis to these pain points where relevant: ${painPoints}.
     • Include at most one quantified 2023+ stat with a domain citation, or use a qualitative vignette with a citation.
     • If unchanged: one sentence on the likely consequence in 6–12 months.
     • High-scoring sections to treat as "preserve and guard against backsliding": ${highSections}.
     • Low-scoring sections to treat as priority fixes: ${lowSections}.

  4) Pain Points Analysis
     • Reflect the selected pain points: ${painPoints}.
     • Explicitly map each pain point to low-scoring section(s), for example "Scaling bottlenecks → S4 0/4; KPI gaps → S5 0/5".
     • Use one cited data point from 2023+ and one brief case or vignette. Avoid stacking percentages.

  5) Recommendations & Next Steps
     • Provide 3–5 items. For each:
       - Action (clear and specific).
       - Owner and horizon (who; 30, 60, or 90 days).
       - Tied scores/pains with a direct link (e.g., "Addresses S2 and S5; pain: SLA misses").
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