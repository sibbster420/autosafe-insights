import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AnalyticsPanelProps {
  isAnalyzing: boolean;
  summary: string | null;
}

export function AnalyticsPanel({ isAnalyzing, summary }: AnalyticsPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="glass-card gradient-border p-6 h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-medium">Summarizing Video</p>
          <p className="text-sm text-muted-foreground">Processing with VSS model...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="glass-card gradient-border p-6 h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
        <FileText className="w-12 h-12 text-muted-foreground/50" />
        <div className="text-center">
          <p className="font-medium text-muted-foreground">No Summary Yet</p>
          <p className="text-sm text-muted-foreground/70">
            Configure your prompts and click "Summarize" to analyze the video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card gradient-border p-6 space-y-4 animate-fade-in h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Video Summary</h3>
      </div>

      {/* Summary Content */}
      <div className="bg-secondary/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button 
          onClick={() => navigator.clipboard.writeText(summary)}
          className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
        >
          Copy Summary
        </button>
        <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-secondary hover:bg-secondary/80 transition-all">
          Export Report
        </button>
      </div>
    </div>
  );
}
