import { useState } from "react";
import { Feature } from "@/data/features";
import { FeatureCard } from "./FeatureCard";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface FeatureExplorationProps {
  features: Feature[];
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">;
  onFeedback: (featureId: string, feedback: "Used" | "Seen" | "Unknown") => void;
  onBack: () => void;
}

export const FeatureExploration = ({
  features,
  featureFeedback,
  onFeedback,
}: FeatureExplorationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const currentFeature = features[currentIndex];

  if (!currentFeature) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading features...
      </div>
    );
  }

  const handleFeedback = (feedback: "Used" | "Seen" | "Unknown") => {
    onFeedback(currentFeature.id, feedback);
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const cardVariants = {
    enter: {
      x: reducedMotion ? 0 : 16,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.99,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      x: reducedMotion ? 0 : -12,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.99,
    },
  };

  return (
    <div className="h-screen overflow-hidden relative px-6">
      {/* Centered glass panel */}
      <div className="h-full flex items-center justify-center pt-16 pb-6">
        <div className="w-full max-w-5xl">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />

            <div className="relative p-6 md:p-10">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Features</h1>
                <p className="text-muted-foreground">
                  Which features have you used, seen, or are unknown to you?
                </p>
              </div>

              {/* Animated Feature Card + Buttons */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Feature Card */}
                  <div className="flex justify-center px-4">
                    <FeatureCard feature={currentFeature} />
                  </div>

                  {/* Feedback Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    {([
                      { label: "Never", feedback: "Unknown" as const },
                      { label: "Tried", feedback: "Seen" as const },
                      { label: "Use", feedback: "Used" as const },
                    ]).map(({ label, feedback }) => (
                      <button
                        key={feedback}
                        onClick={() => handleFeedback(feedback)}
                        className="w-32 py-4 rounded-2xl font-semibold text-sm tracking-wide
                                   border border-white/10 bg-white/5 backdrop-blur-md text-foreground/80
                                   hover:bg-white/10 hover:border-white/20 hover:text-foreground hover:scale-105
                                   active:scale-95 transition-all duration-200"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
