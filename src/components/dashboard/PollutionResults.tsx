import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getRiskIcon(results.riskLevel)}
              <span>Pollution Risk Assessment</span>
            </div>
            <Badge className={getRiskColor(results.riskLevel)}>
              {results.riskLevel.toUpperCase()}
            </Badge>
          </CardTitle>
          <CardDescription>
            Analysis for {location} • {new Date(date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.exceedsStandards.length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Standards Exceeded
              </h4>
              <p className="text-sm text-destructive/80">
                The following metals exceed BIS safety standards: {results.exceedsStandards.join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pollution Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HPI - Heavy Metal Pollution Index */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Heavy Metal Pollution Index</CardTitle>
            <CardDescription>HPI • Weighted average of metal concentrations</CardDescription>
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