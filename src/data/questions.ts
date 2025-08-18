export const questions = [
  {
    id: "sector",
    title: "Sector",
    subtitle: "Which best describes your industry?",
    type: "single",
    category: "Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "retail", label: "Retail" },
      { value: "financial_services", label: "Financial Services" },
      { value: "telecom", label: "Telecom" },
      { value: "bpo", label: "BPO / Outsourcing" },
      { value: "healthcare", label: "Healthcare" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "logistics", label: "Logistics / Transportation" },
      { value: "other", label: "Other" }
    ]
  },
  {
    id: "region",
    title: "Region",
    subtitle: "Where are your main operations based?",
    type: "single",
    category: "Context",
    weight: 0,
    maxPoints: 0,
    options: [
      { value: "na", label: "North America" },
      { value: "emea", label: "EMEA" },
      { value: "apac", label: "APAC" },
      { value: "latam", label: "LATAM" },
      { value: "global", label: "Global / Mixed" }
    ]
  },
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
      { value: "none", label: "None of the above", description: "No automation tools currently in use", points: 0 } // exclusive
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
      { value: "fully_integrated", label: "Fully integrated CRM + dashboards + clean data processes", points: 4 },
      { value: "crm_dashboards", label: "CRM + some dashboards, inconsistent hygiene", points: 2 },
      { value: "separate_systems", label: "Separate systems, manual reporting", points: 1 },
      { value: "no_centralized", label: "No centralized CRM or analytics", points: 0 }
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
      { value: "fully_trained", label: "Fully trained and encouraged to use AI", points: 4 },
      { value: "some_trained", label: "Some trained, others hesitant", points: 2 },
      { value: "no_training_open", label: "No training, but open to change", points: 1 },
      { value: "resistant", label: "Resistant to change", points: 0 }
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
      { value: "full_scalable", label: "Autoscaling + 24/7 + multi-channel", points: 4 },
      { value: "extended_multi", label: "Extended hours + multi-channel; partial/manual scale-up", points: 2 },
      { value: "limited_scaling", label: "Limited hours/channels; slow to scale", points: 1 },
      { value: "no_scalability", label: "Fixed capacity; no scalability", points: 0 }
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
      { value: "nps", label: "Net Promoter Score (NPS)", points: 1 },
      { value: "aht", label: "Average Handle Time (AHT)", points: 1 },
      { value: "fcr", label: "First Contact Resolution (FCR)", points: 1 },
      { value: "csat", label: "Customer Satisfaction (CSAT)", points: 1 },
      { value: "agent_productivity", label: "Agent productivity/utilization", points: 1 },
      { value: "none", label: "None of the above", points: 0 } // exclusive
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
      { value: "iso_certifications", label: "ISO 27001 / ISO 9001 / similar certifications", points: 2 },
      { value: "penetration_testing", label: "Regular penetration testing / vulnerability scanning", points: 2 },
      { value: "industry_compliance", label: "Industry-specific compliance (HIPAA, PCI-DSS)", points: 2 },
      { value: "none", label: "None of the above", points: 0 } // exclusive
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
      { value: "dedicated_budget", label: "Dedicated budget & C-level sponsor", points: 4 },
      { value: "pilot_budget", label: "POC/pilot budget approved", points: 3 },
      { value: "interest_no_budget", label: "Interest from leadership, no budget yet", points: 2 },
      { value: "limited_engagement", label: "Limited or no engagement", points: 0 }
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
      { value: "high_attrition", label: "High attrition and talent shortages" },
      { value: "scaling_bottlenecks", label: "Scaling bottlenecks / inability to meet demand" },
      { value: "sla_misses", label: "SLA misses and customer experience gaps" },
      { value: "rising_costs", label: "Rising labor costs and efficiency pressure" },
      { value: "outdated_systems", label: "Outdated systems / tech stack limitations" },
      { value: "lack_data", label: "Lack of actionable data or performance visibility" },
      { value: "compliance_risks", label: "Compliance or quality risks" }
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
      { value: "immediate", label: "Immediate – impacting daily operations" },
      { value: "medium_term", label: "Medium-term – within 6–12 months" },
      { value: "long_term", label: "Long-term – part of future strategy" }
    ]
  }
];