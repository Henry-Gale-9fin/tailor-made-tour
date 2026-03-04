import { Feature } from "@/data/features";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <Card 
      className="w-full max-w-6xl mx-auto border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden"
      style={{ maxHeight: '80vh' }}
    >
      <div className="p-6">
        {/* Feature Title + Badges */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{feature.name}</h2>
            <Badge variant="secondary" className="text-xs">{feature.category}</Badge>
            {feature.status === "Beta" && (
              <Badge className="text-xs bg-primary/20 text-primary border-primary/30">Beta</Badge>
            )}
          </div>
          {feature.url && (
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Media */}
          <div className="flex flex-col">
            <div className="bg-muted/30 rounded-xl border border-border/30 overflow-hidden h-full">
              <div className="aspect-[4/3] w-full h-full">
                <img
                  src={feature.image_url || "/placeholder.svg"}
                  alt={feature.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Description + Use Case */}
          <div className="flex flex-col gap-4 md:pl-2 md:pr-2">
            {/* Description */}
            <div className="bg-primary/10 rounded-lg p-5 border border-primary/20">
              <p className="text-primary text-base font-semibold leading-relaxed line-clamp-3">
                {feature.description}
              </p>
            </div>

            {/* Use Case */}
            <div className="bg-muted/20 rounded-lg p-5 border border-border/30">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Use Case
              </h4>
              <p className="text-foreground text-sm leading-relaxed line-clamp-4">
                {feature.use_case}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
