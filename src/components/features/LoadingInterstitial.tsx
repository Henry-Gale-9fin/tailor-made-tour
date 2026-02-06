import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingInterstitialProps {
  onComplete: () => void;
}

const checklistItems = [
  "Building your role-specific report…",
  "Assessing your workflow maturity…",
  "Identifying strengths and blind spots…",
  "Selecting your top recommendations…",
];

export const LoadingInterstitial = ({ onComplete }: LoadingInterstitialProps) => {
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const itemDuration = 500; // Time per item
    const totalDuration = checklistItems.length * itemDuration + 300;

    // Animate through checklist items
    const intervals: NodeJS.Timeout[] = [];
    
    checklistItems.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCompletedItems(prev => [...prev, index]);
        setCurrentItem(index + 1);
      }, (index + 1) * itemDuration);
      intervals.push(timeout);
    });

    // Navigate to report after animation completes
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md">
        {/* Loading spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-8">
          Preparing Your Report
        </h2>

        {/* Animated checklist */}
        <div className="space-y-4">
          {checklistItems.map((item, index) => {
            const isCompleted = completedItems.includes(index);
            const isCurrent = currentItem === index;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
                  isCompleted
                    ? "bg-success/10 border-success/30"
                    : isCurrent
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/20 border-border/30 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary/30"
                      : "bg-muted/30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isCompleted
                      ? "text-success"
                      : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
