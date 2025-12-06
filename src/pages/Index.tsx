import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { CategoryToggle } from "@/components/CategoryToggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, ArrowRight, Library, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadVideo, summarizeVideo } from "@/services/vssApi";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [category, setCategory] = useState<'crash' | 'near-miss'>('crash');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [captionSummarizationPrompt, setCaptionSummarizationPrompt] = useState("");
  const [summaryAggregationPrompt, setSummaryAggregationPrompt] = useState("");
  const [fileId, setFileId] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceedToAnalysis = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      const file = selectedFiles[currentFileIndex];
      const response = await uploadVideo(file);
      setFileId(response.file_id);
      setShowAnalysis(true);
      setCurrentFileIndex(0);
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      setSummaryResult(null);
      toast.success(`Video uploaded successfully: ${response.file_id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!fileId) {
      toast.error('No video uploaded. Please upload a video first.');
      return;
    }

    setIsAnalyzing(true);
    setSummaryResult(null);
    
    try {
      const response = await summarizeVideo(fileId, {
        prompt: prompt || undefined,
        captionSummarizationPrompt: captionSummarizationPrompt || undefined,
        summaryAggregationPrompt: summaryAggregationPrompt || undefined,
      });
      setSummaryResult(response.summary);
      setAnalysisComplete(true);
      toast.success('Video summarization complete');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to summarize video');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setShowAnalysis(false);
    setFileId(null);
    setSummaryResult(null);
  };

  const currentFile = selectedFiles[currentFileIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Proceed to Analysis
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
                {fileId && (
                  <span className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded">
                    ID: {fileId}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {!isAnalyzing && !analysisComplete && (
                  <Button 
                    variant="glow" 
                    onClick={handleSummarize}
                    disabled={!fileId}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Summarize
                  </Button>
                )}
                {analysisComplete && currentFileIndex < selectedFiles.length - 1 && (
                  <Button 
                    variant="default"
                    onClick={() => {
                      setCurrentFileIndex(prev => prev + 1);
                      setIsAnalyzing(false);
                      setAnalysisComplete(false);
                      setSummaryResult(null);
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

            {/* Prompt Text Boxes */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium text-foreground">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your analysis prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] bg-card/50 border-border/50 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captionSummarizationPrompt" className="text-sm font-medium text-foreground">
                  Caption Summarization Prompt
                </Label>
                <Textarea
                  id="captionSummarizationPrompt"
                  placeholder="Enter caption summarization prompt..."
                  value={captionSummarizationPrompt}
                  onChange={(e) => setCaptionSummarizationPrompt(e.target.value)}
                  className="min-h-[100px] bg-card/50 border-border/50 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summaryAggregationPrompt" className="text-sm font-medium text-foreground">
                  Summary Aggregation Prompt
                </Label>
                <Textarea
                  id="summaryAggregationPrompt"
                  placeholder="Enter summary aggregation prompt..."
                  value={summaryAggregationPrompt}
                  onChange={(e) => setSummaryAggregationPrompt(e.target.value)}
                  className="min-h-[100px] bg-card/50 border-border/50 resize-none"
                />
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
                  summary={summaryResult}
                />
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default Index;
