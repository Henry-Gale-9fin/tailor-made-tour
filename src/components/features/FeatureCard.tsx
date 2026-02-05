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
      style={{ maxHeight: '70vh' }}
    >
      {/* Two-Column Split Layout: 55% left / 45% right */}
      <div className="flex flex-col md:flex-row p-6 gap-6">
        
        {/* LEFT COLUMN: Two Stacked Text Blocks */}
        <div className="flex flex-col gap-4 order-1" style={{ flex: '0 0 55%' }}>
          
          {/* Top Block: Title + Description */}
          <div className="bg-muted/30 rounded-lg p-5 border border-border/30">
            {/* Clickable Title Link */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold mb-2 hover:text-primary transition-colors inline-flex items-center gap-2 group"
            >
              {feature.name}
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            
            {/* Short Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Bottom Block: Value to Customer */}
          <div className="bg-muted/20 rounded-lg p-5 border border-border/30">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Value to you
            </h4>
            <p className="text-foreground text-sm leading-relaxed">
              {feature.valueProp}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Contained Feature Visual Tile */}
        <div 
          className="order-2 flex items-center justify-center p-4"
          style={{ flex: '0 0 45%' }}
        >
          {/* Preview Tile with fixed aspect ratio */}
          <div className="w-full bg-muted/30 rounded-xl border border-border/30 overflow-hidden">
            <div className="aspect-video w-full">
              <img
                src={feature.image}
                alt={feature.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
