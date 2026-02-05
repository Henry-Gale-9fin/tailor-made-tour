import { useState, useEffect } from "react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { SelectionSummary } from "@/components/onboarding/SelectionSummary";
import { FeatureExploration } from "@/components/features/FeatureExploration";
import { CompletionScreen } from "@/components/features/CompletionScreen";
import { firmTypes, seniorityOptions, usageOptions } from "@/data/onboardingOptions";
import { getFeaturesForFirmType } from "@/data/features";

type Step = "firm" | "seniority" | "usage" | "features" | "complete";

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

  // Determine current step based on state
  useEffect(() => {
    if (!state.firmType) {
      setCurrentStep("firm");
    } else if (!state.seniority) {
      setCurrentStep("seniority");
    } else if (!state.usage) {
      setCurrentStep("usage");
    } else {
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

  const handleFeatureComplete = () => {
    setCurrentStep("complete");
  };

  const handleRestart = () => {
    clearAll();
    setCurrentStep("firm");
  };

  const features = state.firmType ? getFeaturesForFirmType(state.firmType) : [];

  return (
    <div className="min-h-screen bg-background text-foreground dark">
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
          onFeedback={setFeatureFeedback}
          onBack={() => clearUsage()}
          onComplete={handleFeatureComplete}
        />
      )}

      {currentStep === "complete" && (
        <CompletionScreen onRestart={handleRestart} />
      )}

      {/* Selection Summary Panel */}
      {currentStep !== "complete" && (
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
