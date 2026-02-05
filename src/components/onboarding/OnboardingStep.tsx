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
}

export const OnboardingStep = ({
  title,
  currentStep,
  totalSteps,
  options,
  selectedValue,
  onSelect,
  onBack,
}: OnboardingStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {onBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>

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
  );
};
