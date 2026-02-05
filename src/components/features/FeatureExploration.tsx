import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feature } from "@/data/features";
import { FeatureCard } from "./FeatureCard";
import { cn } from "@/lib/utils";

interface FeatureExplorationProps {
  features: Feature[];
  featureFeedback: Record<string, "Used" | "Seen" | "Unknown">;
  onFeedback: (featureId: string, feedback: "Used" | "Seen" | "Unknown") => void;
  onBack: () => void;
  onComplete: () => void;
}

export const FeatureExploration = ({
  features,
  featureFeedback,
  onFeedback,
  onBack,
  onComplete,
}: FeatureExplorationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviewedCount = Object.keys(featureFeedback).filter(id =>
    features.some(f => f.id === id)
  ).length;

  const currentFeature = features[currentIndex];

  const handleFeedback = (feedback: "Used" | "Seen" | "Unknown") => {
    onFeedback(currentFeature.id, feedback);
    
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const goToFeature = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative flex flex-col min-h-screen p-8">
      {/* Fixed Top-Left Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="fixed top-6 left-6 text-muted-foreground hover:text-foreground z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Fixed Top-Right Progress */}
      <div className="fixed top-6 right-6 text-sm text-muted-foreground z-10">
        {reviewedCount} of {features.length} features reviewed
      </div>

      {/* Title */}
      <div className="text-center mb-8 mt-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Features</h1>
        <p className="text-muted-foreground">
          Tell us which features you use, have seen, or unknown
        </p>
      </div>

      {/* Feature Card - Split Layout */}
      <div className="flex-1 flex items-center justify-center">
        <FeatureCard feature={currentFeature} />
      </div>

      {/* Used / Seen / Unknown Buttons - OUTSIDE the card, centered below */}
      <div className="flex justify-center gap-3 mt-8 mb-4">
        <Button
          variant="secondary"
          className="min-w-28"
          onClick={() => handleFeedback("Used")}
        >
          Used
        </Button>
        <Button
          variant="secondary"
          className="min-w-28"
          onClick={() => handleFeedback("Seen")}
        >
          Seen
        </Button>
        <Button
          variant="secondary"
          className="min-w-28"
          onClick={() => handleFeedback("Unknown")}
        >
          Unknown
        </Button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {features.map((feature, index) => {
          const hasFeedback = featureFeedback[feature.id];
          return (
            <button
              key={feature.id}
              onClick={() => goToFeature(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-8"
                  : hasFeedback
                  ? "bg-success"
                  : "bg-muted hover:bg-muted-foreground/50"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
