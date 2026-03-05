// Enhanced Feature Selection & Scoring Logic
// Integrates sophisticated team-based relevance and usage patterns

import { Feature } from "./features";

export interface UserProfile {
  firmType: string;
  team?: string;
  seniority: string;
  frequency: string;
}

export interface FeatureFeedback {
  [featureId: string]: "Used" | "Seen" | "Unknown";
}

// =======================
// ENHANCED FEATURE SELECTION
// =======================

/**
 * Select top 5 features for exploration based on:
 * 1. Team-specific relevance (primary)
 * 2. Category diversity (AI, Data, News)
 * 3. Feature status (production > prototype)
 * 4. Seniority appropriateness
 */
export const selectFeaturesForExploration = (
  allFeatures: Feature[],
  profile: UserProfile,
  featureRelevanceMatrix: Record<string, Record<string, string[]>>
): Feature[] => {
  const firmTypeKey = profile.firmType.toLowerCase().replace(" ", "_");
  
  // Score each feature
  const scored = allFeatures.map(feature => {
    let score = 0;
    
    // 1. Team relevance (highest weight)
    const relevance = featureRelevanceMatrix[feature.id];
    const relevantTeams = relevance?.[firmTypeKey] || [];
    
    if (profile.team && relevantTeams.includes(profile.team)) {
      score += 100; // Perfect match
    } else if (relevantTeams.length > 0) {
      score += 50; // Relevant to firm type but not specific team
    }
    
    // 2. Seniority appropriateness
    const seniorityScore = getSeniorityScore(feature, profile.seniority);
    score += seniorityScore;
    
    // 3. Feature status bonus
    if (feature.status === "production") {
      score += 20;
    } else if (feature.status === "prototype") {
      score += 10;
    }
    
    // 4. Category priority (AI features slightly higher)
    if (feature.category?.includes("AI")) {
      score += 15;
    }
    
    return { feature, score, category: feature.category };
  });
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score);
  
  // Ensure category diversity - pick top scoring from each category
  const selected: Feature[] = [];
  const categoriesUsed = new Set<string>();
  
  // First pass: one from each major category
  for (const item of scored) {
    if (selected.length >= 5) break;
    
    const category = item.category || "Other";
    if (!categoriesUsed.has(category)) {
      selected.push(item.feature);
      categoriesUsed.add(category);
    }
  }
  
  // Second pass: fill remaining slots with highest scores
  for (const item of scored) {
    if (selected.length >= 5) break;
    if (!selected.find(f => f.id === item.feature.id)) {
      selected.push(item.feature);
    }
  }
  
  return selected.slice(0, 5);
};

/**
 * Score feature appropriateness based on seniority level
 */
const getSeniorityScore = (feature: Feature, seniority: string): number => {
  const isJunior = ["analyst", "associate", "trainee"].some(s => 
    seniority.toLowerCase().includes(s)
  );
  const isSenior = ["director", "md", "managing", "partner", "principal"].some(s => 
    seniority.toLowerCase().includes(s)
  );
  
  // Junior users: prioritize profiles, search, simpler tools
  if (isJunior) {
    if (feature.id.includes("profile") || feature.id.includes("search")) {
      return 25;
    }
    if (feature.id.includes("database") || feature.id.includes("covenant")) {
      return 10; // Still relevant but lower priority
    }
  }
  
  // Senior users: prioritize analysis, databases, complex tools
  if (isSenior) {
    if (feature.id.includes("database") || feature.id.includes("covenant") || 
        feature.id.includes("analysis")) {
      return 25;
    }
    if (feature.category?.includes("AI")) {
      return 20; // AI tools valuable at all levels
    }
  }
  
  return 15; // Default score for mid-level
};

// =======================
// ENHANCED SCORE GENERATION
// =======================

export interface SophisticationScore {
  overall: number; // 0-100
  breakdown: {
    adoption: number; // Feature adoption rate
    engagement: number; // Depth of usage
    consistency: number; // Frequency of use
    exploration: number; // Willingness to try new features
  };
  level: "Beginner" | "Developing" | "Proficient" | "Advanced" | "Expert";
}

/**
 * Calculate sophisticated score with multi-dimensional analysis
 */
export const calculateSophisticationScore = (
  featureFeedback: FeatureFeedback,
  profile: UserProfile,
  totalFeaturesRelevant: number
): SophisticationScore => {
  const feedbackValues = Object.values(featureFeedback);
  const totalFeaturesEvaluated = feedbackValues.length || 1;
  
  const usedCount = feedbackValues.filter(v => v === "Used").length;
  const seenCount = feedbackValues.filter(v => v === "Seen").length;
  const unknownCount = feedbackValues.filter(v => v === "Unknown").length;
  
  // 1. Adoption Score (0-30 points): How many features actively used
  const adoptionRate = usedCount / totalFeaturesEvaluated;
  const adoptionScore = Math.min(30, adoptionRate * 60); // Max 30 points
  
  // 2. Engagement Score (0-25 points): Seen but not used features
  const engagementRate = seenCount / totalFeaturesEvaluated;
  const engagementScore = Math.min(25, engagementRate * 50); // Max 25 points
  
  // 3. Consistency Score (0-25 points): Usage frequency
  const frequencyScore = getFrequencyScore(profile.frequency);
  const consistencyScore = Math.min(25, frequencyScore); // Max 25 points
  
  // 4. Exploration Score (0-20 points): Low unknown count = high exploration
  const explorationRate = 1 - (unknownCount / totalFeaturesEvaluated);
  const explorationScore = Math.min(20, explorationRate * 40); // Max 20 points
  
  // Calculate overall (max 100)
  const overall = Math.round(
    adoptionScore + engagementScore + consistencyScore + explorationScore
  );
  
  // Determine level
  const level = determineLevel(overall, usedCount, profile.frequency);
  
  return {
    overall: Math.min(100, overall),
    breakdown: {
      adoption: Math.round(adoptionScore),
      engagement: Math.round(engagementScore),
      consistency: Math.round(consistencyScore),
      exploration: Math.round(explorationScore),
    },
    level,
  };
};

const getFrequencyScore = (frequency: string): number => {
  const scores: Record<string, number> = {
    "Daily": 25,
    "Weekly": 20,
    "Monthly": 12,
    "Yearly": 6,
    "Never": 0,
  };
  return scores[frequency] || 0;
};

const determineLevel = (
  score: number,
  usedCount: number,
  frequency: string
): "Beginner" | "Developing" | "Proficient" | "Advanced" | "Expert" => {
  // Edge case: If never used platform, always beginner
  if (frequency === "Never" || usedCount === 0) {
    return "Beginner";
  }
  
  // Score-based with usage validation
  if (score >= 80 && usedCount >= 4) return "Expert";
  if (score >= 65 && usedCount >= 3) return "Advanced";
  if (score >= 45 && usedCount >= 2) return "Proficient";
  if (score >= 25 && usedCount >= 1) return "Developing";
  return "Beginner";
};

// =======================
// ENHANCED RECOMMENDATIONS
// =======================

export interface FeatureRecommendation {
  featureId: string;
  title: string;
  rationale: string;
  priority: "high" | "medium" | "low";
  category: string;
}

/**
 * Generate intelligent feature recommendations
 */
export const generateRecommendations = (
  featureFeedback: FeatureFeedback,
  allFeatures: Feature[],
  profile: UserProfile,
  featureRelevanceMatrix: Record<string, Record<string, string[]>>,
  limit: number = 3
): FeatureRecommendation[] => {
  const firmTypeKey = profile.firmType.toLowerCase().replace(" ", "_");
  
  // Score each feature for recommendation
  const recommendations = allFeatures
    .map(feature => {
      const feedback = featureFeedback[feature.id];
      
      // Skip already used features
      if (feedback === "Used") {
        return null;
      }
      
      let score = 0;
      let priority: "high" | "medium" | "low" = "medium";
      
      // 1. Unknown features are higher priority than Seen
      if (feedback === "Unknown") {
        score += 50;
        priority = "high";
      } else if (feedback === "Seen") {
        score += 30;
        priority = "medium";
      }
      
      // 2. Team relevance
      const relevance = featureRelevanceMatrix[feature.id];
      const relevantTeams = relevance?.[firmTypeKey] || [];
      
      if (profile.team && relevantTeams.includes(profile.team)) {
        score += 100; // Highly relevant
      } else if (relevantTeams.length > 0) {
        score += 40;
      } else {
        score += 10; // Less relevant but still useful
      }
      
      // 3. Category variety bonus (prefer diverse recommendations)
      if (feature.category?.includes("AI")) {
        score += 20; // AI features are transformative
      }
      
      // 4. Seniority match
      score += getSeniorityScore(feature, profile.seniority);
      
      // 5. Production features slightly preferred
      if (feature.status === "production") {
        score += 10;
      }
      
      // Generate contextual rationale
      const rationale = generateRationale(feature, profile, feedback);
      
      return {
        feature,
        score,
        priority,
        rationale,
      };
    })
    .filter(Boolean) as Array<{
      feature: Feature;
      score: number;
      priority: "high" | "medium" | "low";
      rationale: string;
    }>;
  
  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  
  // Ensure category diversity in top recommendations
  const selected: FeatureRecommendation[] = [];
  const categoriesUsed = new Set<string>();
  
  // First pass: one from each category
  for (const rec of recommendations) {
    if (selected.length >= limit) break;
    
    const category = rec.feature.category || "Other";
    if (!categoriesUsed.has(category)) {
      selected.push({
        featureId: rec.feature.id,
        title: rec.feature.name,
        rationale: rec.rationale,
        priority: rec.priority,
        category,
      });
      categoriesUsed.add(category);
    }
  }
  
  // Second pass: fill remaining
  for (const rec of recommendations) {
    if (selected.length >= limit) break;
    if (!selected.find(s => s.featureId === rec.feature.id)) {
      selected.push({
        featureId: rec.feature.id,
        title: rec.feature.name,
        rationale: rec.rationale,
        priority: rec.priority,
        category: rec.feature.category || "Other",
      });
    }
  }
  
  return selected;
};

/**
 * Generate contextual rationale for feature recommendation
 */
const generateRationale = (
  feature: Feature,
  profile: UserProfile,
  feedback: "Used" | "Seen" | "Unknown" | undefined
): string => {
  // Base rationale from feature description
  let rationale = feature.description || feature.use_case;
  
  // Add context based on feedback status
  if (feedback === "Seen") {
    rationale = `You've seen this before — now's the time to integrate it. ${rationale}`;
  } else if (feedback === "Unknown") {
    rationale = `This is a game-changer you haven't discovered yet. ${rationale}`;
  }
  
  // Add seniority context
  const isSenior = ["director", "md", "managing", "partner", "principal"].some(s => 
    profile.seniority.toLowerCase().includes(s)
  );
  
  if (isSenior && feature.category?.includes("AI")) {
    rationale += " Essential for senior professionals looking to maximize efficiency.";
  } else if (isSenior && feature.id.includes("database")) {
    rationale += " Provides the depth of analysis expected at your level.";
  }
  
  return rationale;
};

// =======================
// ENHANCED INSIGHTS
// =======================

export interface EnhancedInsights {
  strengths: string[];
  blindSpots: string[];
  peerComparison: string;
  nextSteps: string[];
}

/**
 * Generate sophisticated insights based on usage patterns
 */
export const generateEnhancedInsights = (
  featureFeedback: FeatureFeedback,
  score: SophisticationScore,
  profile: UserProfile,
  allFeatures: Feature[]
): EnhancedInsights => {
  const feedbackValues = Object.values(featureFeedback);
  const usedCount = feedbackValues.filter(v => v === "Used").length;
  const seenCount = feedbackValues.filter(v => v === "Seen").length;
  const unknownCount = feedbackValues.filter(v => v === "Unknown").length;
  
  // Generate contextual strengths
  const strengths: string[] = [];
  
  if (score.breakdown.adoption >= 20) {
    strengths.push(`Strong feature adoption (${usedCount} actively used)`);
  }
  
  if (score.breakdown.consistency >= 20) {
    strengths.push(`Consistent ${profile.frequency.toLowerCase()} engagement`);
  }
  
  if (score.breakdown.exploration >= 15) {
    strengths.push("High curiosity and willingness to explore new tools");
  }
  
  if (usedCount >= 3 && profile.frequency === "Daily") {
    strengths.push("Power user behavior — extracting maximum platform value");
  }
  
  if (strengths.length === 0) {
    strengths.push("Early stage with significant growth potential");
  }
  
  // Generate blind spots
  const blindSpots: string[] = [];
  
  if (unknownCount >= 3) {
    blindSpots.push(`${unknownCount} high-value features remain completely unexplored`);
  }
  
  if (seenCount >= 2 && usedCount < seenCount) {
    blindSpots.push("Several features identified but not yet integrated into daily workflow");
  }
  
  if (profile.frequency === "Monthly" || profile.frequency === "Yearly") {
    blindSpots.push("Infrequent usage limiting familiarity and efficiency gains");
  }
  
  if (score.breakdown.adoption < 15 && usedCount < 2) {
    blindSpots.push("Limited adoption preventing access to compounding productivity benefits");
  }
  
  if (blindSpots.length === 0) {
    blindSpots.push("Minor optimization opportunities in advanced feature combinations");
  }
  
  // Generate peer comparison
  const peerComparison = generatePeerComparison(score, profile);
  
  // Generate next steps
  const nextSteps = generateNextSteps(score, profile, usedCount, seenCount);
  
  return {
    strengths,
    blindSpots,
    peerComparison,
    nextSteps,
  };
};

const generatePeerComparison = (
  score: SophisticationScore,
  profile: UserProfile
): string => {
  const level = score.level;
  const firmType = profile.firmType;
  
  const comparisons: Record<typeof level, string> = {
    "Beginner": `Most ${firmType} professionals at your level use 2-3 features regularly. You're at the starting line — which means the opportunity ahead is enormous.`,
    "Developing": `The average ${firmType} professional uses 3-4 features. You're building momentum but still trailing the pack.`,
    "Proficient": `You're performing at or slightly above the ${firmType} average. Most peers at your level have adopted 3-5 core features.`,
    "Advanced": `You're in the top 25% of ${firmType} users. Peers at this level typically use 4-6 features with high proficiency.`,
    "Expert": `You're in the top 10% of all ${firmType} professionals. Your usage patterns set the standard for your peer group.`,
  };
  
  return comparisons[level];
};

const generateNextSteps = (
  score: SophisticationScore,
  profile: UserProfile,
  usedCount: number,
  seenCount: number
): string[] => {
  const steps: string[] = [];
  
  if (score.level === "Beginner" || score.level === "Developing") {
    steps.push("Commit to exploring one new feature this week");
    steps.push("Set aside 15 minutes daily for platform usage");
    if (seenCount > 0) {
      steps.push("Convert 'seen' features into 'used' by trying them in real workflows");
    }
  }
  
  if (score.level === "Proficient" || score.level === "Advanced") {
    steps.push("Master advanced features in your most-used tools");
    steps.push("Explore feature combinations for workflow efficiency");
    steps.push("Share best practices with your team");
  }
  
  if (score.level === "Expert") {
    steps.push("Become an internal champion and train colleagues");
    steps.push("Provide feedback on platform improvements");
    steps.push("Document your workflows for team knowledge sharing");
  }
  
  if (profile.frequency === "Monthly" || profile.frequency === "Yearly") {
    steps.push("Increase platform engagement frequency to unlock full value");
  }
  
  return steps.slice(0, 3); // Max 3 steps
};
