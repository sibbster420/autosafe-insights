import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Play, AlertTriangle, ShieldAlert, BarChart3 } from "lucide-react";

interface VideoFile {
  id: string;
  name: string;
  category: "crash" | "near-miss";
  duration: string;
  date: string;
  thumbnail: string;
}

const generateMockVideos = (): VideoFile[] => {
  const videos: VideoFile[] = [];
  const locations = ["Highway 101", "Downtown", "Intersection A", "Parking Lot B", "School Zone", "Industrial Area", "Residential St", "Bridge Exit"];
  const vehicles = ["Sedan", "SUV", "Truck", "Van", "Motorcycle", "Bus"];
  
  for (let i = 1; i <= 200; i++) {
    const isCrash = i <= 87; // 87 crashes, 113 near misses
    const location = locations[Math.floor(Math.random() * locations.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    
    videos.push({
      id: `video-${i}`,
      name: `${location} - ${vehicle} ${isCrash ? 'Collision' : 'Close Call'} #${i}`,
      category: isCrash ? "crash" : "near-miss",
      duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      date: `2024-${month}-${day}`,
      thumbnail: isCrash 
        ? `https://loremflickr.com/320/180/car,crash?lock=${i}` 
        : `https://loremflickr.com/320/180/car,traffic?lock=${i}`,
    });
  }
  
  return videos.sort((a, b) => a.category.localeCompare(b.category));
};

const mockVideos = generateMockVideos();

const VideoLibrary = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "crash" | "near-miss">("all");
  
  const filteredVideos = filter === "all" 
    ? mockVideos 
    : mockVideos.filter(v => v.category === filter);
  
  const crashCount = mockVideos.filter(v => v.category === "crash").length;
  const nearMissCount = mockVideos.filter(v => v.category === "near-miss").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Video Library</h1>
                <p className="text-sm text-muted-foreground">200 analyzed incidents</p>
              </div>
            </div>
            
            <Button 
              variant="glow" 
              className="gap-2"
              onClick={() => navigate("/behavior-analytics")}
            >
              <BarChart3 className="w-4 h-4" />
              Analyze Behavior
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats & Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === "all" 
                ? "bg-primary/20 border-primary text-primary" 
                : "border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            All Videos ({mockVideos.length})
          </button>
          <button
            onClick={() => setFilter("crash")}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              filter === "crash" 
                ? "bg-destructive/20 border-destructive text-destructive" 
                : "border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Crashes ({crashCount})
          </button>
          <button
            onClick={() => setFilter("near-miss")}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              filter === "near-miss" 
                ? "bg-warning/20 border-warning text-warning" 
                : "border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Near Misses ({nearMissCount})
          </button>
        </div>

        {/* Video Grid */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id}
                className="group overflow-hidden bg-card/50 border-border/50 hover:border-border transition-all cursor-pointer"
              >
                <div className="relative aspect-video bg-muted">
                  <img 
                    src={video.thumbnail} 
                    alt={video.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                      <Play className="w-5 h-5 text-foreground ml-0.5" />
                    </div>
                  </div>
                  <Badge 
                    className={`absolute top-2 left-2 ${
                      video.category === "crash" 
                        ? "bg-destructive/90 text-destructive-foreground" 
                        : "bg-warning/90 text-warning-foreground"
                    }`}
                  >
                    {video.category === "crash" ? "Crash" : "Near Miss"}
                  </Badge>
                  <span className="absolute bottom-2 right-2 text-xs bg-background/80 px-2 py-1 rounded text-foreground">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate">{video.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{video.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default VideoLibrary;
