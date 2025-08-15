export const questions = [
  {
    id: "q1",
    title: "Current Automation Level",
    subtitle: "Which automation tools are currently in use in your customer operations? (Select all that apply)",
    type: "multi",
    category: "Technology Infrastructure",
    weight: 8,
    maxPoints: 8,
    options: [
      { value: "chatbots", label: "Chatbots for customer service", description: "Automated customer service tools", points: 2 },
      { value: "rpa", label: "Robotic Process Automation (RPA)", description: "Process automation tools", points: 2 },
      { value: "ai_assistants", label: "AI assistants / agent assist tools", description: "AI-powered agent support", points: 2 },
      { value: "qa_analytics", label: "Automated QA or analytics", description: "Quality assurance and analytics automation", points: 2 },
      { value: "none", label: "None of the above", description: "No automation tools currently in use", points: 0 }
    ]
  },
  {
    id: "q2",
    title: "Data Infrastructure Maturity",
    subtitle: "Which best describes your customer and operational data systems?",
    type: "single",
    category: "Data Foundation",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "fully_integrated", label: "Fully integrated CRM + dashboards + clean data processes", description: "Complete data integration with clean processes", points: 4 },
      { value: "crm_dashboards", label: "CRM + some dashboards, inconsistent hygiene", description: "Partial integration with data quality issues", points: 2 },
      { value: "separate_systems", label: "Separate systems, manual reporting", description: "Disconnected systems requiring manual work", points: 1 },
      { value: "no_centralized", label: "No centralized CRM or analytics", description: "No unified data infrastructure", points: 0 }
    ]
  },
  {
    id: "q3",
    title: "Workforce AI Adoption Readiness",
    subtitle: "How prepared is your team to adopt AI tools?",
    type: "single",
    category: "Human Capital",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "fully_trained", label: "Fully trained and encouraged to use AI", description: "Team is AI-ready and motivated", points: 4 },
      { value: "some_trained", label: "Some trained, others hesitant", description: "Mixed skill levels and attitudes", points: 2 },
      { value: "no_training_open", label: "No training, but open to change", description: "Willing but untrained workforce", points: 1 },
      { value: "resistant", label: "Resistant to change", description: "Team is hesitant about AI adoption", points: 0 }
    ]
  },
  {
    id: "q4",
    title: "Scalability of CX Operations",
    subtitle: "Which best describes your operational scalability?",
    type: "single",
    category: "Strategic Planning",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "full_scalable", label: "24/7 coverage, multi-channel, rapid scaling", description: "Full operational scalability", points: 4 },
      { value: "extended_multi", label: "Extended hours, multi-channel, moderate flexibility", description: "Good scalability with some limitations", points: 2 },
      { value: "limited_scaling", label: "Limited hours/channels, slow to scale", description: "Basic scalability with constraints", points: 1 },
      { value: "no_scalability", label: "No scalability beyond core team", description: "No operational scalability", points: 0 }
    ]
  },
  {
    id: "q5",
    title: "KPI Tracking Sophistication",
    subtitle: "Which KPIs do you track consistently? (Select all that apply)",
    type: "multi",
    category: "Measurement & Analytics",
    weight: 5,
    maxPoints: 5,
    options: [
      { value: "nps", label: "Net Promoter Score (NPS)", description: "Customer loyalty and satisfaction metric", points: 1 },
      { value: "aht", label: "Average Handle Time (AHT)", description: "Efficiency and productivity metric", points: 1 },
      { value: "fcr", label: "First Contact Resolution (FCR)", description: "Customer experience quality metric", points: 1 },
      { value: "csat", label: "Customer Satisfaction (CSAT)", description: "Customer satisfaction measurement", points: 1 },
      { value: "agent_productivity", label: "Agent productivity/utilization", description: "Staff performance metrics", points: 1 },
      { value: "none", label: "None of the above", description: "No consistent KPI tracking", points: 0 }
    ]
  },
  {
    id: "q6",
    title: "Security & Compliance",
    subtitle: "Which of the following are in place? (Select all that apply)",
    type: "multi",
    category: "Risk Management",
    weight: 6,
    maxPoints: 6,
    options: [
      { value: "iso_certifications", label: "ISO 27001 / ISO 9001 / similar certifications", description: "International standards compliance", points: 2 },
      { value: "penetration_testing", label: "Regular penetration testing / vulnerability scanning", description: "Security testing and monitoring", points: 2 },
      { value: "industry_compliance", label: "Industry-specific compliance (HIPAA, PCI-DSS)", description: "Industry regulatory compliance", points: 2 },
      { value: "none", label: "None of the above", description: "No formal security measures", points: 0 }
    ]
  },
  {
    id: "q7",
    title: "Budget & Executive Buy-In",
    subtitle: "How committed is leadership to AI initiatives?",
    type: "single",
    category: "Organizational Support",
    weight: 4,
    maxPoints: 4,
    options: [
      { value: "dedicated_budget", label: "Dedicated budget & C-level sponsor", description: "Full executive support with funding", points: 4 },
      { value: "interest_no_budget", label: "Interest from leadership, no budget yet", description: "Supportive but no dedicated funding", points: 2 },
      { value: "limited_engagement", label: "Limited or no engagement", description: "Minimal leadership support", points: 0 }
    ]
  },
  {
    id: "q8",
    title: "Pain Points",
    subtitle: "Which of these challenges are most pressing for your organization? (Select up to 3)",
    type: "multi",
    category: "Business Context",
    weight: 0,
    maxPoints: 0,
    maxSelections: 3,
    options: [
      { value: "high_attrition", label: "High attrition and talent shortages", description: "Staff retention and recruitment challenges" },
      { value: "scaling_bottlenecks", label: "Scaling bottlenecks / inability to meet demand", description: "Growth and capacity constraints" },
      { value: "sla_misses", label: "SLA misses and customer experience gaps", description: "Service level agreement failures" },
      { value: "rising_costs", label: "Rising labor costs and efficiency pressure", description: "Cost management and efficiency challenges" },
      { value: "outdated_systems", label: "Outdated systems / tech stack limitations", description: "Technology modernization needs" },
      { value: "lack_data", label: "Lack of actionable data or performance visibility", description: "Data and analytics gaps" },
      { value: "compliance_risks", label: "Compliance or quality risks", description: "Regulatory and quality concerns" }
    ]
  },
  {
    id: "q9",
    title: "Urgency Assessment",
    subtitle: "How urgent is it to address these challenges?",
    type: "single",
    category: "Business Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "immediate", label: "Immediate – impacting daily operations", description: "Critical urgency affecting operations" },
      { value: "medium_term", label: "Medium-term – within 6–12 months", description: "Moderate urgency for planning" },
      { value: "long_term", label: "Long-term – part of future strategy", description: "Strategic planning priority" }
    ]
  }
];
