import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  className?: string;
  label?: boolean;
}

const FavoriteButton = ({ active, onToggle, className, label }: FavoriteButtonProps) => (
  <button
    type="button"
    aria-label={active ? "Remove from favourites" : "Save to favourites"}
    aria-pressed={active}
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-primary/40",
      active ? "text-destructive" : "text-muted-foreground",
      className
    )}
  >
    <Heart className={cn("w-4 h-4", active && "fill-destructive")} />
    {label && <span>{active ? "Saved" : "Save"}</span>}
  </button>
);

export default FavoriteButton;