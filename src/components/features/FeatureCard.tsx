import { Feature } from "@/data/features";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  feature: Feature;
  onOpenModal: () => void;
}

export const FeatureCard = ({ feature, onOpenModal }: FeatureCardProps) => {
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
          {/* Clickable Title */}
          <button
            onClick={onOpenModal}
            className="text-2xl font-bold mb-2 text-left hover:text-primary transition-colors cursor-pointer"
          >
            {feature.name}
          </button>
          <p className="text-muted-foreground mb-4">{feature.description}</p>
          <p className="text-sm text-primary">{feature.valueProp}</p>
        </div>
      </CardContent>
    </Card>
  );
};
