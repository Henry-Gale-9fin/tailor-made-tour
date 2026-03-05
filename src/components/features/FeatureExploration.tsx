import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onBack,
}: FeatureExplorationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const reviewedCount = Object.keys(featureFeedback).filter(id =>
    features.some(f => f.id === id)
  ).length;

  const currentFeature = features[currentIndex];

  if (!currentFeature) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
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
      y: reducedMotion ? 0 : 12,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.98,
    },
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      y: reducedMotion ? 0 : -8,
      opacity: 0,
      scale: 1,
    },
  };

  return (
    <div className="h-screen overflow-hidden relative px-6">
      {/* Fixed Top-Left Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="fixed top-6 left-6 text-muted-foreground hover:text-foreground z-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Fixed Top-Right Progress */}
      <div className="fixed top-6 right-6 text-sm text-muted-foreground z-50">
        {reviewedCount} of {features.length} features reviewed
      </div>

      {/* Centered glass panel — static shell */}
      <div className="h-full flex items-center justify-center pt-16 pb-6">
        <div className="w-full max-w-5xl">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />

            <div className="relative p-6 md:p-10">
              {/* Title — static, outside animation */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Features</h1>
                <p className="text-muted-foreground">
                  Which features have you used, seen, or are unknown to you?
                </p>
              </div>

              {/* Stable height container to prevent layout shift */}
              <div className="min-h-[420px] flex flex-col">
                {/* Animated Feature Card + Buttons */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature.id}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex-1 flex flex-col"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Feature Card */}
                    <div className="flex justify-center px-4">
                      <FeatureCard feature={currentFeature} />
                    </div>

                    {/* Feedback Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={() => handleFeedback("Used")}
                        className="w-32 py-4 rounded-xl font-semibold
                                   border-2 border-success/30 bg-success/5 text-success
                                   hover:border-success hover:bg-success/10 hover:scale-105
                                   active:scale-95 transition-all duration-200"
                      >
                        Used
                      </button>

                      <button
                        onClick={() => handleFeedback("Seen")}
                        className="w-32 py-4 rounded-xl font-semibold
                                   border-2 border-primary/30 bg-primary/5 text-primary
                                   hover:border-primary hover:bg-primary/10 hover:scale-105
                                   active:scale-95 transition-all duration-200"
                      >
                        Seen
                      </button>

                      <button
                        onClick={() => handleFeedback("Unknown")}
                        className="w-32 py-4 rounded-xl font-semibold
                                   border-2 border-muted-foreground/30 bg-muted/20 text-muted-foreground
                                   hover:border-muted-foreground hover:bg-muted/40 hover:scale-105
                                   active:scale-95 transition-all duration-200"
                      >
                        Unknown
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
