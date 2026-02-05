import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            index + 1 === currentStep
              ? "bg-primary w-6"
              : index + 1 < currentStep
              ? "bg-primary"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};
