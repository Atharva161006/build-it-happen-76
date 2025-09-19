import { Droplets, Shield, Activity } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-environmental shadow-environmental">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Heavy Metal Pollution Monitor
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                AI-Powered Environmental Monitoring System
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-primary-foreground/90">
              <Shield className="w-5 h-5" />
              <span className="font-medium">BIS Standards</span>
            </div>
            <div className="flex items-center space-x-2 text-primary-foreground/90">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Real-time Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};