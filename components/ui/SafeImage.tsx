"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * next/image wrapper that falls back to a generic placeholder image when the
 * requested source fails to load (404s, expired URLs, etc.) instead of
 * rendering a broken/blank box.
 */
export default function SafeImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const handleError = () => {
    if (currentSrc !== FALLBACK_IMAGE) {
      setCurrentSrc(FALLBACK_IMAGE);
      setKey((k) => k + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Final fallback: neutral navy gradient tile
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          backgroundImage:
            "linear-gradient(135deg, #1B365D 0%, #2C4F7E 60%, #3A5F92 100%)",
        }}
      />
    );
  }

  return (
    <Image
      key={key}
      src={currentSrc}
      alt={alt}
      fill
      onError={handleError}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
