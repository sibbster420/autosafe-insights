import { useState, useCallback } from "react";
import { Upload, Film, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export function UploadZone({ onFileSelect, selectedFile, onClearFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  if (selectedFile) {
    return (
      <div className="glass-card gradient-border p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClearFile}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-card gradient-border p-12 text-center transition-all duration-300 cursor-pointer group",
        isDragging && "border-primary bg-primary/5 scale-[1.02]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('video-upload')?.click()}
    >
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center transition-all duration-300",
          "group-hover:bg-primary/10 group-hover:scale-110",
          isDragging && "bg-primary/20 scale-110"
        )}>
          <Upload className={cn(
            "w-8 h-8 text-muted-foreground transition-colors",
            "group-hover:text-primary",
            isDragging && "text-primary"
          )} />
        </div>
        
        <div>
          <p className="text-lg font-medium mb-1">
            Drop your video here
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse • MP4, MOV, AVI supported
          </p>
        </div>
      </div>
    </div>
  );
}
