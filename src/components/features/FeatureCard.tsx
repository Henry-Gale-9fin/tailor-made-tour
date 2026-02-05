import { Feature } from "@/data/features";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  feature: Feature;
  onFeedback: (feedback: "Used" | "Seen" | "Unknown") => void;
  onExplore: () => void;
}

export const FeatureCard = ({ feature, onFeedback, onExplore }: FeatureCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-video w-full bg-muted/50 rounded-t-lg overflow-hidden">
          <img
            src={feature.image}
            alt={feature.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{feature.name}</h2>
          <p className="text-muted-foreground mb-4">{feature.description}</p>
          <p className="text-sm text-primary mb-6">{feature.valueProp}</p>

          {/* Explore button */}
          <Button
            variant="outline"
            onClick={onExplore}
            className="w-full mb-6"
          >
            Explore
          </Button>

          {/* Feedback buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onFeedback("Used")}
            >
              Used
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onFeedback("Seen")}
            >
              Seen
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onFeedback("Unknown")}
            >
              Unknown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
