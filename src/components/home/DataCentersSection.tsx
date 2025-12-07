import { Globe, Zap, Shield } from 'lucide-react';

const datacenters = [
  { location: 'North America', cities: ['New York', 'Los Angeles', 'Chicago'], latency: '< 10ms' },
  { location: 'Europe', cities: ['London', 'Amsterdam', 'Frankfurt'], latency: '< 15ms' },
  { location: 'Asia Pacific', cities: ['Singapore', 'Tokyo', 'Sydney'], latency: '< 20ms' },
];

const DataCentersSection = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Globe className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Global Infrastructure</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="gradient-text-blue">9 Data Centers</span> Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deploy your applications closer to your users with our strategically located data centers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {datacenters.map((dc) => (
            <div key={dc.location} className="glass-card p-8 rounded-2xl hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">{dc.location}</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                {dc.cities.map((city) => (
                  <div key={city} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{dc.latency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">Online</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* World Map Visual */}
        <div className="mt-12 relative h-64 md:h-80 rounded-2xl overflow-hidden bg-muted/30 border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-full">
              {/* Simplified world map dots */}
              {[
                { x: '20%', y: '40%', label: 'NYC' },
                { x: '15%', y: '45%', label: 'LA' },
                { x: '25%', y: '42%', label: 'CHI' },
                { x: '45%', y: '35%', label: 'LON' },
                { x: '48%', y: '38%', label: 'AMS' },
                { x: '50%', y: '40%', label: 'FRA' },
                { x: '78%', y: '55%', label: 'SIN' },
                { x: '85%', y: '35%', label: 'TKY' },
                { x: '88%', y: '75%', label: 'SYD' },
              ].map((point, i) => (
                <div
                  key={i}
                  className="absolute group"
                  style={{ left: point.x, top: point.y }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary animate-ping absolute" />
                    <div className="w-4 h-4 rounded-full bg-primary relative z-10" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.label}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataCentersSection;
