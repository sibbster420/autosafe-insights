import { useState, useCallback } from "react";
import { Upload, Film, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export function UploadZone({ onFilesSelect, selectedFiles, onRemoveFile }: UploadZoneProps) {
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
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/'));
    if (files.length > 0) {
      onFilesSelect(files);
    }
  }, [onFilesSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files));
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [onFilesSelect]);

  return (
    <div className="space-y-4">
      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="glass-card gradient-border p-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveFile(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          "glass-card gradient-border p-8 text-center transition-all duration-300 cursor-pointer group",
          isDragging && "border-primary bg-primary/5 scale-[1.02]",
          selectedFiles.length > 0 && "p-6"
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
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center transition-all duration-300",
            "group-hover:bg-primary/10 group-hover:scale-110",
            isDragging && "bg-primary/20 scale-110",
            selectedFiles.length > 0 && "w-10 h-10"
          )}>
            <Upload className={cn(
              "w-6 h-6 text-muted-foreground transition-colors",
              "group-hover:text-primary",
              isDragging && "text-primary",
              selectedFiles.length > 0 && "w-5 h-5"
            )} />
          </div>
          
          <div>
            <p className={cn("font-medium mb-1", selectedFiles.length > 0 ? "text-sm" : "text-lg")}>
              {selectedFiles.length > 0 ? "Add more videos" : "Drop your videos here"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFiles.length > 0 
                ? "Click or drop to add more files"
                : "or click to browse • MP4, MOV, AVI supported"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
