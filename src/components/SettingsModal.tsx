import { useState } from "react";
import { Key, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function SettingsModal({ open, onOpenChange, apiKey, onSaveApiKey }: SettingsModalProps) {
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onSaveApiKey(key);
    toast({
      title: "API Key Saved",
      description: "Your API key has been securely stored.",
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setKey("");
    onSaveApiKey("");
    toast({
      title: "API Key Removed",
      description: "Your API key has been cleared.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Configuration
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your API key to enable video analysis. Your key is stored locally and never shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="Enter your API key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="pr-20 bg-secondary/50 border-border/50 font-mono text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              {key && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={handleClear}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="glow" onClick={handleSave} disabled={!key.trim()}>
              Save Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
