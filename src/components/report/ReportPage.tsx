import { ArrowLeft, ExternalLink, TrendingUp, Eye, AlertTriangle, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReportData } from "@/data/mockReport";
import { cn } from "@/lib/utils";

interface ReportPageProps {
  report: ReportData;
  onBackToExplore: () => void;
}

const maturityColors: Record<string, string> = {
  Beginner: "text-muted-foreground bg-muted/30 border-border/50",
  Developing: "text-muted-foreground bg-muted/30 border-border/50",
  Proficient: "text-primary bg-primary/10 border-primary/30",
  Advanced: "text-primary bg-primary/10 border-primary/30",
  Expert: "text-primary bg-primary/10 border-primary/30",
};

const scoreColors: Record<string, string> = {
  Beginner: "text-muted-foreground",
  Developing: "text-muted-foreground",
  Proficient: "text-primary",
  Advanced: "text-primary",
  Expert: "text-primary",
};

export const ReportPage = ({ report, onBackToExplore }: ReportPageProps) => {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Fixed Top-Left Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBackToExplore}
        className="fixed top-6 left-6 text-muted-foreground hover:text-foreground z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Features
      </Button>

      <div className="max-w-5xl mx-auto pt-16 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {report.header.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="text-sm">{report.header.subtitle}</span>
          </div>
        </div>

        {/* Score + Platform Maturity Row */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">
            {/* Score - Left Third */}
            <div className="flex flex-col items-center justify-center p-8 md:border-r border-border/30">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - report.score / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className={cn("text-4xl font-bold", scoreColors[report.maturity.label] || "text-primary")}>
                  {report.score}
                </span>
              </div>
            </div>

            {/* Platform Maturity - Right Two-Thirds */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Platform Maturity</h2>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold border",
                    maturityColors[report.maturity.label] || maturityColors.Proficient
                  )}
                >
                  {report.maturity.label}
                </span>
              </div>

              <p className="text-foreground leading-relaxed mb-4">
                {report.maturity.summary}
              </p>

              <p className="text-sm text-muted-foreground italic">
                {report.maturity.peerComparison}
              </p>
            </div>
          </div>
        </Card>

        {/* Strengths + Blind Spots Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Your Strengths</h2>
              </div>

              <ul className="space-y-3">
                {report.strengths.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Blind Spots */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Blind Spots</h2>
              </div>

              <ul className="space-y-3">
                {report.blindSpots.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span className="text-foreground">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Recommendations Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Top 3 Recommendations</h2>
            </div>

            <div className="space-y-4">
              {report.recommendations.items.map((item, index) => (
                <div
                  key={item.featureId}
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <a
                        href="https://www.9fin.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold hover:text-primary transition-colors inline-flex items-center gap-2 group mb-1"
                      >
                        {item.title}
                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.rationale}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Closing CTA */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-6">
            {report.cta.text}
          </p>
          <Button
            variant="outline"
            onClick={onBackToExplore}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Features
          </Button>
        </div>
      </div>
    </div>
  );
};
