import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionScreenProps {
  onRestart: () => void;
}

export const CompletionScreen = ({ onRestart }: CompletionScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Thank you!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your preferences have been saved. We'll use this information to
          personalize your experience.
        </p>

        <Button onClick={onRestart} variant="outline" size="lg">
          Start Over
        </Button>
      </div>
    </div>
  );
};
