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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={screen}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              onBack={() => {
                clearFirmType();
                goBack("firmType");
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
                goBack("seniority");
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
        </motion.div>
      </AnimatePresence>

      {/* Selection summary pill — outside animation */}
      {(screen === "firmType" || screen === "seniority" || screen === "usage") && (
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
