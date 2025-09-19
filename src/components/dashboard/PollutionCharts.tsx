import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { HeavyMetalData, BIS_STANDARDS } from "@/lib/pollution-calculations";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from "lucide-react";

interface PollutionChartsProps {
  metalData: HeavyMetalData;
}

export const PollutionCharts = ({ metalData }: PollutionChartsProps) => {
  // Prepare data for charts
  const barData = Object.entries(metalData).map(([metal, concentration]) => ({
    metal,
    concentration,
    standard: BIS_STANDARDS[metal as keyof typeof BIS_STANDARDS],
    ratio: concentration / BIS_STANDARDS[metal as keyof typeof BIS_STANDARDS],
  }));

  const pieData = barData.map(item => ({
    name: item.metal,
    value: item.concentration,
    fill: item.ratio > 1 ? 
      (item.ratio > 5 ? '#dc2626' : '#ea580c') : 
      (item.ratio > 0.5 ? '#ca8a04' : '#16a34a')
  }));

  const radarData = barData.map(item => ({
    metal: item.metal,
    'Concentration Ratio': Math.min(item.ratio * 20, 100), // Scale for radar visibility
    fullMark: 100,
  }));

  const timeSeriesData = [
    { date: '2024-01', ...metalData },
    { date: '2024-02', Pb: metalData.Pb * 1.1, Cd: metalData.Cd * 0.9, As: metalData.As * 1.05, Cr: metalData.Cr * 0.95, Se: metalData.Se * 1.02 },
    { date: '2024-03', Pb: metalData.Pb * 1.2, Cd: metalData.Cd * 0.85, As: metalData.As * 1.1, Cr: metalData.Cr * 0.9, Se: metalData.Se * 1.05 },
    { date: 'Current', ...metalData },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 📊 Concentration vs Standards Bar Chart */}
      <Card className="glass-card shadow-elevated border-0 overflow-hidden hover:shadow-floating transition-all duration-500 scale-in-animation">
        <CardHeader className="relative bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
          <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <CardTitle className="relative flex items-center space-x-3 text-xl font-bold text-primary">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span>Concentration vs BIS Standards</span>
          </CardTitle>
          <CardDescription className="text-base text-primary/80">
            📈 Measured concentrations compared to safety limits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="metal" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(4)} mg/L`, 
                  name === 'concentration' ? 'Measured' : 'Standard Limit'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-glass)'
                }}
              />
              <Bar dataKey="standard" fill="hsl(var(--muted))" name="Standard Limit" radius={[4, 4, 0, 0]} />
              <Bar 
                dataKey="concentration" 
                name="Measured Concentration"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🥧 Metal Distribution Pie Chart */}
      <Card className="glass-card shadow-elevated border-0 overflow-hidden hover:shadow-floating transition-all duration-500 scale-in-animation" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="relative bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
          <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <CardTitle className="relative flex items-center space-x-3 text-xl font-bold text-secondary">
            <div className="p-2 bg-gradient-secondary rounded-lg">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <span>Heavy Metal Distribution</span>
          </CardTitle>
          <CardDescription className="text-base text-secondary/80">
            🥧 Relative concentrations by metal type
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${(Number(value) * 1000).toFixed(1)}µg/L`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${(Number(value) * 1000).toFixed(3)} µg/L`, 'Concentration']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-glass)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🎯 Risk Assessment Radar */}
      <Card className="glass-card shadow-elevated border-0 overflow-hidden hover:shadow-floating transition-all duration-500 scale-in-animation" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="relative bg-gradient-to-r from-accent/5 to-accent/10 border-b border-accent/20">
          <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <CardTitle className="relative flex items-center space-x-3 text-xl font-bold text-accent">
            <div className="p-2 bg-gradient-to-r from-accent to-accent-light rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span>Risk Assessment Radar</span>
          </CardTitle>
          <CardDescription className="text-base text-accent/80">
            🎯 Multi-dimensional pollution risk visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid className="opacity-30" />
              <PolarAngleAxis dataKey="metal" className="text-sm font-medium" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
              <Radar
                name="Risk Level"
                dataKey="Concentration Ratio"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value / 20).toFixed(2)}x`, 'Times Standard']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-glass)'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📈 Trend Analysis */}
      <Card className="glass-card shadow-elevated border-0 overflow-hidden hover:shadow-floating transition-all duration-500 scale-in-animation" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="relative bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/20">
          <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <CardTitle className="relative flex items-center space-x-3 text-xl font-bold text-primary">
            <div className="p-2 bg-gradient-environmental rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span>Concentration Trends</span>
          </CardTitle>
          <CardDescription className="text-base text-primary/80">
            📈 Simulated temporal analysis of metal concentrations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value.toFixed(4)} mg/L`, name]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-glass)'
                }}
              />
              <Line type="monotone" dataKey="Pb" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Cd" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="As" stroke="#ca8a04" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Cr" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Se" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};