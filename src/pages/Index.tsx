import { useState, useEffect, useMemo } from "react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { SelectionSummary } from "@/components/onboarding/SelectionSummary";
import { FeatureExploration } from "@/components/features/FeatureExploration";
import { LoadingInterstitial } from "@/components/features/LoadingInterstitial";
import { ReportPage } from "@/components/report/ReportPage";
import { CompletionScreen } from "@/components/features/CompletionScreen";
import { firmTypes, seniorityOptions, usageOptions } from "@/data/onboardingOptions";
import { getFeaturesForFirmType, fetchAllFeatures, Feature } from "@/data/features";
import { generateReport } from "@/data/mockReport";

type Step = "firm" | "seniority" | "usage" | "features" | "loading" | "report" | "complete";

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

  const [currentStep, setCurrentStep] = useState<Step>("firm");
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

  // Load features from DB
  useEffect(() => {
    fetchAllFeatures().then(setAllFeatures);
  }, []);

  const features = state.firmType ? getFeaturesForFirmType(state.firmType, allFeatures) : [];

  // Check if all features have been reviewed
  const allFeaturesReviewed = useMemo(() => {
    if (features.length === 0) return false;
    return features.every((f) => state.featureFeedback[f.id]);
  }, [features, state.featureFeedback]);

  // Determine current step based on state
  useEffect(() => {
    if (!state.firmType) {
      setCurrentStep("firm");
    } else if (!state.seniority) {
      setCurrentStep("seniority");
    } else if (!state.usage) {
      setCurrentStep("usage");
    } else if (currentStep !== "loading" && currentStep !== "report" && currentStep !== "complete") {
      setCurrentStep("features");
    }
  }, [state.firmType, state.seniority, state.usage]);

  const handleFirmTypeSelect = (value: string) => {
    setFirmType(value);
  };

  const handleSenioritySelect = (value: string) => {
    setSeniority(value);
  };

  const handleUsageSelect = (value: string) => {
    setUsage(value);
  };

  // Auto-transition to loading when all features reviewed
  const handleFeatureFeedback = (featureId: string, feedback: "Used" | "Seen" | "Unknown") => {
    setFeatureFeedback(featureId, feedback);

    const updatedFeedback = { ...state.featureFeedback, [featureId]: feedback };
    const allReviewed = features.every((f) => updatedFeedback[f.id]);

    if (allReviewed) {
      localStorage.setItem("feature_review_completed_at", new Date().toISOString());
      setCurrentStep("loading");
    }
  };

  const handleLoadingComplete = () => {
    setCurrentStep("report");
  };

  const handleBackToExplore = () => {
    setCurrentStep("features");
  };

  const handleRestart = () => {
    clearAll();
    setCurrentStep("firm");
  };

  // Generate report data
  const report = useMemo(() => {
    return generateReport(state.firmType, state.seniority, state.usage, state.featureFeedback, allFeatures);
  }, [state.firmType, state.seniority, state.usage, state.featureFeedback, allFeatures]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      {currentStep === "firm" && (
        <OnboardingStep
          title="What type of firm do you work for?"
          currentStep={1}
          totalSteps={3}
          options={firmTypes}
          selectedValue={state.firmType}
          onSelect={handleFirmTypeSelect}
        />
      )}

      {currentStep === "seniority" && state.firmType && (
        <OnboardingStep
          title="What seniority are you?"
          currentStep={2}
          totalSteps={3}
          options={seniorityOptions[state.firmType] || []}
          selectedValue={state.seniority}
          onSelect={handleSenioritySelect}
          onBack={() => clearFirmType()}
        />
      )}

      {currentStep === "usage" && (
        <OnboardingStep
          title="How often do you use the platform?"
          currentStep={3}
          totalSteps={3}
          options={usageOptions}
          selectedValue={state.usage}
          onSelect={handleUsageSelect}
          onBack={() => clearSeniority()}
        />
      )}

      {currentStep === "features" && (
        <FeatureExploration
          features={features}
          featureFeedback={state.featureFeedback}
          onFeedback={handleFeatureFeedback}
          onBack={() => clearUsage()}
        />
      )}

      {currentStep === "loading" && <LoadingInterstitial onComplete={handleLoadingComplete} />}

      {currentStep === "report" && <ReportPage report={report} onBackToExplore={handleBackToExplore} />}

      {currentStep === "complete" && <CompletionScreen onRestart={handleRestart} />}

      {currentStep !== "complete" &&
        currentStep !== "features" &&
        currentStep !== "loading" &&
        currentStep !== "report" && (
          <SelectionSummary
            state={state}
            onClearFirmType={clearFirmType}
            onClearSeniority={clearSeniority}
            onClearUsage={clearUsage}
            onClearAll={clearAll}
          />
        )}
    </div>
  );
};

export default Index;
