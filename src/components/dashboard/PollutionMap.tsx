import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Satellite, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface PollutionMapProps {
  locations: Array<{
    location: Location;
    riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
    date: string;
  }>;
}

export const PollutionMap = ({ locations }: PollutionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const getRiskColor = (level: 'safe' | 'moderate' | 'high' | 'critical') => {
    switch (level) {
      case 'safe': return '#16a34a';
      case 'moderate': return '#ca8a04';
      case 'high': return '#ea580c';
      case 'critical': return '#dc2626';
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // India center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each location
    locations.forEach(({ location, riskLevel, date }) => {
      const color = getRiskColor(riskLevel);
      
      // Create custom icon based on risk level
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="pollution-popup">
            <h3 style="font-weight: bold; margin: 0 0 8px 0;">${location.name}</h3>
            <p style="margin: 4px 0;"><strong>Risk Level:</strong> ${riskLevel.toUpperCase()}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p style="margin: 4px 0;"><strong>Coordinates:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
          </div>
        `);
    });

    // Fit map to show all markers if there are any
    if (locations.length > 0) {
      const group = new L.FeatureGroup(
        locations.map(({ location }) => L.marker([location.lat, location.lng]))
      );
      if (locations.length === 1) {
        map.setView([locations[0].location.lat, locations[0].location.lng], 10);
      } else {
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      // Cleanup function - don't destroy the map, just clear markers
    };
  }, [locations]);

  useEffect(() => {
    // Cleanup map instance when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Card className="glass-card shadow-floating border-0 overflow-hidden scale-in-animation">
      <CardHeader className="relative bg-gradient-to-r from-accent/5 to-primary/5 border-b border-accent/20">
        <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-500" />
        <CardTitle className="relative flex items-center space-x-3 text-xl font-bold">
          <div className="p-2 bg-gradient-environmental rounded-lg">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Pollution Hotspot Map
          </span>
        </CardTitle>
        <CardDescription className="text-base text-accent/80">
          🗺️ Geographic visualization of sampling locations and risk levels
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          ref={mapRef} 
          className="w-full h-[450px] rounded-xl border border-primary/20 shadow-glass overflow-hidden"
          style={{ minHeight: '450px' }}
        />
        
        {/* 🎨 Enhanced Legend */}
        <div className="mt-6 p-4 glass-card rounded-xl border border-primary/10">
          <div className="flex items-center space-x-2 mb-3">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">Risk Level Legend</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-success/5 transition-colors">
              <div className="w-4 h-4 bg-pollution-safe rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">✅ Safe</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-warning/5 transition-colors">
              <div className="w-4 h-4 bg-pollution-moderate rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">⚠️ Moderate Risk</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-destructive/5 transition-colors">
              <div className="w-4 h-4 bg-pollution-high rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">🔶 High Risk</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors">
              <div className="w-4 h-4 bg-pollution-critical rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">🚨 Critical Risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};