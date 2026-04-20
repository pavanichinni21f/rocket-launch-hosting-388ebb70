import { ReactNode } from 'react';
import VideoBackground from '@/components/effects/VideoBackground';
import ParticleOverlay from '@/components/effects/ParticleOverlay';

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex items-end p-12 text-foreground overflow-hidden">
        <VideoBackground />
        <ParticleOverlay density={50} color="hsl(var(--primary) / 0.5)" />
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold tracking-tight">
            {title ?? 'Build. Deploy. Scale.'}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {subtitle ?? 'Production-grade hosting and tooling for ambitious teams.'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
