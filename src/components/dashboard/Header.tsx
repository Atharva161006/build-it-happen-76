import { Droplets, Shield, Activity, Sparkles, Globe, BarChart3 } from "lucide-react";

export const Header = () => {
  return (
    <header className="relative overflow-hidden">
      {/* 🌟 Background with advanced gradients and patterns */}
      <div className="absolute inset-0 bg-gradient-environmental" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      {/* ✨ Floating elements */}
      <div className="absolute top-4 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl floating-animation" />
      <div className="absolute bottom-4 left-20 w-24 h-24 bg-primary-glow/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }} />
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 slide-up-animation">
            {/* 🎨 Enhanced logo with glassmorphism */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500" />
              <div className="relative flex items-center justify-center w-16 h-16 glass-card rounded-2xl interactive-scale interactive-glow">
                <Droplets className="w-8 h-8 text-white drop-shadow-lg" />
                <div className="absolute inset-0 rounded-2xl shimmer-effect" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Heavy Metal Pollution Monitor
                <Sparkles className="inline-block w-6 h-6 ml-2 text-primary-glow animate-pulse" />
              </h1>
              <p className="text-lg text-white/90 font-medium drop-shadow-sm">
                🤖 AI-Powered Environmental Monitoring System
              </p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>Global Standards</span>
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full" />
                <span className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Advanced Analytics</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* 🎯 Enhanced status indicators */}
          <div className="flex items-center space-x-8 fade-in-animation" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-3 glass-card px-4 py-3 rounded-xl interactive-scale">
              <Shield className="w-5 h-5 text-white" />
              <div className="text-white">
                <div className="font-semibold text-sm">BIS Standards</div>
                <div className="text-xs text-white/80">Compliance Ready</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 glass-card px-4 py-3 rounded-xl interactive-scale">
              <Activity className="w-5 h-5 text-white animate-pulse" />
              <div className="text-white">
                <div className="font-semibold text-sm">Real-time Analysis</div>
                <div className="text-xs text-white/80">Active Monitoring</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 🌊 Animated wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </header>
  );
};