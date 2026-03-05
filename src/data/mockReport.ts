import { Feature } from "./features";

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
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">,
  allFeatures: Feature[] = []
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

  // Build a lookup from loaded features
  const featureLookup = new Map(allFeatures.map(f => [f.id, f]));

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

  // Generate blind spots
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
    blindSpots.push("Minor optimisation opportunities in advanced features");
  }

  // Generate recommendations (prioritize Unknown, then Seen features)
  const unknownFeatureIds = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Unknown")
    .map(([id]) => id);
  
  const seenFeatureIds = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Seen")
    .map(([id]) => id);

  const recommendedIds = [...unknownFeatureIds, ...seenFeatureIds].slice(0, 3);
  
  const recommendations = recommendedIds.map(featureId => {
    const feature = featureLookup.get(featureId);
    return {
      featureId,
      title: feature?.name || featureId,
      rationale: feature?.description || "This feature could enhance your workflow efficiency.",
    };
  });

  // Fill with defaults if less than 3
  if (recommendations.length < 3 && allFeatures.length > 0) {
    const usedIds = new Set(recommendations.map(r => r.featureId));
    for (const f of allFeatures) {
      if (recommendations.length >= 3) break;
      if (!usedIds.has(f.id)) {
        recommendations.push({
          featureId: f.id,
          title: f.name,
          rationale: f.description,
        });
        usedIds.add(f.id);
      }
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
