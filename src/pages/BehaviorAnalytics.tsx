import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Clock, Shield, AlertTriangle, Target, Zap } from "lucide-react";

const insights = [
  {
    icon: Clock,
    title: "Reaction Time Impact",
    value: "0.7s",
    description: "The video analysis shows that a reaction time of <0.7 seconds gives a 40% higher chance of successful accident avoidance.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Speed Correlation",
    value: "35 mph",
    description: "Incidents occurring at speeds above 35 mph show a 2.3x increase in severity. Reducing approach speed in high-risk zones decreases collision probability by 58%.",
    color: "warning",
  },
  {
    icon: Shield,
    title: "Defensive Driving",
    value: "67%",
    description: "Drivers maintaining a 3-second following distance successfully avoided potential collisions in 67% of near-miss scenarios analyzed.",
    color: "success",
  },
  {
    icon: AlertTriangle,
    title: "Distraction Factor",
    value: "1.8s",
    description: "Average attention lapse before crashes is 1.8 seconds. Near-miss events show distraction periods of only 0.4 seconds, indicating early correction prevents incidents.",
    color: "destructive",
  },
  {
    icon: Target,
    title: "Lane Position",
    value: "23%",
    description: "Vehicles drifting more than 0.5m from lane center have a 23% higher involvement rate in side-swipe incidents. Consistent lane centering reduces risk significantly.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Braking Patterns",
    value: "0.3s",
    description: "Early braking (0.3s sooner than average) correlates with 52% fewer rear-end collisions. Gradual deceleration patterns show better outcomes than sudden stops.",
    color: "warning",
  },
];

const summaryStats = [
  { label: "Videos Analyzed", value: "200" },
  { label: "Total Crashes", value: "87" },
  { label: "Near Misses", value: "113" },
  { label: "Avg. Reaction Time", value: "0.82s" },
  { label: "Prevention Rate", value: "56.5%" },
  { label: "High Risk Zones", value: "12" },
];

const BehaviorAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/library")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Behavior Analytics</h1>
              <p className="text-sm text-muted-foreground">AI-powered insights from 200 incident videos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {summaryStats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Key Insights */}
        <h2 className="text-lg font-semibold text-foreground mb-6">Key Behavioral Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card 
                key={insight.title}
                className="bg-card/50 border-border/50 p-6 hover:border-border transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${insight.color}/10`}>
                    <Icon className={`w-6 h-6 text-${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{insight.title}</h3>
                      <span className={`text-lg font-bold text-${insight.color}`}>{insight.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Conclusion */}
        <Card className="mt-10 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Summary</h3>
          <p className="text-muted-foreground leading-relaxed">
            Based on comprehensive analysis of 200 incident videos, the data strongly suggests that <span className="text-foreground font-medium">proactive driving behaviors</span> significantly reduce collision risk. 
            Key factors include maintaining reaction times under 0.7 seconds, consistent lane positioning, and early braking patterns. 
            The 113 near-miss events demonstrate that <span className="text-foreground font-medium">56.5% of potential crashes can be avoided</span> through improved driver awareness and defensive techniques. 
            Implementing training focused on these behavioral patterns could reduce incident rates by an estimated <span className="text-primary font-medium">35-45%</span>.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default BehaviorAnalytics;
