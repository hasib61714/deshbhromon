import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string };

// <img> with graceful degradation: optionally retry once with `fallbackSrc`, then show a
// calm gradient tile instead of a broken-image icon. Failure state is keyed by src, so a
// new src automatically gets a fresh attempt.
export const SafeImage: React.FC<Props> = ({ src, fallbackSrc, className, alt, onError, ...rest }) => {
  const [failure, setFailure] = useState<{ src?: string; level: number }>({ level: 0 });
  const level = failure.src === src ? failure.level : 0;
  const current = level === 0 ? src : level === 1 && fallbackSrc && fallbackSrc !== src ? fallbackSrc : undefined;

  if (!current) {
    return (
      <div
        role="img"
        aria-label={alt || 'ছবি লোড হয়নি'}
        className={`${className ?? ''} bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 flex items-center justify-center`}
      >
        <ImageOff className="w-6 h-6 text-white/30" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      className={className}
      onError={(e) => {
        onError?.(e);
        setFailure({ src, level: level + 1 });
      }}
    />
  );
};
