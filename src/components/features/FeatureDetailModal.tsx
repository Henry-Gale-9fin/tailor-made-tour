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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-card border border-border/50 rounded-lg shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Text Content */}
          <div className="p-6 flex flex-col justify-center">
            {/* Title as Link */}
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold mb-3 hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              {feature.name}
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <p className="text-muted-foreground text-sm mb-4">
              {feature.description}
            </p>

            <div className="border-t border-border/50 pt-4">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Value to you
              </h4>
              <p className="text-sm text-foreground">
                {feature.longDescription}
              </p>
            </div>
          </div>

          {/* RIGHT: Media */}
          <div className="bg-muted/30 flex items-center justify-center p-4">
            <img
              src={feature.image}
              alt={feature.name}
              className="w-full h-48 md:h-full max-h-64 object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
