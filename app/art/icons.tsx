// Authored SVG: drink icons (coffee-leaning, with the signature Catpuccino
// latte-art) + cozy UI icons. No emoji anywhere.
import type { CSSProperties, FC } from "react";

type P = { size?: number; className?: string; style?: CSSProperties };

// ── the café brand mark: a coffee cup with cat ears + a steam wisp ──
export const CupLogo: FC<P> = ({ size = 28, className }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
    <path d="M12 20h22v10a11 11 0 0 1-22 0Z" fill="#f4e9d8" stroke="#2a1c14" strokeWidth="2.4" />
    <path d="M34 22h4a5 5 0 0 1 0 10h-4" stroke="#2a1c14" strokeWidth="2.4" fill="none" />
    <path d="M12 20l3-6 3 6M30 20l3-6 3 6" fill="#c98a5a" stroke="#2a1c14" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M20 9c-1 3 1 4 0 7M27 9c-1 3 1 4 0 7" stroke="#c98a5a" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// ── steam wisps (animated via CSS on .steam) ──
export const Steam: FC<P> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 40" fill="none" className={className} aria-hidden>
    <path className="steam-a" d="M8 36c-3-6 3-8 0-14s3-8 0-14" stroke="#e9dcc6" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path className="steam-b" d="M16 36c-3-6 3-8 0-14s3-8 0-14" stroke="#e9dcc6" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

// ── drinks ──
const DRINKS: Record<string, { liquid: string; foam?: string; garnish?: "cat" | "leaf" | "cocoa" | "swirl" }> = {
  catpuccino: { liquid: "#7a4a28", foam: "#f0e2c8", garnish: "cat" },
  espresso: { liquid: "#3a2318", garnish: "swirl" },
  latte: { liquid: "#c99a6a", foam: "#f2e7d2", garnish: "leaf" },
  matcha: { liquid: "#8bab5f", foam: "#d9e6bf", garnish: "leaf" },
  cocoa: { liquid: "#5a3826", foam: "#e9cbb0", garnish: "cocoa" },
};

export const Drink: FC<{ id: string; size?: number; className?: string }> = ({ id, size = 64, className }) => {
  const d = DRINKS[id] ?? DRINKS.catpuccino;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <defs>
        <radialGradient id={`liq-${id}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={d.liquid} stopOpacity="0.85" />
          <stop offset="100%" stopColor={d.liquid} />
        </radialGradient>
      </defs>
      {/* saucer */}
      <ellipse cx="50" cy="86" rx="34" ry="8" fill="#efe3cd" stroke="#2a1c14" strokeWidth="2.5" />
      {/* cup */}
      <path d="M24 40h44v20a22 22 0 0 1-44 0Z" fill="#fbf5ea" stroke="#2a1c14" strokeWidth="2.8" />
      <path d="M68 44h6a7 7 0 0 1 0 14h-6" stroke="#2a1c14" strokeWidth="2.8" fill="none" />
      {/* liquid surface */}
      <ellipse cx="46" cy="42" rx="21" ry="6.5" fill={`url(#liq-${id})`} stroke="#2a1c14" strokeWidth="2" />
      {d.foam && <ellipse cx="46" cy="41" rx="18" ry="5.2" fill={d.foam} />}

      {/* garnish / latte art */}
      {d.garnish === "cat" && (
        <g transform="translate(46 41)">
          {/* cat-face latte art in cocoa on the foam */}
          <circle r="6.6" fill="none" stroke="#6b4326" strokeWidth="1.6" />
          <path d="M-5-4l-2-4 4 2M5-4l2-4-4 2" stroke="#6b4326" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="-2.4" cy="-1" r="1" fill="#6b4326" /><circle cx="2.4" cy="-1" r="1" fill="#6b4326" />
          <path d="M-2 2c1 1.4 3 1.4 4 0" stroke="#6b4326" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      )}
      {d.garnish === "leaf" && (
        <path d="M46 41c6-3 11-1 12 2-4 2-9 2-12-2Z" fill="none" stroke="#4f6b34" strokeWidth="1.6" transform="translate(-6 0)" />
      )}
      {d.garnish === "swirl" && (
        <path d="M40 41c4-3 9 3 12-1" stroke="#8a5a34" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      )}
      {d.garnish === "cocoa" && (
        <g fill="#5a3826"><circle cx="40" cy="41" r="1" /><circle cx="48" cy="39" r="1" /><circle cx="52" cy="43" r="1" /><circle cx="44" cy="44" r="1" /></g>
      )}

      {/* steam */}
      <g opacity="0.7"><path className="steam-a" d="M40 30c-2-4 2-6 0-10" stroke="#d9c9ac" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path className="steam-b" d="M52 30c-2-4 2-6 0-10" stroke="#d9c9ac" strokeWidth="2.2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
};

// ── UI icons ──
export const Bean: FC<P> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <ellipse cx="12" cy="12" rx="7" ry="9" fill="#8a5a34" stroke="#2a1c14" strokeWidth="1.6" transform="rotate(24 12 12)" />
    <path d="M9 6c3 4 3 8 0 12" stroke="#f4e9d8" strokeWidth="1.6" fill="none" transform="rotate(24 12 12)" />
  </svg>
);

export const Heart: FC<P & { filled?: boolean }> = ({ size = 22, className, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 21c-6-4-9-8-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4-3 8-9 12Z" fill={filled ? "#e07a72" : "none"} stroke="#2a1c14" strokeWidth="1.8" strokeLinejoin="round" opacity={filled ? 1 : 0.4} />
  </svg>
);

export const Star: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 3l2.6 5.6L21 9.5l-4.5 4.3 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.5l6.4-.9Z" fill="#e5b45a" stroke="#2a1c14" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const XIcon: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M3 3l7.6 9.9L3.4 21h2.3l5.8-6.7L16.6 21H21l-8-10.4L20.4 3h-2.3l-5.4 6.2L7.7 3H3Z" fill="currentColor" />
  </svg>
);

export const Paw: FC<P> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <ellipse cx="12" cy="15" rx="6" ry="5" />
    <circle cx="6" cy="9" r="2.2" /><circle cx="10" cy="6" r="2.2" /><circle cx="14" cy="6" r="2.2" /><circle cx="18" cy="9" r="2.2" />
  </svg>
);
