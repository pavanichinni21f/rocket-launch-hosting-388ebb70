const technologies = [
  { name: 'Docker', icon: '🐳', category: 'Containers' },
  { name: 'Kubernetes', icon: '☸️', category: 'Orchestration' },
  { name: 'Node.js', icon: '💚', category: 'Runtime' },
  { name: 'Python', icon: '🐍', category: 'Language' },
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'Redis', icon: '🔴', category: 'Cache' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'Nginx', icon: '🟢', category: 'Web Server' },
  { name: 'Git', icon: '📦', category: 'Version Control' },
  { name: 'PHP', icon: '🐘', category: 'Language' },
  { name: 'Ruby', icon: '💎', category: 'Language' },
  { name: 'Go', icon: '🔵', category: 'Language' },
  { name: 'Rust', icon: '🦀', category: 'Language' },
  { name: 'MySQL', icon: '🐬', category: 'Database' },
  { name: 'Apache', icon: '🪶', category: 'Web Server' },
];

const TechStackSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="gradient-text-orange">280+</span> One-Click Deployments
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deploy your favorite technologies with a single click. No complex configurations required.
          </p>
        </div>

        {/* Scrolling Tech Grid */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-[scroll_30s_linear_infinite]">
            {[...technologies, ...technologies].map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex-shrink-0 glass-card p-6 rounded-xl hover:border-primary/50 transition-all duration-300 min-w-[160px] text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h4 className="font-bold mb-1">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Static Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {technologies.slice(0, 16).map((tech) => (
            <div
              key={tech.name}
              className="glass-card p-4 rounded-xl hover:border-primary/50 transition-all duration-300 text-center group cursor-pointer"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {tech.icon}
              </div>
              <p className="text-xs font-medium truncate">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
