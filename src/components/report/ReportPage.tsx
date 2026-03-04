import { ArrowLeft, ExternalLink, TrendingUp, Eye, AlertTriangle, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportData } from "@/data/mockReport";
import { Feature } from "@/data/features";
import { cn } from "@/lib/utils";

interface ReportPageProps {
  report: ReportData;
  allFeatures: Feature[];
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

export const ReportPage = ({ report, allFeatures, onBackToExplore }: ReportPageProps) => {
  const featureLookup = new Map(allFeatures.map(f => [f.id, f]));

  return (
    <div className="min-h-screen">
      {/* Sticky Back Button Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/20 px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToExplore}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Features
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 space-y-6">
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
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
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
                <span className={cn("px-4 py-2 rounded-full text-sm font-semibold border", maturityColors[report.maturity.label] || maturityColors.Proficient)}>
                  {report.maturity.label}
                </span>
              </div>
              <p className="text-foreground leading-relaxed mb-4">{report.maturity.summary}</p>
              <p className="text-sm text-muted-foreground italic">{report.maturity.peerComparison}</p>
            </div>
          </div>
        </Card>

        {/* Strengths + Blind Spots Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Visual Recommendations */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Top 3 Recommendations</h2>
          </div>

          <div className="space-y-6">
            {report.recommendations.items.map((item, index) => {
              const feature = featureLookup.get(item.featureId);
              return (
                <Card key={item.featureId} className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    {/* Title row with rank badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      {feature?.category && (
                        <Badge variant="secondary" className="text-xs">{feature.category}</Badge>
                      )}
                      {feature?.url && (
                        <a
                          href={feature.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Two-column: image + description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Image */}
                      <div className="bg-muted/30 rounded-xl border border-border/30 overflow-hidden">
                        <div className="aspect-[4/3]">
                          <img
                            src={feature?.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Description + Use Case */}
                      <div className="flex flex-col gap-4">
                        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <p className="text-primary text-sm font-semibold leading-relaxed">
                            {item.rationale}
                          </p>
                        </div>

                        {feature?.use_case && (
                          <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                              Use Case
                            </h4>
                            <p className="text-foreground text-sm leading-relaxed">
                              {feature.use_case}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-6">{report.cta.text}</p>
          <Button variant="outline" onClick={onBackToExplore} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Features
          </Button>
        </div>
      </div>
    </div>
  );
};