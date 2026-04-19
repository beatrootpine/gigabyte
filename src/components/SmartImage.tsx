import { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  seed: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

/**
 * SmartImage — loads the provided src first. If it fails (broken Unsplash ID,
 * network issue, etc.), silently swaps to a deterministic Picsum image seeded
 * by `seed` so the same event always gets the same fallback photo.
 */
export const SmartImage = ({ src, alt, seed, className = '', loading = 'lazy' }: SmartImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      // Deterministic fallback — same event always gets the same image
      const safeSeed = encodeURIComponent(seed).slice(0, 40);
      setCurrentSrc(`https://picsum.photos/seed/${safeSeed}/800/1000`);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
};
