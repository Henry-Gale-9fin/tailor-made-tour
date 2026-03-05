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

// Enhanced maturity scoring with 4 dimensions
export const getMaturityLevel = (
  usedCount: number,
  seenCount: number,
  unknownCount: number,
  frequency: string | null,
  totalFeatures: number,
  seniority: string | null = null
): MaturityLevel => {
  // NOTE: totalFeatures = features SHOWN to user (typically 5), not all features in system
  
  // 1. Adoption Rate (40% weight): How many SHOWN features actively used
  const adoptionRate = totalFeatures > 0 ? usedCount / totalFeatures : 0;
  const adoptionScore = adoptionRate * 40;
  
  // 2. Engagement Depth (30% weight): Used vs. seen ratio
  const engagementRatio = (usedCount + seenCount) > 0 ? usedCount / (usedCount + seenCount) : 0;
  const engagementScore = engagementRatio * 30;
  
  // 3. Usage Consistency (20% weight): Adjusted for seniority expectations
  let frequencyScore = 0;
  const seniorityLevel = seniority?.toLowerCase() || "";
  const isSenior = seniorityLevel.includes("partner") || 
                   seniorityLevel.includes("managing director") || 
                   seniorityLevel.includes("director");
  
  if (isSenior) {
    // Senior: Monthly usage is perfectly fine (strategic work)
    frequencyScore = 
      frequency === "Daily" ? 20 :
      frequency === "Weekly" ? 18 :
      frequency === "Monthly" ? 16 :  // Only -4 penalty for monthly
      frequency === "Yearly" ? 8 : 0;
  } else {
    // Junior/Mid: Expected to use more frequently (execution work)
    frequencyScore = 
      frequency === "Daily" ? 20 :
      frequency === "Weekly" ? 15 :
      frequency === "Monthly" ? 8 :   // Bigger penalty for infrequent use
      frequency === "Yearly" ? 3 : 0;
  }
  
  // 4. Feature Exploration (10% weight): Willingness to try SHOWN features
  const explorationRate = totalFeatures > 0 ? (usedCount + seenCount) / totalFeatures : 0;
  const explorationScore = explorationRate * 10;
  
  const totalScore = adoptionScore + engagementScore + frequencyScore + explorationScore;

  // Thresholds based on industry benchmarks
  if (totalScore >= 75) return "Expert";      // Top 10% of users
  if (totalScore >= 60) return "Advanced";    // Top 25% of users
  if (totalScore >= 40) return "Proficient";  // Top 50% of users
  if (totalScore >= 20) return "Developing";  // Getting started
  return "Beginner";                           // New users
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
  const totalFeatures = feedbackValues.length || 1;  // Features SHOWN to user (typically 5)
  const usedCount = feedbackValues.filter(v => v === "Used").length;
  const seenCount = feedbackValues.filter(v => v === "Seen").length;
  const unknownCount = feedbackValues.filter(v => v === "Unknown").length;

  // Enhanced maturity calculation (now seniority-aware)
  const maturityLevel = getMaturityLevel(usedCount, seenCount, unknownCount, frequency, totalFeatures, seniority);

  // Enhanced score calculation (0-100)
  // NOTE: Scoring based on features SHOWN to user, not all features in system
  // MAX POSSIBLE: 100 pts (use all shown features + daily frequency)
  
  // 1. Adoption: Used features (70 points) - THIS IS THE MOST IMPORTANT
  const adoptionScore = (usedCount / totalFeatures) * 70;
  
  // 2. Frequency: Usage consistency - adjusted for seniority (20 points)
  let frequencyScore = 0;
  const seniorityLevel = seniority?.toLowerCase() || "";
  const isSenior = seniorityLevel.includes("partner") || 
                   seniorityLevel.includes("managing director") || 
                   seniorityLevel.includes("director");
  
  if (isSenior) {
    // Senior: Less frequent usage is expected (strategic vs. daily execution)
    frequencyScore = 
      frequency === "Daily" ? 20 :
      frequency === "Weekly" ? 18 :
      frequency === "Monthly" ? 16 :  // Still good for senior roles
      frequency === "Yearly" ? 8 : 0;
  } else {
    // Junior/Mid: More frequent usage expected
    frequencyScore = 
      frequency === "Daily" ? 20 :
      frequency === "Weekly" ? 15 :
      frequency === "Monthly" ? 8 :
      frequency === "Yearly" ? 3 : 0;
  }
  
  // 3. Depth: Conversion from seen to used (10 points)
  // Rewards commitment: if you try features, do you adopt them?
  const conversionRate = (usedCount + seenCount) > 0 ? usedCount / (usedCount + seenCount) : 0;
  const depthScore = conversionRate * 10;

  const score = Math.min(100, Math.round(adoptionScore + frequencyScore + depthScore));

  // Build a lookup from loaded features
  const featureLookup = new Map(allFeatures.map(f => [f.id, f]));

  // Enhanced strengths based on multidimensional analysis
  const strengths: string[] = [];
  const adoptionRate = usedCount / totalFeatures;
  const explorationRate = (usedCount + seenCount) / totalFeatures;
  
  if (adoptionRate >= 0.8) {
    strengths.push(`Exceptional adoption: actively using ${usedCount} of ${totalFeatures} recommended features`);
  } else if (usedCount >= 3) {
    strengths.push(`Strong foundation: using ${usedCount} of ${totalFeatures} core features for your role`);
  } else if (usedCount >= 2) {
    strengths.push("Building momentum with platform adoption");
  }
  
  // Frequency strength (context-aware)
  if (frequency === "Daily") {
    strengths.push("Daily usage demonstrates strong platform integration into your workflow");
  } else if (frequency === "Weekly") {
    strengths.push("Consistent weekly engagement with platform capabilities");
  } else if (frequency === "Monthly" && isSenior) {
    strengths.push("Strategic monthly usage appropriate for senior-level work patterns");
  }
  
  if (conversionRate >= 0.75 && seenCount > 0) {
    strengths.push("High conversion rate: you effectively trial and adopt new features");
  }
  
  if (explorationRate >= 0.8) {
    strengths.push(`Excellent feature awareness: engaged with ${usedCount + seenCount} of ${totalFeatures} shown features`);
  }
  
  if (strengths.length === 0) {
    strengths.push("Early in your platform journey with opportunity for rapid growth");
    strengths.push("Openness to exploring high-value workflow tools");
  }
  
  // Ensure at least 2 strengths
  if (strengths.length === 1) {
    strengths.push("Willingness to learn and adapt to new tools");
  }

  // Enhanced blind spots with actionable insights
  const blindSpots: string[] = [];
  
  if (unknownCount >= 3) {
    blindSpots.push(`${unknownCount} high-impact features recommended for your role remain unexplored`);
  } else if (unknownCount >= 2) {
    blindSpots.push(`${unknownCount} relevant features not yet integrated into your workflow`);
  }
  
  if (seenCount >= 2 && conversionRate < 0.5) {
    blindSpots.push(`${seenCount} features trialed but not adopted—may need use case guidance`);
  }
  
  // Frequency blind spots (context-aware)
  if (!isSenior) {
    if (frequency === "Monthly" || frequency === "Yearly") {
      blindSpots.push("Infrequent usage limits feature proficiency and workflow optimization");
    } else if (frequency === "Never") {
      blindSpots.push("Platform underutilization—regular usage could transform efficiency");
    }
  } else {
    if (frequency === "Yearly" || frequency === "Never") {
      blindSpots.push("Limited engagement may restrict strategic platform value");
    }
  }
  
  if (adoptionRate < 0.4 && totalFeatures >= 3) {
    blindSpots.push(`Low adoption of role-specific features (${usedCount}/${totalFeatures} shown)`);
  }
  
  if (blindSpots.length === 0) {
    blindSpots.push("Minor optimization opportunities in advanced platform capabilities");
  }
  
  // Ensure at least 2 blind spots
  if (blindSpots.length === 1) {
    blindSpots.push("Opportunity to explore complementary features for workflow efficiency");
  }

  // Enhanced recommendations: prioritize by impact and readiness
  const unknownFeatures = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Unknown")
    .map(([id]) => ({ id, readiness: 2 })); // High readiness: new to user
  
  const seenFeatures = Object.entries(featureFeedback)
    .filter(([_, status]) => status === "Seen")
    .map(([id]) => ({ id, readiness: 1 })); // Medium readiness: already aware

  // Prioritize unknowns first (high impact), then seen (quick wins)
  const candidateFeatures = [...unknownFeatures, ...seenFeatures];
  
  // Score each candidate by category impact and readiness
  const scoredCandidates = candidateFeatures.map(({ id, readiness }) => {
    const feature = featureLookup.get(id);
    let impactScore = readiness * 10;
    
    // Boost score for high-value categories
    if (feature?.category?.toLowerCase().includes("ai")) impactScore += 15;
    if (feature?.category?.toLowerCase().includes("analytics")) impactScore += 12;
    if (feature?.category?.toLowerCase().includes("search")) impactScore += 10;
    if (feature?.category?.toLowerCase().includes("data")) impactScore += 8;
    
    // Boost for strategic features based on seniority
    if (seniority) {
      const level = seniority.toLowerCase();
      if ((level.includes("partner") || level.includes("director")) && 
          feature?.category?.toLowerCase().includes("market")) {
        impactScore += 10;
      }
    }
    
    return { id, feature, score: impactScore };
  });
  
  // Take top 3 by impact score
  const recommendedIds = scoredCandidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(c => c.id);
  
  const recommendations = recommendedIds.map(featureId => {
    const feature = featureLookup.get(featureId);
    const status = featureFeedback[featureId];
    
    // Customize rationale based on status and category
    let rationale = feature?.description || "This feature could enhance your workflow efficiency.";
    
    if (status === "Unknown") {
      rationale = `${feature?.category || "New capability"} you haven't explored yet. ${feature?.description || "Could significantly improve your workflow."}`;
    } else if (status === "Seen") {
      rationale = `You've seen this—now's the time to integrate it. ${feature?.description || "Quick adoption with high impact."}`;
    }
    
    return {
      featureId,
      title: feature?.name || featureId,
      rationale,
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
      title: "Your Personalised Platform Report",
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
