# Enhanced Logic Integration Guide

This guide explains how to integrate the enhanced feature selection, scoring, and report generation logic into your Lovable app.

## Overview

The enhanced system provides three major improvements:

1. **Better Feature Selection** - Team-aware, seniority-appropriate, category-diverse
2. **Sophisticated Scoring** - Multi-dimensional scoring with clear breakdowns
3. **Richer Insights** - Contextual recommendations and actionable next steps

## Files Created

```
src/data/
├── enhancedLogic.ts        # Core logic (feature selection, scoring, recommendations)
├── enhancedReport.ts       # Enhanced report generation
└── featuresEnhanced.ts     # Enhanced feature retrieval functions
```

## Quick Integration

### Step 1: Update Feature Selection

**Before (in your onboarding flow):**
```typescript
import { getFeaturesForFirmType } from "@/data/features";

const features = getFeaturesForFirmType(firmType, allFeatures);
```

**After:**
```typescript
import { getEnhancedFeaturesForUser } from "@/data/featuresEnhanced";

const features = getEnhancedFeaturesForUser(
  firmType,
  selectedTeam,      // NEW: Pass the specific team
  selectedSeniority, // NEW: Pass seniority level
  allFeatures
);
```

**Benefits:**
- Features are now tailored to specific teams (e.g., "Levfin" vs "Distressed")
- Seniority consideration (juniors see simpler tools first)
- Category diversity ensures mix of AI, Data, and News features

---

### Step 2: Update Report Generation

**Before:**
```typescript
import { generateReport } from "@/data/mockReport";

const report = generateReport(
  firmType,
  seniority,
  frequency,
  featureFeedback,
  allFeatures
);
```

**After:**
```typescript
import { generateEnhancedReport } from "@/data/enhancedReport";
import { featureRelevanceMatrix } from "@/data/featuresEnhanced";

const report = generateEnhancedReport(
  firmType,
  selectedTeam,           // NEW: Team for better recommendations
  seniority,
  frequency,
  featureFeedback,
  allFeatures,
  featureRelevanceMatrix  // NEW: Matrix for relevance scoring
);
```

**Benefits:**
- Multi-dimensional score (adoption, engagement, consistency, exploration)
- Better recommendations prioritized by team relevance
- Richer insights with actionable next steps

---

### Step 3: Update Report UI (Optional)

If you want to display the score breakdown, update `ReportPage.tsx`:

```typescript
// Add score breakdown display
<Card>
  <h3>Score Breakdown</h3>
  <div className="space-y-2">
    <div>
      <span>Adoption</span>
      <Progress value={report.scoreBreakdown.adoption} max={30} />
    </div>
    <div>
      <span>Engagement</span>
      <Progress value={report.scoreBreakdown.engagement} max={25} />
    </div>
    <div>
      <span>Consistency</span>
      <Progress value={report.scoreBreakdown.consistency} max={25} />
    </div>
    <div>
      <span>Exploration</span>
      <Progress value={report.scoreBreakdown.exploration} max={20} />
    </div>
  </div>
</Card>
```

---

### Step 4: Add Team Selection to Onboarding

Update your onboarding flow to collect team information:

```typescript
// In your onboarding state
const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

// Add a team selection step
const teamOptions = getTeamsForFirmType(selectedFirmType);

<SelectionChip
  options={teamOptions}
  value={selectedTeam}
  onChange={setSelectedTeam}
/>
```

**Team Options by Firm Type:**
```typescript
const teamsByFirmType: Record<string, string[]> = {
  "Markets": ["Levfin", "Distressed", "Private Credit", "CLO", "ABF"],
  "Banks": ["Origination", "Sales & trading", "Restructuring", "Securitisation"],
  "Buyside": ["Performing credit", "Private credit investing", "CLO management", "Distressed"],
  "Law firms": ["Banking & Capital Markets", "BD", "Restructuring", "Structured finance"],
  "Advisors": ["Origination & pitching", "Restructuring"],
};
```

---

## Complete Example Flow

### 1. Onboarding Component

```typescript
import { useState } from "react";
import { getEnhancedFeaturesForUser, fetchAllFeatures } from "@/data/featuresEnhanced";

export const OnboardingFlow = () => {
  const [firmType, setFirmType] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [seniority, setSeniority] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

  // Load all features on mount
  useEffect(() => {
    fetchAllFeatures().then(setAllFeatures);
  }, []);

  // When firm type, team, and seniority are selected, get features
  useEffect(() => {
    if (firmType && seniority && allFeatures.length > 0) {
      const features = getEnhancedFeaturesForUser(
        firmType,
        team || undefined,
        seniority,
        allFeatures
      );
      setSelectedFeatures(features);
    }
  }, [firmType, team, seniority, allFeatures]);

  // ... rest of component
};
```

### 2. Report Generation Component

```typescript
import { generateEnhancedReport } from "@/data/enhancedReport";
import { featureRelevanceMatrix } from "@/data/featuresEnhanced";

export const ReportGenerator = ({ userProfile, featureFeedback, allFeatures }) => {
  const report = generateEnhancedReport(
    userProfile.firmType,
    userProfile.team,
    userProfile.seniority,
    userProfile.frequency,
    featureFeedback,
    allFeatures,
    featureRelevanceMatrix
  );

  return <ReportPage report={report} />;
};
```

---

## Key Improvements Explained

### 1. Feature Selection Algorithm

**Old Logic:**
- Count teams relevant to firm type
- Sort by team count
- Take top 5

**New Logic:**
1. **Team Relevance** (100 points): Perfect match if user's team is in feature's relevant teams
2. **Seniority Match** (25 points): Junior users get profiles/search, seniors get databases/analysis
3. **Status Bonus** (20 points): Production features prioritized
4. **Category Bonus** (15 points): AI features get slight boost
5. **Category Diversity**: Ensure mix of AI, Data & Analytics, News features

**Result:** More targeted, relevant features for each user profile.

---

### 2. Scoring System

**Old Logic:**
```
score = (usedCount/total * 50) + (seenCount/total * 20) + frequencyBonus
```

**New Logic:**
```
Adoption (30 points):    How many features actively used
Engagement (25 points):  Features seen but not used
Consistency (25 points): Usage frequency (Daily=25, Weekly=20, etc.)
Exploration (20 points): 1 - (unknownCount/total) * 40
─────────────────────────
Total: 100 points
```

**Benefits:**
- Clear breakdown shows where user excels/needs improvement
- More nuanced scoring considers multiple dimensions
- Frequency properly weighted (Daily users get 25 points vs 0 for Never)

---

### 3. Recommendation Engine

**Old Logic:**
- List unknown features first
- Then seen features
- Take first 3

**New Logic:**
1. **Score each feature** based on:
   - Unknown > Seen (priority)
   - Team relevance (100 points for perfect match)
   - Category diversity (AI bonus)
   - Seniority appropriateness
   - Production status

2. **Ensure diversity**:
   - First pass: one from each category
   - Second pass: fill with highest scores

3. **Generate contextual rationale**:
   - "You've seen this before — now's the time to integrate it"
   - "Essential for senior professionals looking to maximize efficiency"

**Result:** Recommendations are highly relevant and compelling.

---

## Testing

### Test Feature Selection

```typescript
import { getEnhancedFeaturesForUser } from "@/data/featuresEnhanced";

const features = getEnhancedFeaturesForUser(
  "Banks",
  "Origination",
  "Vice President",
  allFeatures
);

console.log("Selected features:", features.map(f => f.name));
// Should show features highly relevant to Banks/Origination
```

### Test Scoring

```typescript
import { calculateSophisticationScore } from "@/data/enhancedLogic";

const feedback = {
  "ai-earnings-transcripts": "Used",
  "company-profiles": "Used",
  "covenant-data": "Seen",
  "market-trends": "Unknown",
  "deal-predictions": "Unknown",
};

const score = calculateSophisticationScore(
  feedback,
  {
    firmType: "Markets",
    team: "Levfin",
    seniority: "Analyst",
    frequency: "Daily",
  },
  5
);

console.log("Score:", score.overall);
console.log("Breakdown:", score.breakdown);
console.log("Level:", score.level);
```

### Test Recommendations

```typescript
import { generateRecommendations } from "@/data/enhancedLogic";
import { featureRelevanceMatrix } from "@/data/featuresEnhanced";

const recs = generateRecommendations(
  feedback,
  allFeatures,
  {
    firmType: "Banks",
    team: "Origination",
    seniority: "Director",
    frequency: "Weekly",
  },
  featureRelevanceMatrix,
  3
);

console.log("Recommendations:", recs);
```

---

## Migration Checklist

- [ ] Add `enhancedLogic.ts` to `src/data/`
- [ ] Add `enhancedReport.ts` to `src/data/`
- [ ] Add `featuresEnhanced.ts` to `src/data/`
- [ ] Update onboarding to collect team selection
- [ ] Replace `getFeaturesForFirmType` with `getEnhancedFeaturesForUser`
- [ ] Replace `generateReport` with `generateEnhancedReport`
- [ ] Update `ReportPage` interface to include `scoreBreakdown` and `nextSteps`
- [ ] (Optional) Add UI for score breakdown visualization
- [ ] Test with various user profiles
- [ ] Deploy to staging

---

## Troubleshooting

### "featureRelevanceMatrix is undefined"
Make sure you're importing from `featuresEnhanced.ts`:
```typescript
import { featureRelevanceMatrix } from "@/data/featuresEnhanced";
```

### "Team selection not affecting features"
Check that you're passing the team parameter:
```typescript
getEnhancedFeaturesForUser(firmType, team, seniority, allFeatures)
//                                    ^^^^  Must not be undefined
```

### "Scores seem too low/high"
Check the frequency value - it has a big impact:
```typescript
"Daily" = 25 points
"Weekly" = 20 points
"Monthly" = 12 points
"Yearly" = 6 points
"Never" = 0 points
```

---

## Performance Notes

- All functions are synchronous and fast (<1ms typically)
- Feature selection runs once per onboarding flow
- Scoring/report generation runs once at completion
- No external API calls needed

---

## Next Steps

1. **Add Team Selection UI** - Update onboarding to collect team
2. **Integrate Enhanced Functions** - Replace old functions
3. **Test User Flows** - Try different profiles
4. **Add Score Breakdown UI** - Visualize the 4 dimensions
5. **Monitor Results** - Track if users find recommendations more relevant

---

For questions or issues, refer to the source code in `enhancedLogic.ts` - it's heavily commented!
