// reportPrompt.ts
import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  // Helpers
  const fmtPct = (n: number) => `${Math.round(n)}%`;
  const safeList = (arr?: string[]) => (Array.isArray(arr) && arr.length ? arr.join(", ") : "not specified");

  // Sort sections for stable rendering
  const sectionsSorted = [...score.sections].sort((a, b) => a.label.localeCompare(b.label));

  // Thresholds
  const HIGH_PCT = 75;
  const LOW_PCT = 50;

  const highSections =
    score.sections
      .filter(s => s.pct >= HIGH_PCT)
      .map(s => `${s.label} ${s.score}/${s.max} (${fmtPct(s.pct)})`)
      .join("; ") || "not specified";

  const lowSections =
    score.sections
      .filter(s => s.pct < LOW_PCT)
      .map(s => `${s.label} ${s.score}/${s.max} (${fmtPct(s.pct)})`)
      .join("; ") || "not specified";

  const sectionBreakdownList = sectionsSorted
    .map(s => `         - ${s.label}: ${s.score}/${s.max} (${fmtPct(s.pct)})`)
    .join("\n");

  // Pretty labels
  const sectorLabelMap: Record<string, string> = {
    retail_ecommerce: "Retail & eCommerce",
    financial_services_fintech: "Financial Services & Fintech",
    telecommunications: "Telecommunications",
    healthcare: "Healthcare",
    media_entertainment: "Media & Entertainment",
    energy_utilities: "Energy & Utilities",
    logistics_transportation: "Logistics & Transportation",
    manufacturing: "Manufacturing",
    other: "Other / Not Listed",
  };
  const regionLabelMap: Record<string, string> = {
    na: "North America",
    emea: "EMEA (Europe, Middle East & Africa)",
    apac: "APAC (Asia-Pacific)",
    latam: "LATAM (Latin America)",
    global: "Global / Multi-region",
  };

  const sectorLabel = answers.sector ? (sectorLabelMap[answers.sector] || answers.sector) : "not specified";
  const regionLabel = answers.region ? (regionLabelMap[answers.region] || answers.region) : "not specified";

  // Fallback benchmark note
  const sectorSpecified = sectorLabel !== "not specified";
  const regionSpecified = regionLabel !== "not specified";
  const noSpecificBenchmarkNote = !sectorSpecified && !regionSpecified
    ? "No sector or region-specific benchmark found; using cross-industry reference."
    : sectorSpecified && !regionSpecified
      ? "No region-specific benchmark found; using sector reference."
      : !sectorSpecified && regionSpecified
        ? "No sector-specific benchmark found; using region reference."
        : "";

  const painPoints = Array.isArray(answers.q8) && answers.q8.length ? answers.q8.join(", ") : "not specified";
  const urgency = answers.q9 || "not specified";

  // KPI mapping used for CX outcome line and per-section hints
  type Kpi =
    | "CSAT"
    | "AHT"
    | "Retention"
    | "Cost per contact"
    | "FCR"
    | "NPS"
    | "Agent productivity";

  const sectionKpiMap: Record<string, Kpi[]> = {
    "Technology Infrastructure": ["AHT", "Cost per contact", "CSAT"],
    "Data Foundation": ["AHT", "Cost per contact", "FCR"],
    "Human Capital": ["Agent productivity", "CSAT", "FCR"],
    "Strategic Planning": ["Cost per contact", "FCR", "Agent productivity"],
    "Measurement & Analytics": ["FCR", "NPS", "Cost per contact"],
    "Risk Management": ["Retention"],
    "Organizational Support": ["Retention", "NPS"],
  };

  function buildCxOutcomeLine(sections: ScoreResult["sections"]): string {
    const weights: Record<Kpi, number> = {
      CSAT: 0,
      AHT: 0,
      Retention: 0,
      "Cost per contact": 0,
      FCR: 0,
      NPS: 0,
      "Agent productivity": 0,
    };
    sections.forEach(s => {
      (sectionKpiMap[s.label] || []).forEach(k => { weights[k] += s.pct; });
    });
    const top = Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
    return `CX outcomes most affected: ${top.join(", ")}.`;
  }

  function kpiHintForSection(label: string): string {
    const list = sectionKpiMap[label] || [];
    return list.length ? `CX KPIs to watch: ${list.join(", ")}.` : "CX KPIs to watch: not specified.";
  }

  function peerStanding(s: ScoreResult): string {
    const pct = s.overallPct; // already 0..100
    if (pct >= 75) {
      return `${s.score}/${s.maxScore} places you in ${s.tier}. Comparable to top-quartile CX orgs adopting AI at scale.`;
    }
    if (pct >= 50) {
      return `${s.score}/${s.maxScore} places you in ${s.tier}. Consistent with many mid-market CX orgs early in their AI adoption.`;
    }
    return `${s.score}/${s.maxScore} places you in ${s.tier}. Similar to peers at the foundation stage beginning data and workflow modernization.`;
  }

  const cxOutcomeLine = buildCxOutcomeLine(score.sections);
  const peerLine = peerStanding(score);

  // Build a per-section KPI hint list as a displayable block if needed
  const perSectionKpiHints = sectionsSorted
    .map(s => `         - ${s.label}: ${kpiHintForSection(s.label)}`)
    .join("\n");

  return `
Critical Rule:
  • Never fabricate statistics, quotes, or information.
  • Use only verifiable data from reputable sources.
  • Statistics and benchmarks must be from 2023 or newer. Foundational frameworks older than 2023 may be cited only if still standard and named.
  • Do not include personal names, emails, or company identifiers unless provided in Inputs.
  • Preferred organizations include (not limited to): McKinsey, Gartner, Deloitte, PwC, Accenture, Forrester, World Economic Forum, OECD, MIT Technology Review, Harvard Business Review, Stanford AI Index, or equivalent of similar caliber. Use 2023+ publications when citing quantitative claims.

Citation Requirements (strict):
  • When citing, include the organization AND the exact report/publication name and year if available (e.g., "McKinsey — The State of AI in 2024", 2024).
  • If the exact report/publication title cannot be determined, cite the organization and a clear publication type (e.g., "Gartner — 2024 industry note").
  • Only if neither is available, fall back to the organization or domain alone (e.g., "mckinsey.com").
  • Cite-or-Skip rule: if you cannot attach a named publication to a quantitative claim, do not use a number; use a qualitative insight and add "[no reliable 2023+ benchmark found]".
  • Claim to source proximity: place the citation immediately at the end of the sentence containing the claim, not grouped later.
  • Never include full URLs.
  • Do not write generic claims like "studies show" without a citation formatted as above.

Sector and Region Benchmarking:
  • Prefer sector-specific (${sectorLabel}) and region-specific (${regionLabel}) data when selecting benchmarks and vignettes.
  • ${noSpecificBenchmarkNote}
  • Avoid mixing sectors or regions in a way that confuses applicability. Make applicability explicit.

Style and Evidence Rules:
  • For each section, write one short narrative paragraph, 3 to 5 sentences, following Insight → Evidence → Implication.
  • Vary sentence openings and verbs. Avoid repeating the same phrasing across sections.
  • Use at most one quantified stat per section. Executive Summary may include two.
  • Do not use phrases like "up to X%", "~X%", or "Yx more likely" unless they appear exactly in a 2023+ cited publication.
  • Provide at least two sections that use a brief qualitative vignette from a cited publication instead of a percentage.
  • Avoid citing the same organization in consecutive sections when a comparable source exists. Prioritize accuracy over variety.
  • End each section with one line: "If unchanged: ...".
  • For sections scoring 75% or higher, the "If unchanged" line should state what to preserve and the risk of backsliding.
  • Recommendations must tie only to sections or pain points with a direct causal link.
  • Prioritize CX outcomes and metrics when relevant: CSAT, AHT, FCR, NPS, agent productivity, retention, cost per contact.
  • After each section paragraph and before "If unchanged", append the provided KPI hint: "CX KPIs to watch: ...". Do not invent KPIs.

Task:
  Generate a report grounded in current, verifiable research with varied narrative. Use the inputs below exactly.

Report Structure:
  1) Executive Summary
     • One tight paragraph with overall score and tier, where the organization is strong vs fragile, and what that means in practice.
     • Benchmark comparison with at most two stats, each cited with organization plus report or publication name (2023+).
     • Include the CX outcomes line from Inputs: "${cxOutcomeLine}"
     • Include the peer benchmark from Inputs: "${peerLine}"
     • Limitations and Assumptions: call out missing sector or region and any other input gaps.

  2) Readiness Score and Tier Interpretation
     • Total score: ${score.score}/${score.maxScore} (${fmtPct(score.overallPct)}).
     • Tier: ${score.tier}.
     • Tier adjustment note: ${score.notes?.tierAdjustedDueToLowDataMaturity ? "Adjusted due to low data maturity" : "No adjustment"}.
     • Section scores:
${sectionBreakdownList}
     • Interpret what this tier means in practical business terms, citing a 2023+ framework or maturity model. Name the framework or publication.

  3) Detailed Section Analysis
     • Use the Insight → Evidence → Implication paragraph pattern.
     • Tie the analysis to these pain points where relevant: ${painPoints}.
     • Include at most one quantified 2023+ stat with a named publication, or use a qualitative vignette with a citation.
     • Treat high-scoring sections as preserve and guard against backsliding: ${highSections}.
     • Treat low-scoring sections as priority fixes: ${lowSections}.
     • Reference sections by their labels exactly as listed above.
     • After each section paragraph, add the KPI hint for that section from Inputs, then add the "If unchanged" line on likely consequences in 6 to 12 months.

  4) Pain Points Analysis
     • Reflect the selected pain points: ${painPoints}.
     • Explicitly map each pain point to low-scoring section or sections. Example: "Scaling bottlenecks → Strategic Planning 0/4; KPI gaps → Measurement and Analytics 0/5".
     • Use one 2023+ cited stat with a publication name and one brief case or vignette. Avoid stacking percentages.

  5) Recommendations and Next Steps
     • Provide 3 to 5 items. For each:
       - Action: clear and specific.
       - Owner and horizon: who; 30, 60, or 90 days.
       - Tied scores or pains with a direct link. Example: "Addresses Data Foundation and Measurement and Analytics; pain: SLA misses".
       - Evidence: one 2023+ publication with organization and title. No URLs.
       - Expected benefit or leading indicator to watch.
     • Benchmark the maturity tier using the provided peer benchmark sentence from Inputs.
     • Close with a call to action, such as a link to book a consult or to explore tailored recommendations.

  6) Sources
     • List each organization once with the publication name or names and year or years used, for example:
       - McKinsey - "The State of AI in 2024"
       - Gartner - "AI in Retail Analytics 2023"; "Risk and Compliance Outlook 2024"
     • If a publication title was not available, indicate: (title unavailable - domain cited)

  7) Evidence Ledger (claim to source check)
     • List 3 to 6 of the most important quantitative claims as bullet points.
     • For each, restate the claim in 20 words or fewer and attach the exact citation token used in the text.
       Example:
       - "AI TRiSM adopters improve model adoption by about 50% by 2026." → (Gartner - "Top Strategic Technology Trends 2023", 2023)
     • If any claim lacked a named publication, include:
       - [audit flag] Publication title unavailable for: "<short claim>" (used organization-level fallback).

Tone:
  • Consulting, factual, succinct. No hype.
  • Vary sentence structure. Avoid repetitive templates.

Inputs:
  • Sector: ${sectorLabel}
  • Region: ${regionLabel}
  • AI and Automation Tools (Q1): ${safeList(answers.q1)}
  • Data Infrastructure Maturity (Q2): ${answers.q2 || "not specified"}
  • Workforce AI Adoption Readiness (Q3): ${answers.q3 || "not specified"}
  • Scalability of CX Operations (Q4): ${answers.q4 || "not specified"}
  • KPI Tracking Sophistication (Q5): ${safeList(answers.q5)}
  • Security and Compliance (Q6): ${safeList(answers.q6)}
  • Budget and Executive Buy-In (Q7): ${answers.q7 || "not specified"}
  • Challenges (Q8): ${painPoints}
  • Urgency Assessment (Q9): ${urgency}
  • Scoring guide: Max ${score.maxScore}; Tiers: AI-Enhanced / Developing / Foundation Stage.
  • CX Outcomes Line: ${cxOutcomeLine}
  • Peer Benchmark: ${peerLine}
  • Per-Section KPI Hints:
${perSectionKpiHints}
`;
}