import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SelectionChipProps {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  onClick: () => void;
}

export const SelectionChip = ({ label, icon: Icon, selected, onClick }: SelectionChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        selected
          ? "border-primary bg-primary/10 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          : "border-border/50 bg-card/50 text-foreground"
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </button>
  );
};
