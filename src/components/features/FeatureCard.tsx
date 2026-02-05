import { Feature } from "@/data/features";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Two-Column Split Layout */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT COLUMN: Text Content (order-1 on all screens) */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center order-1">
          {/* Clickable Title Link */}
          <a
            href={feature.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold mb-3 hover:text-primary transition-colors inline-flex items-center gap-2 group"
          >
            {feature.name}
            <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
          
          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {feature.description}
          </p>

          {/* Value to Customer */}
          <div className="border-t border-border/30 pt-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
              Value to you
            </h4>
            <p className="text-primary text-sm">
              {feature.valueProp}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Media (order-2 on all screens) */}
        <div className="md:flex-1 order-2 bg-muted/30 min-h-[200px] md:min-h-[280px] flex items-center justify-center">
          <img
            src={feature.image}
            alt={feature.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
};
