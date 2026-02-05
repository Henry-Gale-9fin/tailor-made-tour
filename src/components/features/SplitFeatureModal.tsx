import { Feature } from "@/data/features";
import { X, ExternalLink } from "lucide-react";

interface SplitFeatureModalProps {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
}

export const SplitFeatureModal = ({ feature, open, onClose }: SplitFeatureModalProps) => {
  if (!feature || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/75"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative z-10 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden mx-4"
        style={{ 
          width: 'min(960px, 90vw)',
          maxHeight: '80vh'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Two-Column Split Layout */}
        <div className="flex flex-col md:flex-row h-full">
          {/* LEFT COLUMN - Text (55%) */}
          <div 
            className="p-8 flex flex-col justify-center overflow-y-auto order-1"
            style={{ flex: '0 0 55%' }}
          >
            {/* Title as Link */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold mb-4 hover:text-primary transition-colors inline-flex items-center gap-2 group"
            >
              {feature.name}
              <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            
            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              {feature.description}
            </p>

            {/* Value to Customer */}
            <div className="border-t border-border/40 pt-5">
              <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Value to you
              </h4>
              <p className="text-foreground leading-relaxed">
                {feature.longDescription}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Media (45%) */}
          <div 
            className="bg-muted/30 order-2 min-h-[200px] md:min-h-0"
            style={{ flex: '0 0 45%' }}
          >
            <img
              src={feature.image}
              alt={feature.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
