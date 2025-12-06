import { Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export function Header({ onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">SafetyVision</h1>
            <p className="text-xs text-muted-foreground">Video Analytics Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-muted-foreground">
              {hasApiKey ? 'API Connected' : 'API Not Configured'}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={onOpenSettings}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
