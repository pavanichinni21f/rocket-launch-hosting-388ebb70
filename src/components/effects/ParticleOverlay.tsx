import { useEffect, useRef } from 'react';

interface ParticleOverlayProps {
  density?: number;
  color?: string;
  className?: string;
}

/**
 * Lightweight canvas-based particle overlay. Pure JS, no external deps.
 */
export function ParticleOverlay({
  density = 60,
  color = 'rgba(255,255,255,0.6)',
  className = '',
}: ParticleOverlayProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4 * dpr,
      vy: (Math.random() - 0.5) * 0.4 * dpr,
      r: (Math.random() * 1.6 + 0.4) * dpr,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density, color]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

export default ParticleOverlay;
