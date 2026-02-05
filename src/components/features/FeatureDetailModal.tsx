import { Feature } from "@/data/features";
import { X, ExternalLink } from "lucide-react";

interface FeatureDetailModalProps {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
}

export const FeatureDetailModal = ({ feature, open, onClose }: FeatureDetailModalProps) => {
  if (!feature || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative z-10 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden"
        style={{ 
          width: 'min(960px, 90vw)',
          maxHeight: '80vh'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 2-Column Grid: Text Left | Media Right */}
        <div 
          className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto"
          style={{ 
            maxHeight: '80vh',
            alignItems: 'start'
          }}
        >
          {/* LEFT COLUMN: Text Content */}
          <div className="flex flex-col order-1">
            {/* Clickable Title Link */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold mb-3 hover:text-primary transition-colors inline-flex items-center gap-2 group"
            >
              {feature.name}
              <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />
            </a>
            
            {/* Description */}
            <p className="text-muted-foreground mb-5 leading-relaxed">
              {feature.description}
            </p>

            {/* Value to Customer */}
            <div className="pt-4 border-t border-border/30">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-2">
                Value to you
              </h4>
              <p className="text-foreground leading-relaxed">
                {feature.longDescription}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Media */}
          <div className="order-2 md:order-2 bg-muted/20 rounded-lg overflow-hidden flex items-start justify-center">
            <img
              src={feature.image}
              alt={feature.name}
              className="w-full h-full object-cover"
              style={{ minHeight: '200px', maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
