import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  src?: string;
  poster?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

/**
 * Full-bleed cinematic video background with gradient overlay.
 * Falls back to an animated gradient when no src is provided.
 */
export function VideoBackground({
  src,
  poster,
  overlayClassName = 'bg-gradient-to-b from-background/40 via-background/60 to-background',
  children,
}: VideoBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <motion.div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(ellipse at top left, hsl(var(--primary) / 0.25), transparent 50%), radial-gradient(ellipse at bottom right, hsl(var(--accent) / 0.2), transparent 50%), linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)))',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {children}
    </div>
  );
}

export default VideoBackground;
