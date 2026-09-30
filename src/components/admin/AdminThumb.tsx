"use client";

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface AdminThumbProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  rounded?: 'sm' | 'full';
}

export function AdminThumb({
  src,
  alt = '',
  size = 40,
  className = '',
  rounded = 'sm',
}: AdminThumbProps) {
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-sm';

  if (!src) {
    return (
      <div
        className={`shrink-0 bg-stone-100 text-stone-400 flex items-center justify-center ${radius} ${className}`}
        style={{ width: size, height: size }}
      >
        <ImageIcon size={Math.max(14, Math.round(size * 0.4))} />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-stone-200 ${radius} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className={`object-cover ${radius}`} />
    </div>
  );
}
