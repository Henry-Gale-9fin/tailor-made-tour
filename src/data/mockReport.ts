export interface ReportData {
  header: {
    title: string;
    subtitle: string;
  };
  score: number;
  maturity: {
    label: string;
    summary: string;
    peerComparison: string;
  };
  strengths: {
    bullets: string[];
  };
  blindSpots: {
    bullets: string[];
  };
  recommendations: {
    items: {
      featureId: string;
      title: string;
      rationale: string;
    }[];
  };
  cta: {
    text: string;
  };
}

type MaturityLevel = "Beginner" | "Developing" | "Proficient" | "Advanced" | "Expert";

export const getMaturityLevel = (
  usedCount: number,
  seenCount: number,
  frequency: string | null
): MaturityLevel => {
  const totalEngaged = usedCount + seenCount * 0.5;
  const frequencyBonus = 
    frequency === "Daily" ? 2 :
    frequency === "Weekly" ? 1.5 :
    frequency === "Monthly" ? 1 :
    frequency === "Yearly" ? 0.5 : 0;

  const score = totalEngaged + frequencyBonus;

  if (score >= 6) return "Expert";
  if (score >= 4.5) return "Advanced";
  if (score >= 3) return "Proficient";
  if (score >= 1.5) return "Developing";
  return "Beginner";
};

export const getMaturitySummary = (level: MaturityLevel): string => {
  const summaries: Record<MaturityLevel, string> = {
    Beginner: "You're at the very start of your platform journey, and that's perfectly fine — everyone starts here. The truth is, you're currently missing out on tools that could meaningfully change how you work day-to-day. The good news? Even adopting two or three features will put you ahead of most new users within weeks.",
    Developing: "You've taken the first steps and clearly see the value, but you're still only scratching the surface. The features you haven't tried yet aren't nice-to-haves — they're the ones that separate efficient teams from everyone else. Commit to exploring one new capability each week and you'll notice the compounding returns quickly.",
    Proficient: "You've built a strong foundation and clearly know your way around the core tools. That said, you're leaving meaningful value on the table by not engaging with some of the platform's more powerful capabilities. The features you haven't explored yet are specifically designed for professionals at your level — adopting even one could noticeably sharpen your edge.",
    Advanced: "You're operating at a high level and getting real leverage from the platform. Most users never reach this point, which speaks to your commitment to efficiency. The remaining gaps in your toolkit are small but impactful — closing them would put you in the top tier of platform users across the industry.",
    Expert: "You're a genuine power user with deep, practical knowledge of what this platform can do. You're extracting maximum value and likely setting the standard for your team. At this stage, your biggest opportunity is helping others around you level up — your expertise is an asset that multiplies when shared.",
  };
  return summaries[level];
};

export const generateReport = (
  firmType: string | null,
  seniority: string | null,
  frequency: string | null,
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">
): ReportData => {
  const feedbackValues = Object.values(featureFeedback);
  const totalFeatures = feedbackValues.length || 1;
  const usedCount = feedbackValues.filter(v => v === "Used").length;
  const seenCount = feedbackValues.filter(v => v === "Seen").length;
  const unknownCount = feedbackValues.filter(v => v === "Unknown").length;

  const maturityLevel = getMaturityLevel(usedCount, seenCount, frequency);

  const frequencyBonus = 
    frequency === "Daily" ? 2 :
    frequency === "Weekly" ? 1.5 :
    frequency === "Monthly" ? 1 :
    frequency === "Yearly" ? 0.5 : 0;

  const score = Math.min(100, Math.round(
    (usedCount / totalFeatures) * 50 +
    (seenCount / totalFeatures) * 20 +
    frequencyBonus * 6
  ));

  // Generate strengths based on "Used" features
  const strengths: string[] = [];
  if (usedCount >= 3) {
    strengths.push("Strong adoption of core platform features");
  }
  if (usedCount >= 2) {
    strengths.push("Active engagement with key workflow tools");
  }
  if (frequency === "Daily" || frequency === "Weekly") {
    strengths.push("Consistent platform usage habits");
  }
  if (strengths.length === 0) {
    strengths.push("Openness to exploring new tools");
    strengths.push("Potential for rapid skill development");
  }

  // Generate blind spots based on "Unknown" or "Seen" features
  const blindSpots: string[] = [];
  if (unknownCount >= 2) {
    blindSpots.push("Several high-value features remain undiscovered");
  }
  if (seenCount >= 2 && usedCount < 2) {
    blindSpots.push("Features seen but not yet integrated into workflow");
  }
  if (frequency === "Monthly" || frequency === "Yearly" || frequency === "Never") {
    blindSpots.push("Infrequent usage may limit feature familiarity");
  }
  if (blindSpots.length === 0) {
    blindSpots.push("Minor optimization opportunities in advanced features");
  }

  // Generate recommendations (prioritize Unknown, then Seen features)
  const unknownFeatures = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Unknown")
    .map(([id]) => id);
  
  const seenFeatures = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Seen")
    .map(([id]) => id);

  const recommendedFeatures = [...unknownFeatures, ...seenFeatures].slice(0, 3);
  
  const featureRationales: Record<string, string> = {
    "deal-tracker": "Real-time deal monitoring can significantly reduce time spent on manual market surveillance.",
    "document-search": "AI-powered document search can save hours of manual review time per week.",
    "credit-analysis": "Standardized credit metrics enable faster, more consistent investment decisions.",
    "market-intelligence": "Curated market feeds help you stay ahead of breaking developments.",
    "portfolio-analytics": "Real-time portfolio insights can improve risk management and performance tracking.",
    "covenant-alerts": "Automated covenant monitoring reduces the risk of missing critical threshold breaches.",
    "legal-docs": "Access to legal precedents accelerates documentation review and negotiation.",
    "pricing-data": "Institutional-grade pricing data improves valuation accuracy and trade execution.",
    "issuer-profiles": "Comprehensive issuer data enables faster due diligence and credit assessment.",
    "deal-comps": "Deal comparables streamline pricing analysis for new issues and secondary trades.",
    "workflow-tools": "Workflow automation can eliminate repetitive tasks and free up analytical capacity.",
    "data-export": "Seamless data export integrates platform insights into your existing processes.",
    "collaboration": "Team collaboration features improve information sharing and reduce duplicate work.",
    "api-access": "API access enables custom integrations tailored to your specific workflow needs.",
    "advisory-tools": "Advisory tools streamline client deliverables and market updates.",
  };

  const featureTitles: Record<string, string> = {
    "deal-tracker": "Deal Tracker",
    "document-search": "Document Search",
    "credit-analysis": "Credit Analysis",
    "market-intelligence": "Market Intelligence",
    "portfolio-analytics": "Portfolio Analytics",
    "covenant-alerts": "Covenant Alerts",
    "legal-docs": "Legal Document Library",
    "pricing-data": "Pricing Data",
    "issuer-profiles": "Issuer Profiles",
    "deal-comps": "Deal Comparables",
    "workflow-tools": "Workflow Tools",
    "data-export": "Data Export",
    "collaboration": "Team Collaboration",
    "api-access": "API Access",
    "advisory-tools": "Advisory Tools",
  };

  const recommendations = recommendedFeatures.map(featureId => ({
    featureId,
    title: featureTitles[featureId] || featureId,
    rationale: featureRationales[featureId] || "This feature could enhance your workflow efficiency.",
  }));

  // Fill with defaults if less than 3 recommendations
  while (recommendations.length < 3) {
    const defaultRecs = [
      { featureId: "workflow-tools", title: "Workflow Tools", rationale: "Automation can save hours of manual work each week." },
      { featureId: "market-intelligence", title: "Market Intelligence", rationale: "Stay ahead with curated market news and alerts." },
      { featureId: "data-export", title: "Data Export", rationale: "Integrate platform data seamlessly into your existing tools." },
    ];
    const rec = defaultRecs[recommendations.length];
    if (!recommendations.find(r => r.featureId === rec.featureId)) {
      recommendations.push(rec);
    } else {
      break;
    }
  }

  return {
    header: {
      title: "Your Personalized Platform Report",
      subtitle: `${firmType || "Professional"} • ${seniority || "Team Member"} • ${frequency || "Regular"} User`,
    },
    score,
    maturity: {
      label: maturityLevel,
      summary: getMaturitySummary(maturityLevel),
      peerComparison: `Most ${firmType || "industry"} professionals at your level use 3-4 features regularly.`,
    },
    strengths: {
      bullets: strengths,
    },
    blindSpots: {
      bullets: blindSpots,
    },
    recommendations: {
      items: recommendations.slice(0, 3),
    },
    cta: {
      text: "Ready to level up? Explore these features and transform your workflow.",
    },
  };
};
