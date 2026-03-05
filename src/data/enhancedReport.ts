import { Feature } from "./features";
import {
  UserProfile,
  FeatureFeedback,
  calculateSophisticationScore,
  generateRecommendations,
  generateEnhancedInsights,
} from "./enhancedLogic";

export interface ReportData {
  header: {
    title: string;
    subtitle: string;
  };
  score: number;
  scoreBreakdown: {
    adoption: number;
    engagement: number;
    consistency: number;
    exploration: number;
  };
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
      priority: "high" | "medium" | "low";
      category: string;
    }[];
  };
  nextSteps: {
    bullets: string[];
  };
  cta: {
    text: string;
  };
}

type MaturityLevel = "Beginner" | "Developing" | "Proficient" | "Advanced" | "Expert";

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

/**
 * Generate enhanced report using sophisticated logic
 */
export const generateEnhancedReport = (
  firmType: string | null,
  team: string | null,
  seniority: string | null,
  frequency: string | null,
  featureFeedback: FeatureFeedback,
  allFeatures: Feature[],
  featureRelevanceMatrix: Record<string, Record<string, string[]>>
): ReportData => {
  // Build user profile
  const profile: UserProfile = {
    firmType: firmType || "Professional",
    team: team || undefined,
    seniority: seniority || "Team Member",
    frequency: frequency || "Regular",
  };

  // Calculate sophisticated score
  const sophisticationScore = calculateSophisticationScore(
    featureFeedback,
    profile,
    allFeatures.length
  );

  // Generate recommendations
  const recommendations = generateRecommendations(
    featureFeedback,
    allFeatures,
    profile,
    featureRelevanceMatrix,
    3
  );

  // Generate insights
  const insights = generateEnhancedInsights(
    featureFeedback,
    sophisticationScore,
    profile,
    allFeatures
  );

  return {
    header: {
      title: "Your Personalised Platform Report",
      subtitle: `${profile.firmType} • ${profile.seniority} • ${profile.frequency} User`,
    },
    score: sophisticationScore.overall,
    scoreBreakdown: sophisticationScore.breakdown,
    maturity: {
      label: sophisticationScore.level,
      summary: getMaturitySummary(sophisticationScore.level),
      peerComparison: insights.peerComparison,
    },
    strengths: {
      bullets: insights.strengths,
    },
    blindSpots: {
      bullets: insights.blindSpots,
    },
    recommendations: {
      items: recommendations,
    },
    nextSteps: {
      bullets: insights.nextSteps,
    },
    cta: {
      text: "Ready to level up? Explore these features and transform your workflow.",
    },
  };
};

// Legacy function for backward compatibility
export const generateReport = (
  firmType: string | null,
  seniority: string | null,
  frequency: string | null,
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">,
  allFeatures: Feature[] = []
): ReportData => {
  // For backward compatibility, create a simple feature relevance matrix
  const simpleMatrix: Record<string, Record<string, string[]>> = {};
  allFeatures.forEach(f => {
    simpleMatrix[f.id] = {
      markets: [],
      banks: [],
      buyside: [],
      law_firms: [],
      advisors: [],
    };
  });

  return generateEnhancedReport(
    firmType,
    null,
    seniority,
    frequency,
    featureFeedback,
    allFeatures,
    simpleMatrix
  );
};

// Export for backward compatibility
export { getMaturityLevel } from "./enhancedLogic";

function getMaturityLevel(usedCount: number, seenCount: number, frequency: string | null): MaturityLevel {
  const profile: UserProfile = {
    firmType: "Professional",
    seniority: "Team Member",
    frequency: frequency || "Regular",
  };
  
  // Create simple feedback for scoring
  const featureFeedback: FeatureFeedback = {};
  for (let i = 0; i < usedCount; i++) {
    featureFeedback[`feature_${i}`] = "Used";
  }
  for (let i = 0; i < seenCount; i++) {
    featureFeedback[`seen_${i}`] = "Seen";
  }
  
  const score = calculateSophisticationScore(featureFeedback, profile, usedCount + seenCount);
  return score.level;
}
