import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { SelectionChip } from "./SelectionChip";
import { LucideIcon } from "lucide-react";

interface OnboardingStepProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  options: { id: string; label: string; icon?: LucideIcon }[];
  selectedValue?: string | null;
  onSelect: (value: string) => void;
  onBack?: () => void;
  variant?: "default" | "card";
}

export const OnboardingStep = ({
  title,
  currentStep,
  totalSteps,
  options,
  selectedValue,
  onSelect,
  onBack,
  variant = "default",
}: OnboardingStepProps) => {
  return (
    <div className="relative w-full">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {/* Progress Indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Card Wrapper */}
      <div
        className={
          variant === "card"
            ? "relative mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
            : "relative mx-auto w-full max-w-4xl"
        }
      >
        {/* Subtle highlight overlay */}
        {variant === "card" && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />
        )}

        {/* Content */}
        <div className={variant === "card" ? "relative p-12" : "relative"}>
          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h1>

          {/* Options */}
          <div className="flex flex-wrap justify-center gap-4">
            {options.map((option) => (
              <SelectionChip
                key={option.id}
                label={option.label}
                icon={option.icon}
                selected={selectedValue === option.id || selectedValue === option.label}
                onClick={() => onSelect(option.label)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
