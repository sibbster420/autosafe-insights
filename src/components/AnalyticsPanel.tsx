import { AlertTriangle, AlertCircle, Clock, Gauge, MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  category: 'crash' | 'near-miss';
  confidence: number;
  timestamp: string;
  speed: number;
  location: string;
  vehicleCount: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface AnalyticsPanelProps {
  isAnalyzing: boolean;
  data: AnalyticsData | null;
}

const placeholderData: AnalyticsData = {
  category: 'crash',
  confidence: 94.7,
  timestamp: '00:03:24',
  speed: 67,
  location: 'Highway I-95, Mile 142',
  vehicleCount: 3,
  severity: 'high',
  description: 'Rear-end collision detected. Three vehicles involved. Emergency response recommended.',
};

export function AnalyticsPanel({ isAnalyzing, data }: AnalyticsPanelProps) {
  const displayData = data || placeholderData;
  const isCrash = displayData.category === 'crash';

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
          <p className="font-medium">Analyzing Video</p>
          <p className="text-sm text-muted-foreground">Processing frames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card gradient-border p-6 space-y-6 animate-fade-in">
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <div className={cn(
          "px-4 py-2 rounded-lg flex items-center gap-2 font-medium",
          isCrash 
            ? "bg-crash/10 text-crash crash-glow" 
            : "bg-warning/10 text-warning near-miss-glow"
        )}>
          {isCrash ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span className="uppercase tracking-wider text-sm">
            {isCrash ? 'Crash Detected' : 'Near Miss'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono text-gradient">
            {displayData.confidence}%
          </p>
          <p className="text-xs text-muted-foreground">Confidence</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Timestamp"
          value={displayData.timestamp}
        />
        <StatCard
          icon={<Gauge className="w-4 h-4" />}
          label="Est. Speed"
          value={`${displayData.speed} mph`}
        />
        <StatCard
          icon={<MapPin className="w-4 h-4" />}
          label="Location"
          value={displayData.location}
          className="col-span-2"
        />
        <StatCard
          icon={<Car className="w-4 h-4" />}
          label="Vehicles"
          value={displayData.vehicleCount.toString()}
        />
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Severity</p>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              displayData.severity === 'high' && "bg-crash",
              displayData.severity === 'medium' && "bg-warning",
              displayData.severity === 'low' && "bg-success"
            )} />
            <span className="font-medium capitalize">{displayData.severity}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Analysis Summary</p>
        <p className="text-sm leading-relaxed">{displayData.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className={cn(
          "flex-1 py-2.5 rounded-lg font-medium text-sm transition-all",
          isCrash 
            ? "bg-crash/10 text-crash hover:bg-crash/20 border border-crash/20" 
            : "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20"
        )}>
          Export Report
        </button>
        <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-secondary hover:bg-secondary/80 transition-all">
          View Timeline
        </button>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  className 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-secondary/50 rounded-lg p-3", className)}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-medium font-mono">{value}</p>
    </div>
  );
}
