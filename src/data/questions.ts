export const questions = [
  {
    id: "sector",
    title: "Current Automation Level",
    subtitle: "Which industry best describes your organization?\nSelect the option that most closely aligns with your core business.",
    type: "single",
    category: "Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "retail_ecommerce", label: "Retail & eCommerce" },
      { value: "financial_services_fintech", label: "Financial Services & Fintech" },
      { value: "telecommunications", label: "Telecommunications" },
      { value: "healthcare", label: "Healthcare" },
      { value: "media_entertainment", label: "Media & Entertainment" },
      { value: "energy_utilities", label: "Energy & Utilities" },
      { value: "logistics_transportation", label: "Logistics & Transportation" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "other", label: "Other / Not Listed" }
    ]
  },
  {
    id: "region",
    title: "Region",
    subtitle: "Where are your primary CX operations based?\nSelect the region where your customer experience teams primarily operate.",
    type: "single",
    category: "Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "na", label: "North America" },
      { value: "emea", label: "EMEA (Europe, Middle East & Africa)" },
      { value: "apac", label: "APAC (Asia-Pacific)" },
      { value: "latam", label: "LATAM (Latin America)" },
      { value: "global", label: "Global / Multi-region" }
    ]
  },
  {
    id: "q1",
    title: "Current Automation Level",
    subtitle: "Which AI and automation tools are currently in use in your customer operations?",
    type: "multi",
    category: "Technology Infrastructure",
    weight: 16,
    maxPoints: 16,
    options: [
      { value: "chatbots", label: "Chatbots for Customer Service", description: "Automated tools for handling basic customer interactions.", points: 2 },
      { value: "rpa", label: "Robotic Process Automation (RPA)", description: "Tools that automate repetitive, rules-based tasks across systems.", points: 2 },
      { value: "ai_assistants", label: "AI Assistants / Agent Assist Tools", description: "AI-powered tools that support agents with real-time prompts, suggestions, and knowledge retrieval.", points: 2 },
      { value: "qa_analytics", label: "Automated QA or Analytics", description: "Systems that evaluate performance, compliance, or trends without manual scoring.", points: 2 },
      { value: "speech_analytics", label: "AI-Powered Speech Analytics / Voice Analytics", description: "Tools that extract insights and sentiment from recorded calls using natural language processing.", points: 2 },
      { value: "virtual_agents", label: "Virtual Agents / Conversational AI", description: "Bots that manage complex, multi-turn conversations or escalate seamlessly to live agents.", points: 2 },
      { value: "predictive_analytics", label: "Predictive Analytics / Forecasting Tools", description: "AI tools that anticipate volume surges, churn risk, or staffing needs.", points: 2 },
      { value: "intent_detection", label: "Intent Detection / Sentiment Analysis Tools", description: "AI that identifies customer emotion or intent in real time to guide interactions or trigger escalation.", points: 2 },
      { value: "none", label: "None of the above", description: "No automation tools currently in use", points: 0 } // exclusive
    ]
  },
  {
    id: "q2",
    title: "Data Infrastructure Maturity",
    subtitle: "How would you describe the current state of your customer and operational data systems?\nSelect the option that best matches your organization's level of integration and visibility.",
    type: "single",
    category: "Data Foundation",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "fully_integrated", label: "Fully integrated CRM with dashboards and clean data practices", points: 4 },
      { value: "crm_dashboards", label: "CRM with some dashboards; inconsistent data hygiene", points: 2 },
      { value: "separate_systems", label: "Disconnected systems; mostly manual reporting", points: 1 },
      { value: "no_centralized", label: "No centralized CRM or analytics in place", points: 0 }
    ]
  },
  {
    id: "q3",
    title: "Workforce AI Adoption Readiness",
    subtitle: "How prepared is your frontline and support team to adopt and apply AI tools?",
    type: "single",
    category: "Human Capital",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "fully_trained", label: "Fully trained and actively using AI", points: 4 },
      { value: "some_trained", label: "Partially trained; adoption varies across teams", points: 2 },
      { value: "no_training_open", label: "Not trained yet, but open to learning", points: 1 },
      { value: "resistant", label: "Little to no interest in AI adoption", points: 0 }
    ]
  },
  {
    id: "q4",
    title: "Scalability of CX Operations",
    subtitle: "Which option best reflects your team's ability to scale CX support as customer demands shift?",
    type: "single",
    category: "Strategic Planning",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "full_scalable", label: "Fully scalable (24/7, omnichannel, dynamic workforce scaling)", points: 4 },
      { value: "extended_multi", label: "Partially scalable (some channels or extended hours, with manual scale-ups)", points: 2 },
      { value: "limited_scaling", label: "Limited scalability (fixed hours or channels, difficult to expand quickly)", points: 1 },
      { value: "no_scalability", label: "No scalability (fixed capacity, can't flex with demand)", points: 0 }
    ]
  },
  {
    id: "q5",
    title: "KPI Tracking Sophistication",
    subtitle: "Which KPIs does your team consistently monitor to evaluate CX performance?",
    type: "multi",
    category: "Measurement & Analytics",
    weight: 9,
    maxPoints: 9,
    options: [
      { value: "nps", label: "Net Promoter Score (NPS)", points: 1 },
      { value: "csat", label: "Customer Satisfaction (CSAT)", points: 1 },
      { value: "fcr", label: "First Contact Resolution (FCR)", points: 1 },
      { value: "aht", label: "Average Handle Time (AHT)", points: 1 },
      { value: "asa", label: "Average Speed to Answer (ASA)", points: 1 },
      { value: "escalation_rate", label: "Escalation Rate", points: 1 },
      { value: "agent_productivity", label: "Agent Productivity / Utilization", points: 1 },
      { value: "qa_scores", label: "Quality Assurance (QA) Scores", points: 1 },
      { value: "bot_deflection_rate", label: "Bot Deflection Rate", points: 1 },
      { value: "none", label: "None of the above", points: 0 } // exclusive
    ]
  },
  {
    id: "q6",
    title: "Security & Compliance",
    subtitle: "Which of the following standards and practices are currently in place across your CX operations?",
    type: "multi",
    category: "Risk Management",
    weight: 12,
    maxPoints: 12,
    options: [
      { value: "iso_certifications", label: "ISO 27001 / ISO 9001 / SOC 2 Type II / similar certifications", points: 2 },
      { value: "industry_compliance", label: "Industry-specific compliance (HIPAA, PCI-DSS, GDPR, CCPA, FINRA)", points: 2 },
      { value: "penetration_testing", label: "Regular penetration testing / vulnerability scanning", points: 2 },
      { value: "dlp_protocols", label: "Data loss prevention (DLP) protocols", points: 2 },
      { value: "secure_workstations", label: "Secure agent workstations / endpoint protection", points: 2 },
      { value: "rbac_audit", label: "Role-based access control (RBAC) & audit logging", points: 2 },
      { value: "none", label: "None of the above", points: 0 } // exclusive
    ]
  },
  {
    id: "q7",
    title: "Budget & Executive Buy-In",
    subtitle: "Where does AI currently sit in your customer operations strategy?",
    type: "single",
    category: "Organizational Support",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "dedicated_budget", label: "Dedicated budget and C-level sponsor", description: "AI is a strategic priority with executive oversight and allocated funds.", points: 4 },
      { value: "pilot_budget", label: "Pilot budget approved", description: "Funds approved for proof-of-concept or limited AI rollout.", points: 3 },
      { value: "interest_no_budget", label: "Leadership interest, no budget yet", description: "Internal support exists, but funding hasn't been secured.", points: 2 },
      { value: "limited_engagement", label: "Minimal or no engagement", description: "AI is not yet a focus at the leadership level.", points: 0 }
    ]
  },
  {
    id: "q8",
    title: "Challenges",
    subtitle: "Which challenges are most urgent for your CX organization? (Select up to 3)",
    type: "multi",
    category: "Business Context",
    weight: 0,
    maxPoints: 0,
    maxSelections: 3,
    options: [
      { value: "high_attrition", label: "High attrition and talent shortages" },
      { value: "scaling_bottlenecks", label: "Inability to scale quickly to meet demand" },
      { value: "sla_misses", label: "Service Level Agreement (SLA) misses or inconsistent CX delivery" },
      { value: "rising_costs", label: "Rising labor costs and pressure to do more with less" },
      { value: "outdated_systems", label: "Outdated systems or fragmented tech stacks" },
      { value: "lack_data", label: "Lack of real-time visibility into performance or KPIs" },
      { value: "compliance_risks", label: "Compliance gaps or industry-specific quality risks" }
    ]
  },
  {
    id: "q9",
    title: "Urgency Assessment",
    subtitle: "How urgent is it to solve these CX and operational challenges?",
    type: "single",
    category: "Business Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "immediate", label: "Immediate — Already disrupting daily operations" },
      { value: "medium_term", label: "Short-Term — Needs resolution within 6–12 months" },
      { value: "long_term", label: "Long-Term — Part of broader future planning" }
    ]
  }
];