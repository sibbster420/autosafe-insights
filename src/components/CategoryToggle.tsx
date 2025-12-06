import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryToggleProps {
  category: 'crash' | 'near-miss';
  onCategoryChange: (category: 'crash' | 'near-miss') => void;
}

export function CategoryToggle({ category, onCategoryChange }: CategoryToggleProps) {
  return (
    <div className="glass-card p-1.5 inline-flex gap-1">
      <button
        onClick={() => onCategoryChange('crash')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          category === 'crash' 
            ? "bg-crash text-crash-foreground shadow-lg shadow-crash/20" 
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
      >
        <AlertCircle className="w-4 h-4" />
        Crash
      </button>
      <button
        onClick={() => onCategoryChange('near-miss')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          category === 'near-miss' 
            ? "bg-warning text-warning-foreground shadow-lg shadow-warning/20" 
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
      >
        <AlertTriangle className="w-4 h-4" />
        Near Miss
      </button>
    </div>
  );
}
