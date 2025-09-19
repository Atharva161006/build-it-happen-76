import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Beaker, Save } from "lucide-react";
import { HeavyMetalData } from "@/lib/pollution-calculations";
import { useToast } from "@/hooks/use-toast";

interface DataEntryFormProps {
  onDataSubmit: (data: {
    location: { lat: number; lng: number; name: string };
    date: string;
    metals: HeavyMetalData;
  }) => void;
}

export const DataEntryForm = ({ onDataSubmit }: DataEntryFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    stationName: "",
    latitude: "",
    longitude: "",
    samplingDate: "",
    Pb: "",
    Cd: "",
    As: "",
    Cr: "",
    Se: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['stationName', 'latitude', 'longitude', 'samplingDate', 'Pb', 'Cd', 'As', 'Cr', 'Se'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Convert and validate numeric values
    try {
      const metals: HeavyMetalData = {
        Pb: parseFloat(formData.Pb),
        Cd: parseFloat(formData.Cd),
        As: parseFloat(formData.As),
        Cr: parseFloat(formData.Cr),
        Se: parseFloat(formData.Se),
      };

      // Check for negative values
      const negativeMetals = Object.entries(metals).filter(([_, value]) => value < 0);
      if (negativeMetals.length > 0) {
        toast({
          title: "Invalid Values",
          description: "Concentration values cannot be negative.",
          variant: "destructive",
        });
        return;
      }

      onDataSubmit({
        location: {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude),
          name: formData.stationName,
        },
        date: formData.samplingDate,
        metals,
      });

      toast({
        title: "Data Submitted Successfully",
        description: "Pollution analysis has been generated.",
      });

      // Reset form
      setFormData({
        stationName: "",
        latitude: "",
        longitude: "",
        samplingDate: "",
        Pb: "",
        Cd: "",
        As: "",
        Cr: "",
        Se: "",
      });

    } catch (error) {
      toast({
        title: "Invalid Data",
        description: "Please check numeric values are properly formatted.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-card shadow-elevated border-0 overflow-hidden slide-up-animation">
      {/* ✨ Header with gradient background */}
      <CardHeader className="relative bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
        <div className="absolute inset-0 shimmer-effect" />
        <CardTitle className="relative flex items-center space-x-3 text-xl">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
            Sample Data Entry
          </span>
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
          🧪 Enter sampling location and heavy metal concentrations for comprehensive analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 📍 Location Information Section */}
          <div className="space-y-6 p-6 glass-card rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3 text-base font-semibold text-primary">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span>📍 Location Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stationName">Station Name *</Label>
                <Input
                  id="stationName"
                  placeholder="e.g., River Sampling Point A"
                  value={formData.stationName}
                  onChange={(e) => handleInputChange('stationName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 28.6139"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 77.2090"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 📅 Sampling Date Section */}
          <div className="space-y-6 p-6 glass-card rounded-xl border border-secondary/20">
            <div className="flex items-center space-x-3 text-base font-semibold text-secondary">
              <div className="p-2 bg-gradient-secondary rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span>📅 Sampling Information</span>
            </div>
            
            <div className="w-full md:w-1/3">
              <Label htmlFor="samplingDate">Sampling Date *</Label>
              <Input
                id="samplingDate"
                type="date"
                value={formData.samplingDate}
                onChange={(e) => handleInputChange('samplingDate', e.target.value)}
              />
            </div>
          </div>

          {/* 🧪 Heavy Metal Concentrations Section */}
          <div className="space-y-6 p-6 glass-card rounded-xl border border-accent/20">
            <div className="flex items-center space-x-3 text-base font-semibold text-accent">
              <div className="p-2 bg-gradient-to-r from-accent to-accent-light rounded-lg">
                <Beaker className="w-4 h-4 text-white" />
              </div>
              <span>🧪 Heavy Metal Concentrations (mg/L)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pb">Lead (Pb) *</Label>
                <Input
                  id="pb"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  value={formData.Pb}
                  onChange={(e) => handleInputChange('Pb', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard: 0.01 mg/L</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cd">Cadmium (Cd) *</Label>
                <Input
                  id="cd"
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="0.0000"
                  value={formData.Cd}
                  onChange={(e) => handleInputChange('Cd', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard: 0.003 mg/L</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="as">Arsenic (As) *</Label>
                <Input
                  id="as"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  value={formData.As}
                  onChange={(e) => handleInputChange('As', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard: 0.01 mg/L</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cr">Chromium (Cr) *</Label>
                <Input
                  id="cr"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  value={formData.Cr}
                  onChange={(e) => handleInputChange('Cr', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard: 0.05 mg/L</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="se">Selenium (Se) *</Label>
                <Input
                  id="se"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  value={formData.Se}
                  onChange={(e) => handleInputChange('Se', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard: 0.01 mg/L</p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-environmental hover:shadow-floating text-white font-semibold text-lg rounded-xl interactive-scale transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 shimmer-effect group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
            <Save className="w-5 h-5 mr-3 relative z-10" />
            <span className="relative z-10">🚀 Analyze Sample</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};