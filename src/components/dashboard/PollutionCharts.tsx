import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { HeavyMetalData, BIS_STANDARDS } from "@/lib/pollution-calculations";

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

  const COLORS = {
    safe: '#16a34a',
    moderate: '#ca8a04', 
    high: '#ea580c',
    critical: '#dc2626'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Concentration vs Standards Bar Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Concentration vs BIS Standards</CardTitle>
          <CardDescription>Measured concentrations compared to safety limits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metal" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(4)} mg/L`, 
                  name === 'concentration' ? 'Measured' : 'Standard Limit'
                ]}
              />
              <Bar dataKey="standard" fill="#e2e8f0" name="Standard Limit" />
              <Bar 
                dataKey="concentration" 
                name="Measured Concentration"
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Metal Distribution Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Heavy Metal Distribution</CardTitle>
          <CardDescription>Relative concentrations by metal type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${(Number(value) * 1000).toFixed(1)}µg/L`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${(Number(value) * 1000).toFixed(3)} µg/L`, 'Concentration']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Assessment Radar */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Risk Assessment Radar</CardTitle>
          <CardDescription>Multi-dimensional pollution risk visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metal" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Risk Level"
                dataKey="Concentration Ratio"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Tooltip formatter={(value: number) => [`${(value / 20).toFixed(2)}x`, 'Times Standard']} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Concentration Trends</CardTitle>
          <CardDescription>Simulated temporal analysis of metal concentrations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value.toFixed(4)} mg/L`, name]}
              />
              <Line type="monotone" dataKey="Pb" stroke="#dc2626" strokeWidth={2} />
              <Line type="monotone" dataKey="Cd" stroke="#ea580c" strokeWidth={2} />
              <Line type="monotone" dataKey="As" stroke="#ca8a04" strokeWidth={2} />
              <Line type="monotone" dataKey="Cr" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="Se" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};