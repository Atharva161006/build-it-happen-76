import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { DataEntryForm } from "@/components/dashboard/DataEntryForm";
import { PollutionResults } from "@/components/dashboard/PollutionResults";
import { PollutionCharts } from "@/components/dashboard/PollutionCharts";
import { PollutionMap } from "@/components/dashboard/PollutionMap";
import { calculatePollutionIndices, HeavyMetalData, PollutionResults as Results } from "@/lib/pollution-calculations";

interface SampleData {
  location: { lat: number; lng: number; name: string };
  date: string;
  metals: HeavyMetalData;
  results: Results;
}

const Index = () => {
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [currentSample, setCurrentSample] = useState<SampleData | null>(null);

  const handleDataSubmit = (data: {
    location: { lat: number; lng: number; name: string };
    date: string;
    metals: HeavyMetalData;
  }) => {
    const results = calculatePollutionIndices(data.metals);
    const newSample: SampleData = {
      ...data,
      results,
    };

    setSamples(prev => [...prev, newSample]);
    setCurrentSample(newSample);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Data Entry Form */}
        <DataEntryForm onDataSubmit={handleDataSubmit} />

        {/* Results Display */}
        {currentSample && (
          <div className="space-y-8">
            <PollutionResults 
              results={currentSample.results}
              location={currentSample.location.name}
              date={currentSample.date}
            />
            
            <PollutionCharts metalData={currentSample.metals} />
          </div>
        )}

        {/* Map with all samples */}
        {samples.length > 0 && (
          <PollutionMap 
            locations={samples.map(sample => ({
              location: sample.location,
              riskLevel: sample.results.riskLevel,
              date: sample.date,
            }))}
          />
        )}

        {/* Welcome message when no data */}
        {samples.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Environmental Monitoring Dashboard
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Enter sampling data above to begin real-time pollution analysis using advanced 
                environmental indices including HPI, HEI, PLI, and ERI calculations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="p-6 bg-card rounded-lg shadow-card">
                  <h3 className="font-semibold text-primary mb-2">BIS Standards</h3>
                  <p className="text-muted-foreground">
                    Compliance checking against Indian Bureau of Standards for water quality
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-card">
                  <h3 className="font-semibold text-primary mb-2">Real-time Analysis</h3>
                  <p className="text-muted-foreground">
                    Instant calculation of pollution indices with interactive visualizations
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-card">
                  <h3 className="font-semibold text-primary mb-2">Risk Assessment</h3>
                  <p className="text-muted-foreground">
                    Multi-dimensional risk evaluation with geographic mapping
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
