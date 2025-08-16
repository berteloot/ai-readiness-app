import { ScoreResult, Answers } from "./scoring";

export function buildReportPrompt(score: ScoreResult, answers: Answers) {
  const painPoints = answers.q8.join(", ");
  const urgency = answers.q9;

  return `
Critical Rule:
	•	You must never fabricate statistics, quotes, or information.
	•	Only include data, facts, or quotes that you have verified from reputable sources.
	•	If a requested data point cannot be found from a credible, cited source, clearly state that it is unavailable rather than inventing it.
	•	All sources must be from 2023 or newer (no older sources allowed).
	•	Reputable organizations include: McKinsey & Company, Gartner, Deloitte, PwC, Accenture, Forrester, World Economic Forum, OECD, MIT Technology Review, Harvard Business Review, Stanford AI Index, or equivalent.
	•	Provide citations with only the domain name (e.g., "mckinsey.com" or "gartner.org") rather than full URLs, as many links may be broken.

Task: Generate a report grounded in current, verifiable research from 2023 onwards.

Report Structure:
	1.	Executive Summary
	•	Overall AI readiness score and tier (AI-Enhanced, Getting Started, Not Ready Yet).
	•	One-paragraph summary of the key finding(s).
	•	Brief comparison to industry averages or relevant sector benchmarks, with cited sources from 2023+.
	2.	Readiness Score & Tier Interpretation
	•	Numeric score and tier classification.
	•	Reference reputable AI maturity models or digital transformation frameworks from 2023+.
	•	Explain what this tier means in practical business terms, citing recent sources.
	3.	Detailed Section Analysis
For each questionnaire section:
	•	Section title and score.
	•	Interpretation of the score.
	•	Industry benchmark comparison (cite recent trusted statistics from 2023+).
	•	Risks and opportunities linked to this result, supported by evidence.
	4.	Pain Points Analysis
	•	Summarize the selected pain points.
	•	Explain their impact on operational efficiency, customer experience, and competitiveness.
	•	Reference relevant case studies or surveys from consulting firms and research bodies (2023+ only).
	5.	Recommendations & Next Steps
	•	Provide 3–5 specific, actionable steps tailored to the client's readiness tier.
	•	Back each recommendation with proven strategies, case studies, or research from reputable sources (2023+).
	•	Include expected benefits and high-level ROI indicators where credible data is available.

Tone & Style:
	•	Business consulting style: factual, evidence-driven, and concise.
	•	Avoid hype; insights must be strictly research-based.
	•	Use clear, professional formatting with headings, subheadings, and bullet points.
	•	Emphasize current trends and recent developments in AI adoption.

Inputs:
	•	Total score: ${score.score} of 29
	•	Tier: ${score.tier}
	•	Section breakdown: ${JSON.stringify(score.breakdown)}
	•	Current tools in use (Q1): ${answers.q1.join(", ") || "none"}
	•	Data maturity (Q2): ${answers.q2}
	•	Workforce readiness (Q3): ${answers.q3}
	•	Scalability (Q4): ${answers.q4}
	•	KPIs tracked (Q5): ${answers.q5.join(", ") || "none"}
	•	Security & compliance (Q6): ${answers.q6.join(", ") || "none"}
	•	Leadership commitment (Q7): ${answers.q7}
	•	Pain points (non‑scored): ${painPoints || "not specified"}
	•	Urgency (Q9): ${urgency}
	•	Scoring guide: Max Score = 29 points; AI-Enhanced = 21–29; Getting Started = 11–20; Not Ready Yet = 0–10.

Output Requirements:
	•	Length: 1,500–2,000 words.
	•	All sources must be from 2023 or newer.
	•	Flag any section where data was not available instead of making assumptions.
	•	Include a "Sources" section at the end with all citations, listing only domain names (e.g., "mckinsey.com", "gartner.org") rather than full URLs.
`;
}
