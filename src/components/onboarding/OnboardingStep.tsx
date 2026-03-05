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
  options,
  selectedValue,
  onSelect,
  variant = "default",
}: OnboardingStepProps) => {
  return (
    <div className="relative w-full pt-24 px-6">
      {/* Card Wrapper */}
      <div
        className={
          variant === "card"
            ? "relative mx-auto w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
            : "relative mx-auto w-fit max-w-[90vw]"
        }
      >
        {variant === "card" && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />
        )}

        <div className={variant === "card" ? "relative p-12" : "relative"}>
          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h1>

          {/* Options */}
          <div className="flex flex-nowrap justify-center gap-4">
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
