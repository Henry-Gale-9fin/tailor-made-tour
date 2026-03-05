import { useEffect, useState, useCallback } from "react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { SelectionSummary } from "@/components/onboarding/SelectionSummary";
import { FeatureExploration } from "@/components/features/FeatureExploration";
import { LoadingInterstitial } from "@/components/features/LoadingInterstitial";
import { ReportPage } from "@/components/report/ReportPage";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { firmTypes, seniorityOptions, usageOptions } from "@/data/onboardingOptions";
import { fetchAllFeatures, getFeaturesForFirmType, Feature } from "@/data/features";
import { generateReport, ReportData } from "@/data/mockReport";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [relevantFeatures, setRelevantFeatures] = useState<Feature[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const reducedMotion = useReducedMotion();

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

  const goForward = (next: Screen) => {
    setDirection(1);
    setTimeout(() => setScreen(next), 0);
  };

  const goBack = (prev: Screen) => {
    setDirection(-1);
    setTimeout(() => setScreen(prev), 0);
  };

  const handleFirmTypeSelect = (value: string) => {
    setFirmType(value);
    setTimeout(() => goForward("seniority"), 300);
  };

  const handleSenioritySelect = (value: string) => {
    setSeniority(value);
    setTimeout(() => goForward("usage"), 300);
  };

  const handleUsageSelect = (value: string) => {
    setUsage(value);
    setTimeout(() => goForward("features"), 300);
  };

  const handleFeatureBack = () => {
    goBack("usage");
  };

  const handleAllFeaturesReviewed = useCallback(() => {
    const allReviewed = relevantFeatures.every(
      (f) => state.featureFeedback[f.id]
    );
    if (allReviewed && relevantFeatures.length > 0) {
      goForward("loading");
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
    setDirection(1);
    setScreen("report");
  }, [state, allFeatures]);

  const handleRestart = () => {
    clearAll();
    setReport(null);
    setDirection(-1);
    setScreen("firmType");
  };

  const totalOnboardingSteps = 3;

  const variants = {
    enter: (dir: number) => ({
      x: reducedMotion ? 0 : dir * 16,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: reducedMotion ? 0 : dir * -12,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.99,
    }),
  };

  // Determine which onboarding step we're on (for progress indicator)
  const isOnboarding = screen === "firmType" || screen === "seniority" || screen === "usage";
  const currentStepNum = screen === "firmType" ? 1 : screen === "seniority" ? 2 : 3;

  // Determine if back button should show and its handler
  const getBackHandler = () => {
    if (screen === "seniority") return () => { clearFirmType(); goBack("firmType"); };
    if (screen === "usage") return () => { clearSeniority(); goBack("seniority"); };
    if (screen === "features") return handleFeatureBack;
    return null;
  };
  const backHandler = getBackHandler();

  // Feature review count for progress display
  const reviewedCount = Object.keys(state.featureFeedback).filter(id =>
    relevantFeatures.some(f => f.id === id)
  ).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Brand header — fixed, centered, outside animated subtree */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none select-none">
        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground/70">
          9fin Platform Advantage
        </h1>
        <p className="text-[11px] tracking-wide text-muted-foreground/40 mt-0.5">
          Personalised workflow recommendations
        </p>
      </div>

      {/* Fixed chrome — OUTSIDE AnimatePresence, never inside a transform parent */}
      {backHandler && screen !== "loading" && screen !== "report" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={backHandler}
          className="fixed top-6 left-6 text-muted-foreground hover:text-foreground z-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {isOnboarding && (
        <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
          <span className="text-sm text-muted-foreground">
            Step {currentStepNum} of {totalOnboardingSteps}
          </span>
          <StepIndicator currentStep={currentStepNum} totalSteps={totalOnboardingSteps} />
        </div>
      )}

      {screen === "features" && (
        <div className="fixed top-6 right-6 text-sm text-muted-foreground z-50">
          {reviewedCount} of {relevantFeatures.length} features reviewed
        </div>
      )}

      {/* Animated content area */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={screen}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full flex flex-col items-center justify-center"
        >
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
        </motion.div>
      </AnimatePresence>

      {/* Selection summary pill — outside animation */}
      {isOnboarding && (
        <SelectionSummary
          state={state}
          onClearFirmType={() => {
            clearFirmType();
            goBack("firmType");
          }}
          onClearSeniority={() => {
            clearSeniority();
            goBack("seniority");
          }}
          onClearUsage={() => {
            clearUsage();
            goBack("usage");
          }}
          onClearAll={() => {
            clearAll();
            setDirection(-1);
            setScreen("firmType");
          }}
        />
      )}
    </div>
  );
};

export default Index;
