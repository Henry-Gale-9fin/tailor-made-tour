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

  const shuffleVariants = {
    enter: {
      x: reducedMotion ? 0 : 120,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.97,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      x: reducedMotion ? 0 : -120,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.97,
    },
  };

  return (
    <div className="h-screen overflow-hidden relative px-6">
      <div className="h-full flex flex-col items-center justify-center pt-16 pb-6">
        {/* Page title — stationary */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Explore Features</h1>

        <div className="w-full max-w-5xl">
          {/* Animated glass panel + card as one unit */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={shuffleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />

                <div className="relative p-6 md:p-10" style={{ minHeight: '380px' }}>
                  {/* Radial glow */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-[60%] h-[70%] rounded-full bg-primary/6 blur-3xl" />
                  </div>
                  <div className="relative w-full">
                    <FeatureCard feature={currentFeature} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex justify-center mt-5 mb-4">
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          {/* Controls — stationary */}
          <div className="text-center">
            <p className="text-foreground/70 text-sm font-medium mb-4">
              How familiar are you with this feature?
            </p>
            <div className="flex justify-center gap-4">
              {([
                { label: "Never", feedback: "Unknown" as const },
                { label: "Tried", feedback: "Seen" as const },
                { label: "Use", feedback: "Used" as const },
              ]).map(({ label, feedback }) => (
                <button
                  key={feedback}
                  onClick={() => handleFeedback(feedback)}
                  className="w-32 py-3.5 rounded-2xl font-semibold text-sm tracking-wide
                             border border-white/15 bg-white/10 backdrop-blur-md text-foreground/90
                             hover:bg-white/20 hover:border-white/30 hover:text-foreground hover:scale-105
                             active:scale-95 transition-all duration-200"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
