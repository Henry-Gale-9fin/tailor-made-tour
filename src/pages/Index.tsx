import { useEffect, useState, useCallback } from "react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { SelectionSummary } from "@/components/onboarding/SelectionSummary";
import { FeatureExploration } from "@/components/features/FeatureExploration";
import { LoadingInterstitial } from "@/components/features/LoadingInterstitial";
import { ReportPage } from "@/components/report/ReportPage";
import { firmTypes, seniorityOptions, usageOptions } from "@/data/onboardingOptions";
import { fetchAllFeatures, getFeaturesForFirmType, Feature } from "@/data/features";
import { generateReport, ReportData } from "@/data/mockReport";

type Screen = "firmType" | "seniority" | "usage" | "features" | "loading" | "report";

const Index = () => {
  const {
    state,
    setFirmType,
    setSeniority,
    setUsage,
    setFeatureFeedback,
    clearFirmType,
    clearSeniority,
    clearUsage,
    clearAll,
  } = useOnboardingState();

  const [screen, setScreen] = useState<Screen>("firmType");
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [relevantFeatures, setRelevantFeatures] = useState<Feature[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);

  // Add dark class
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Load features from database
  useEffect(() => {
    fetchAllFeatures().then(setAllFeatures);
  }, []);

  // Compute relevant features when firm type changes
  useEffect(() => {
    if (state.firmType && allFeatures.length > 0) {
      setRelevantFeatures(getFeaturesForFirmType(state.firmType, allFeatures));
    }
  }, [state.firmType, allFeatures]);

  const handleFirmTypeSelect = (value: string) => {
    setFirmType(value);
    setTimeout(() => setScreen("seniority"), 300);
  };

  const handleSenioritySelect = (value: string) => {
    setSeniority(value);
    setTimeout(() => setScreen("usage"), 300);
  };

  const handleUsageSelect = (value: string) => {
    setUsage(value);
    setTimeout(() => setScreen("features"), 300);
  };

  const handleFeatureBack = () => {
    setScreen("usage");
  };

  const handleAllFeaturesReviewed = useCallback(() => {
    // Check if all relevant features have feedback
    const allReviewed = relevantFeatures.every(
      (f) => state.featureFeedback[f.id]
    );
    if (allReviewed && relevantFeatures.length > 0) {
      setScreen("loading");
    }
  }, [relevantFeatures, state.featureFeedback]);

  // Watch for all features reviewed
  useEffect(() => {
    if (screen === "features") {
      handleAllFeaturesReviewed();
    }
  }, [screen, state.featureFeedback, handleAllFeaturesReviewed]);

  const handleLoadingComplete = useCallback(() => {
    const reportData = generateReport(
      state.firmType,
      state.seniority,
      state.usage,
      state.featureFeedback,
      allFeatures
    );
    setReport(reportData);
    setScreen("report");
  }, [state, allFeatures]);

  const handleRestart = () => {
    clearAll();
    setReport(null);
    setScreen("firmType");
  };

  const totalOnboardingSteps = 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {screen === "firmType" && (
        <OnboardingStep
          title="What type of firm are you at?"
          currentStep={1}
          totalSteps={totalOnboardingSteps}
          options={firmTypes}
          selectedValue={state.firmType}
          onSelect={handleFirmTypeSelect}
          variant="card"
        />
      )}

      {screen === "seniority" && state.firmType && (
        <OnboardingStep
          title="What is your seniority level?"
          currentStep={2}
          totalSteps={totalOnboardingSteps}
          options={seniorityOptions[state.firmType] || []}
          selectedValue={state.seniority}
          onSelect={handleSenioritySelect}
          onBack={() => {
            clearFirmType();
            setScreen("firmType");
          }}
          variant="card"
        />
      )}

      {screen === "usage" && (
        <OnboardingStep
          title="How often do you use 9fin?"
          currentStep={3}
          totalSteps={totalOnboardingSteps}
          options={usageOptions}
          selectedValue={state.usage}
          onSelect={handleUsageSelect}
          onBack={() => {
            clearSeniority();
            setScreen("seniority");
          }}
          variant="card"
        />
      )}

      {screen === "features" && (
        <FeatureExploration
          features={relevantFeatures}
          featureFeedback={state.featureFeedback}
          onFeedback={setFeatureFeedback}
          onBack={handleFeatureBack}
        />
      )}

      {screen === "loading" && (
        <LoadingInterstitial onComplete={handleLoadingComplete} />
      )}

      {screen === "report" && report && (
        <ReportPage report={report} allFeatures={allFeatures} onBackToExplore={handleRestart} />
      )}

      {/* Selection summary pill */}
      {(screen === "firmType" || screen === "seniority" || screen === "usage") && (
        <SelectionSummary
          state={state}
          onClearFirmType={() => {
            clearFirmType();
            setScreen("firmType");
          }}
          onClearSeniority={() => {
            clearSeniority();
            setScreen("seniority");
          }}
          onClearUsage={() => {
            clearUsage();
            setScreen("usage");
          }}
          onClearAll={() => {
            clearAll();
            setScreen("firmType");
          }}
        />
      )}
    </div>
  );
};

export default Index;
