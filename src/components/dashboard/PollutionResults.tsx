import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, MapPin, Calendar, BarChart3 } from "lucide-react";
import { PollutionResults as Results } from "@/lib/pollution-calculations";

interface PollutionResultsProps {
  results: Results;
  location: string;
  date: string;
}

export const PollutionResults = ({ results, location, date }: PollutionResultsProps) => {
  const getRiskIcon = (level: Results['riskLevel']) => {
    switch (level) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getRiskColor = (level: Results['riskLevel']) => {
    switch (level) {
      case 'safe':
        return 'bg-pollution-safe text-white';
      case 'moderate':
        return 'bg-pollution-moderate text-white';
      case 'high':
        return 'bg-pollution-high text-white';
      case 'critical':
        return 'bg-pollution-critical text-white';
    }
  };

  const getProgressColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.5) return 'bg-success';
    if (value <= threshold) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-8">
      {/* 🎯 Overall Risk Assessment with advanced styling */}
      <Card className="glass-card shadow-floating border-0 overflow-hidden scale-in-animation">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-environmental" />
          
          <CardTitle className="relative flex items-center justify-between text-xl z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 glass-card rounded-xl">
                {getRiskIcon(results.riskLevel)}
              </div>
              <div>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                  Pollution Risk Assessment
                </span>
                <div className="text-sm text-muted-foreground font-normal mt-1">
                  Comprehensive environmental analysis
                </div>
              </div>
            </div>
            <Badge className={`${getRiskColor(results.riskLevel)} px-4 py-2 text-sm font-bold rounded-xl shadow-lg interactive-scale`}>
              {results.riskLevel.toUpperCase()}
            </Badge>
          </CardTitle>
          <CardDescription className="relative z-10 text-base mt-4 flex items-center space-x-4">
            <span className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 p-8">
          {results.exceedsStandards.length > 0 && (
            <div className="glass-card p-6 border border-destructive/30 rounded-xl bg-gradient-to-r from-destructive/5 to-destructive/10 glow-effect">
              <h4 className="font-bold text-destructive mb-3 flex items-center text-lg">
                <div className="p-2 bg-destructive/20 rounded-lg mr-3">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                ⚠️ Standards Exceeded
              </h4>
              <p className="text-destructive/90 font-medium">
                The following metals exceed BIS safety standards: 
                <span className="font-bold"> {results.exceedsStandards.join(', ')}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📊 Pollution Indices with enhanced cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 📈 HPI - Heavy Metal Pollution Index */}
        <Card className="glass-card shadow-elevated border-0 overflow-hidden hover:shadow-floating transition-all duration-500 interactive-scale slide-up-animation">
          <CardHeader className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-b border-primary/20">
            <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <CardTitle className="relative text-xl font-bold text-primary flex items-center space-x-3">
              <BarChart3 className="w-6 h-6" />
              <span>Heavy Metal Pollution Index</span>
            </CardTitle>
            <CardDescription className="relative text-base text-primary/80 font-medium">
              HPI • Weighted average of metal concentrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{results.hpi}</span>
                <Badge variant={results.hpi > 100 ? 'destructive' : results.hpi > 50 ? 'secondary' : 'default'}>
                  {results.hpi > 100 ? 'Critical' : results.hpi > 50 ? 'High' : results.hpi > 25 ? 'Moderate' : 'Safe'}
                </Badge>
              </div>
              <Progress 
                value={Math.min(results.hpi, 200)} 
                max={200} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                Safe: &lt;25 • Moderate: 25-50 • High: 50-100 • Critical: &gt;100
              </p>
            </div>
          </CardContent>
        </Card>

        {/* HEI - Heavy Metal Evaluation Index */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Heavy Metal Evaluation Index</CardTitle>
            <CardDescription>HEI • Sum of concentration ratios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{results.hei}</span>
                <Badge variant={results.hei > 10 ? 'destructive' : results.hei > 5 ? 'secondary' : 'default'}>
                  {results.hei > 10 ? 'Critical' : results.hei > 5 ? 'High' : results.hei > 2 ? 'Moderate' : 'Safe'}
                </Badge>
              </div>
              <Progress 
                value={Math.min(results.hei * 10, 200)} 
                max={200} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                Safe: &lt;2 • Moderate: 2-5 • High: 5-10 • Critical: &gt;10
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PLI - Pollution Load Index */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Pollution Load Index</CardTitle>
            <CardDescription>PLI • Geometric mean of contamination factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{results.pli}</span>
                <Badge variant={results.pli > 3 ? 'destructive' : results.pli > 2 ? 'secondary' : 'default'}>
                  {results.pli > 3 ? 'Critical' : results.pli > 2 ? 'High' : results.pli > 1 ? 'Moderate' : 'Safe'}
                </Badge>
              </div>
              <Progress 
                value={Math.min(results.pli * 25, 200)} 
                max={200} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                Safe: &lt;1 • Moderate: 1-2 • High: 2-3 • Critical: &gt;3
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ERI - Ecological Risk Index */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Ecological Risk Index</CardTitle>
            <CardDescription>ERI • Toxicity-weighted risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{results.eri}</span>
                <Badge variant={results.eri > 300 ? 'destructive' : results.eri > 150 ? 'secondary' : 'default'}>
                  {results.eri > 300 ? 'Critical' : results.eri > 150 ? 'High' : results.eri > 75 ? 'Moderate' : 'Safe'}
                </Badge>
              </div>
              <Progress 
                value={Math.min(results.eri / 2, 200)} 
                max={200} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                Safe: &lt;75 • Moderate: 75-150 • High: 150-300 • Critical: &gt;300
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};