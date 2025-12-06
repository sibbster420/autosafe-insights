import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SettingsModal } from "@/components/SettingsModal";
import { UploadZone } from "@/components/UploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { CategoryToggle } from "@/components/CategoryToggle";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, ArrowRight, Library } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [category, setCategory] = useState<'crash' | 'near-miss'>('crash');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('video-analytics-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('video-analytics-api-key', key);
    } else {
      localStorage.removeItem('video-analytics-api-key');
    }
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceedToAnalysis = () => {
    setShowAnalysis(true);
    setCurrentFileIndex(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setShowAnalysis(false);
  };

  const currentFile = selectedFiles[currentFileIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenSettings={() => setSettingsOpen(true)} hasApiKey={!!apiKey} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Upload Section */}
        {!showAnalysis && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Analyze <span className="text-gradient">Safety Incidents</span>
              </h2>
              <p className="text-muted-foreground">
                Upload dashcam or surveillance footage to detect crashes and near-miss events
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate("/library")}
                className="gap-2"
              >
                <Library className="w-4 h-4" />
                Browse Video Library
              </Button>
            </div>

            <UploadZone
              onFilesSelect={handleFilesSelect}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
            />
            
            {selectedFiles.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="glow" 
                  size="lg"
                  onClick={handleProceedToAnalysis}
                  className="gap-2"
                >
                  Proceed to Analysis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Analysis Section */}
        {showAnalysis && currentFile && (
          <div className="space-y-6 animate-fade-in">
            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <CategoryToggle category={category} onCategoryChange={setCategory} />
                {selectedFiles.length > 1 && (
                  <span className="text-sm text-muted-foreground">
                    Video {currentFileIndex + 1} of {selectedFiles.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {!isAnalyzing && !analysisComplete && (
                  <Button 
                    variant="glow" 
                    onClick={handleAnalyze}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Analysis
                  </Button>
                )}
                {analysisComplete && currentFileIndex < selectedFiles.length - 1 && (
                  <Button 
                    variant="default"
                    onClick={() => {
                      setCurrentFileIndex(prev => prev + 1);
                      setIsAnalyzing(false);
                      setAnalysisComplete(false);
                    }}
                    className="gap-2"
                  >
                    Next Video
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  New Upload
                </Button>
              </div>
            </div>

            {/* Video + Analytics Grid */}
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <VideoPlayer file={currentFile} />
              </div>
              <div className="lg:col-span-2">
                <AnalyticsPanel 
                  isAnalyzing={isAnalyzing}
                  data={analysisComplete ? {
                    category,
                    confidence: category === 'crash' ? 94.7 : 87.3,
                    timestamp: '00:03:24',
                    speed: category === 'crash' ? 67 : 45,
                    location: 'Highway I-95, Mile 142',
                    vehicleCount: category === 'crash' ? 3 : 2,
                    severity: category === 'crash' ? 'high' : 'medium',
                    description: category === 'crash' 
                      ? 'Rear-end collision detected. Three vehicles involved. Emergency response recommended.'
                      : 'Close call detected. Vehicle performed sudden lane change causing evasive maneuver by adjacent vehicle.',
                  } : null}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
};

export default Index;
