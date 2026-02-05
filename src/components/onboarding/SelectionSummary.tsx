import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingState } from "@/hooks/useOnboardingState";

interface SelectionSummaryProps {
  state: OnboardingState;
  onClearFirmType: () => void;
  onClearSeniority: () => void;
  onClearUsage: () => void;
  onClearAll: () => void;
}

export const SelectionSummary = ({
  state,
  onClearFirmType,
  onClearSeniority,
  onClearUsage,
  onClearAll,
}: SelectionSummaryProps) => {
  const hasSelections = state.firmType || state.seniority || state.usage;

  if (!hasSelections) return null;

  return (
    <div className="fixed bottom-6 left-6 p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex flex-col gap-2">
        {state.firmType && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Firm:</span>
            <span className="font-medium">{state.firmType}</span>
            <button
              onClick={onClearFirmType}
              className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {state.seniority && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Seniority:</span>
            <span className="font-medium">{state.seniority}</span>
            <button
              onClick={onClearSeniority}
              className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {state.usage && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Usage:</span>
            <span className="font-medium">{state.usage}</span>
            <button
              onClick={onClearUsage}
              className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
};
