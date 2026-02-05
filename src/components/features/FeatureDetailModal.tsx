import { Feature } from "@/data/features";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeatureDetailModalProps {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
}

export const FeatureDetailModal = ({ feature, open, onClose }: FeatureDetailModalProps) => {
  if (!feature) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border/50">
        {/* Hero Image */}
        <div className="aspect-video w-full bg-muted/50">
          <img
            src={feature.image}
            alt={feature.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{feature.name}</DialogTitle>
          </DialogHeader>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            {feature.longDescription}
          </p>

          <Button className="w-full mt-6" size="lg">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
