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
      
      {/* Centered Dialog Modal */}
      <div className="relative z-10 w-full max-w-xl bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Two-Column Layout: Text Left | Media Right */}
        <div className="grid grid-cols-2 min-h-[280px]">
          {/* LEFT COLUMN: Text Content */}
          <div className="p-5 flex flex-col justify-center border-r border-border/30">
            {/* Clickable Title Link */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold mb-2 hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
            >
              {feature.name}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {feature.description}
            </p>

            {/* Value to Customer */}
            <div className="pt-3 border-t border-border/30">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-1.5">
                Value to you
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {feature.valueProp}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Media */}
          <div className="bg-muted/20 flex items-center justify-center p-4">
            <img
              src={feature.image}
              alt={feature.name}
              className="w-full h-auto max-h-[220px] object-contain rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
