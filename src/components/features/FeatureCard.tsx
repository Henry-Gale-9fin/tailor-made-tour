import { Feature } from "@/data/features";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
        {/* Feature Title - Full Width */}
        <a
          href={feature.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold hover:text-primary transition-colors inline-flex items-center gap-2 group mb-5"
        >
          {feature.name}
          <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Two-Column Grid: 50/50 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Media */}
          <div className="flex flex-col">
            <div className="bg-muted/30 rounded-xl border border-border/30 overflow-hidden h-full">
              <div className="aspect-[4/3] w-full h-full">
                <img
                  src={feature.image}
                  alt={feature.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Value → Description → Use Case */}
          <div className="flex flex-col gap-4 md:pl-2 md:pr-2">
            {/* Primary Value Statement (TOP) */}
            <div className="bg-primary/10 rounded-lg p-5 border border-primary/20 order-3 md:order-none">
              <p className="text-primary text-base font-semibold leading-relaxed">
                {feature.valueProp}
              </p>
            </div>

            {/* Description Block */}
            <div className="bg-muted/20 rounded-lg p-5 border border-border/30 order-4 md:order-none">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Description
              </h4>
              <p className="text-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Use Case Block */}
            <div className="bg-muted/20 rounded-lg p-5 border border-border/30 order-5 md:order-none">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Use Case
              </h4>
              <p className="text-foreground text-sm leading-relaxed">
                {feature.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
