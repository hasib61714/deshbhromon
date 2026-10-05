import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string };

// <img> with graceful degradation: optionally retry once with `fallbackSrc`, then show a
// calm gradient tile instead of a broken-image icon.
export const SafeImage: React.FC<Props> = ({ src, fallbackSrc, className, alt, onError, ...rest }) => {
  const [current, setCurrent] = useState<string | undefined>(src);
  const [failed, setFailed] = useState(false);

  // A new source gets a fresh chance
  useEffect(() => {
    setCurrent(src);
    setFailed(false);
  }, [src]);

  if (failed || !current) {
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
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
};
