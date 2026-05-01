"use client";

// Reusable botanical SVGs (leaves, branches, trees) used as decorative
// accents in the public site sections. All shapes use currentColor so
// the parent can tint via Tailwind text-* classes.

export function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M60 190 C60 190 10 140 20 80 C30 20 60 10 60 10 C60 10 90 20 100 80 C110 140 60 190 60 190Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path d="M60 10 L60 190" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M60 50 C40 60 30 80 35 100" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 70 C80 80 90 100 85 120" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 90 C40 100 32 118 37 138" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 110 C80 120 88 138 83 158" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
    </svg>
  );
}

export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 10 C50 60 50 110 50 150" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      {/* paired leaves */}
      <path d="M50 40 C30 35 18 45 20 60 C35 58 48 50 50 40Z" fill="currentColor" opacity="0.18" />
      <path d="M50 40 C70 35 82 45 80 60 C65 58 52 50 50 40Z" fill="currentColor" opacity="0.18" />
      <path d="M50 75 C32 70 22 80 24 95 C38 92 50 84 50 75Z" fill="currentColor" opacity="0.18" />
      <path d="M50 75 C68 70 78 80 76 95 C62 92 50 84 50 75Z" fill="currentColor" opacity="0.18" />
      <path d="M50 110 C34 105 26 115 28 128 C40 126 50 118 50 110Z" fill="currentColor" opacity="0.18" />
      <path d="M50 110 C66 105 74 115 72 128 C60 126 50 118 50 110Z" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

export function Tree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* trunk */}
      <path d="M100 230 L100 130" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      {/* main canopy circles */}
      <circle cx="100" cy="100" r="55" fill="currentColor" opacity="0.10" />
      <circle cx="70" cy="115" r="38" fill="currentColor" opacity="0.10" />
      <circle cx="130" cy="115" r="38" fill="currentColor" opacity="0.10" />
      <circle cx="100" cy="70" r="35" fill="currentColor" opacity="0.10" />
      {/* branches */}
      <path d="M100 180 C90 165 75 155 65 150" stroke="currentColor" strokeWidth="1.2" opacity="0.25" fill="none" />
      <path d="M100 180 C110 165 125 155 135 150" stroke="currentColor" strokeWidth="1.2" opacity="0.25" fill="none" />
      <path d="M100 150 C92 138 82 130 75 128" stroke="currentColor" strokeWidth="1" opacity="0.22" fill="none" />
      <path d="M100 150 C108 138 118 130 125 128" stroke="currentColor" strokeWidth="1" opacity="0.22" fill="none" />
      {/* small leaf accents */}
      <ellipse cx="65" cy="150" rx="6" ry="3" transform="rotate(-30 65 150)" fill="currentColor" opacity="0.22" />
      <ellipse cx="135" cy="150" rx="6" ry="3" transform="rotate(30 135 150)" fill="currentColor" opacity="0.22" />
      <ellipse cx="75" cy="128" rx="5" ry="2.5" transform="rotate(-25 75 128)" fill="currentColor" opacity="0.22" />
      <ellipse cx="125" cy="128" rx="5" ry="2.5" transform="rotate(25 125 128)" fill="currentColor" opacity="0.22" />
      {/* ground line */}
      <path d="M60 232 Q100 228 140 232" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
    </svg>
  );
}

export function Branch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 50 Q60 40 120 50 T235 50" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      <ellipse cx="40" cy="40" rx="10" ry="5" transform="rotate(-20 40 40)" fill="currentColor" opacity="0.18" />
      <ellipse cx="70" cy="60" rx="10" ry="5" transform="rotate(20 70 60)" fill="currentColor" opacity="0.18" />
      <ellipse cx="110" cy="38" rx="11" ry="5" transform="rotate(-15 110 38)" fill="currentColor" opacity="0.18" />
      <ellipse cx="150" cy="62" rx="11" ry="5" transform="rotate(15 150 62)" fill="currentColor" opacity="0.18" />
      <ellipse cx="190" cy="40" rx="10" ry="5" transform="rotate(-20 190 40)" fill="currentColor" opacity="0.18" />
      <ellipse cx="220" cy="58" rx="9" ry="4.5" transform="rotate(20 220 58)" fill="currentColor" opacity="0.18" />
    </svg>
  );
}
