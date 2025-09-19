import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { DataEntryForm } from "@/components/dashboard/DataEntryForm";
import { PollutionResults } from "@/components/dashboard/PollutionResults";
import { PollutionCharts } from "@/components/dashboard/PollutionCharts";
import { PollutionMap } from "@/components/dashboard/PollutionMap";
import { calculatePollutionIndices, HeavyMetalData, PollutionResults as Results } from "@/lib/pollution-calculations";
import { Droplets, Shield, BarChart3, Activity } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* 🌟 Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <Header />
      
      <main className="relative container mx-auto px-6 py-12 space-y-12">
        {/* 📝 Enhanced Data Entry Form */}
        <div className="slide-up-animation">
          <DataEntryForm onDataSubmit={handleDataSubmit} />
        </div>

        {/* 📊 Results Display with staggered animations */}
        {currentSample && (
          <div className="space-y-12">
            <div className="fade-in-animation" style={{ animationDelay: '0.2s' }}>
              <PollutionResults 
                results={currentSample.results}
                location={currentSample.location.name}
                date={currentSample.date}
              />
            </div>
            
            <div className="slide-up-animation" style={{ animationDelay: '0.4s' }}>
              <PollutionCharts metalData={currentSample.metals} />
            </div>
          </div>
        )}

        {/* 🗺️ Enhanced Map Display */}
        {samples.length > 0 && (
          <div className="scale-in-animation" style={{ animationDelay: '0.6s' }}>
            <PollutionMap 
              locations={samples.map(sample => ({
                location: sample.location,
                riskLevel: sample.results.riskLevel,
                date: sample.date,
              }))}
            />
          </div>
        )}

        {/* 🎯 Enhanced Welcome Section */}
        {samples.length === 0 && (
          <div className="text-center py-20 fade-in-animation">
            <div className="max-w-4xl mx-auto">
              {/* 🌟 Hero Section */}
              <div className="glass-card p-12 rounded-2xl shadow-floating border-0 mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-environmental rounded-2xl shadow-glow">
                    <Droplets className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Environmental Monitoring Dashboard
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  🧪 Enter sampling data above to begin real-time pollution analysis using advanced 
                  environmental indices including <span className="font-semibold text-primary">HPI</span>, <span className="font-semibold text-secondary">HEI</span>, <span className="font-semibold text-accent">PLI</span>, and <span className="font-semibold text-primary">ERI</span> calculations.
                </p>
                
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-primary rounded-full text-white font-medium shadow-lg">
                  <Activity className="w-5 h-5" />
                  <span>Ready for Analysis</span>
                </div>
              </div>

              {/* 🎨 Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-2xl shadow-elevated border-0 hover:shadow-floating transition-all duration-500 interactive-scale group">
                  <div className="p-4 bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-glow mb-6 mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">BIS Standards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Compliance checking against Indian Bureau of Standards for water quality with real-time validation
                  </p>
                </div>
                
                <div className="glass-card p-8 rounded-2xl shadow-elevated border-0 hover:shadow-floating transition-all duration-500 interactive-scale group" style={{ animationDelay: '0.2s' }}>
                  <div className="p-4 bg-gradient-secondary rounded-xl shadow-glow mb-6 mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-4">Real-time Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Instant calculation of pollution indices with interactive visualizations and advanced charting
                  </p>
                </div>
                
                <div className="glass-card p-8 rounded-2xl shadow-elevated border-0 hover:shadow-floating transition-all duration-500 interactive-scale group" style={{ animationDelay: '0.4s' }}>
                  <div className="p-4 bg-gradient-to-r from-accent to-accent-light rounded-xl shadow-glow mb-6 mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-accent mb-4">Risk Assessment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Multi-dimensional risk evaluation with geographic mapping and predictive analytics
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
