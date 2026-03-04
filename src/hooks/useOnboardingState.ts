import { useState, useCallback } from "react";

export interface OnboardingState {
  firmType: string | null;
  seniority: string | null;
  usage: string | null;
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">;
}

export const useOnboardingState = () => {
  const [state, setState] = useState<OnboardingState>({
    firmType: null,
    seniority: null,
    usage: null,
    featureFeedback: {},
  });

  const setFirmType = useCallback((firmType: string) => {
    setState(prev => ({ ...prev, firmType, seniority: null }));
  }, []);

  const setSeniority = useCallback((seniority: string) => {
    setState(prev => ({ ...prev, seniority }));
  }, []);

  const setUsage = useCallback((usage: string) => {
    setState(prev => ({ ...prev, usage }));
  }, []);

  const setFeatureFeedback = useCallback((featureId: string, feedback: "Used" | "Seen" | "Unknown") => {
    setState(prev => ({
      ...prev,
      featureFeedback: { ...prev.featureFeedback, [featureId]: feedback },
    }));
  }, []);

  const clearFirmType = useCallback(() => {
    setState(prev => ({ ...prev, firmType: null, seniority: null }));
  }, []);

  const clearSeniority = useCallback(() => {
    setState(prev => ({ ...prev, seniority: null }));
  }, []);

  const clearUsage = useCallback(() => {
    setState(prev => ({ ...prev, usage: null }));
  }, []);

  const clearAll = useCallback(() => {
    setState({
      firmType: null,
      seniority: null,
      usage: null,
      featureFeedback: {},
    });
  }, []);

  return {
    state,
    setFirmType,
    setSeniority,
    setUsage,
    setFeatureFeedback,
    clearFirmType,
    clearSeniority,
    clearUsage,
    clearAll,
  };
};
