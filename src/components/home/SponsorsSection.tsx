const sponsors = [
  { name: 'AWS', logo: 'https://cdn.simpleicons.org/amazonaws/FF9900' },
  { name: 'Google Cloud', logo: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
  { name: 'Cloudflare', logo: 'https://cdn.simpleicons.org/cloudflare/F38020' },
  { name: 'DigitalOcean', logo: 'https://cdn.simpleicons.org/digitalocean/0080FF' },
  { name: 'Linode', logo: 'https://cdn.simpleicons.org/linode/00A95C' },
  { name: 'Vultr', logo: 'https://cdn.simpleicons.org/vultr/007BFC' },
];

const SponsorsSection = () => {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            <span className="gradient-text-orange">Powered By</span> Industry Leaders
          </h2>
          <p className="text-muted-foreground">Trusted infrastructure from the world's best providers</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
