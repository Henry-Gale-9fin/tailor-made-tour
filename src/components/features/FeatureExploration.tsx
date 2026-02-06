import { useState } from "react";
import { ArrowLeft, Check, Eye, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feature } from "@/data/features";
import { FeatureCard } from "./FeatureCard";

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

  const reviewedCount = Object.keys(featureFeedback).filter(id =>
    features.some(f => f.id === id)
  ).length;

  const currentFeature = features[currentIndex];

  const handleFeedback = (feedback: "Used" | "Seen" | "Unknown") => {
    onFeedback(currentFeature.id, feedback);
    
    // Move to next feature if not the last one
    // (auto-transition to loading is handled by parent when all features reviewed)
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
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

      {/* Feedback Buttons - Enhanced */}
      <div className="flex justify-center gap-4 mt-8 mb-4">
        <button
          onClick={() => handleFeedback("Used")}
          className="group flex flex-col items-center gap-2 px-8 py-4 rounded-xl 
                     border-2 border-success/30 bg-success/5 
                     hover:border-success hover:bg-success/10 hover:scale-105
                     active:scale-95 transition-all duration-200"
        >
          <Check className="w-6 h-6 text-success" />
          <span className="font-semibold text-success">Used</span>
        </button>
        
        <button
          onClick={() => handleFeedback("Seen")}
          className="group flex flex-col items-center gap-2 px-8 py-4 rounded-xl 
                     border-2 border-primary/30 bg-primary/5 
                     hover:border-primary hover:bg-primary/10 hover:scale-105
                     active:scale-95 transition-all duration-200"
        >
          <Eye className="w-6 h-6 text-primary" />
          <span className="font-semibold text-primary">Seen</span>
        </button>
        
        <button
          onClick={() => handleFeedback("Unknown")}
          className="group flex flex-col items-center gap-2 px-8 py-4 rounded-xl 
                     border-2 border-muted-foreground/30 bg-muted/20 
                     hover:border-muted-foreground hover:bg-muted/40 hover:scale-105
                     active:scale-95 transition-all duration-200"
        >
          <HelpCircle className="w-6 h-6 text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">Unknown</span>
        </button>
      </div>
    </div>
  );
};
