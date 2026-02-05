import { Feature } from "@/data/features";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <Card 
      className="w-full max-w-4xl mx-auto border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden"
      style={{ maxHeight: '75vh' }}
    >
      <div className="p-6">
        {/* Two-Column Grid: 45% left / 55% right */}
        <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-6">
          
          {/* LEFT COLUMN: Feature Identity + Media */}
          <div className="flex flex-col gap-4">
            {/* Feature Title (order-1 on mobile) */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold hover:text-primary transition-colors inline-flex items-center gap-2 group order-1"
            >
              {feature.name}
              <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            
            {/* Feature Media Tile (order-2 on mobile) */}
            <div className="bg-muted/30 rounded-xl border border-border/30 overflow-hidden order-2">
              <div className="aspect-[4/3] w-full">
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
