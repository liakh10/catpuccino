// Authored painterly cat art. One parametric <Cat> renders every breed from a
// small spec (colours + ears + eyes + accessory), so the whole clowder stays
// consistent and high quality. Soft gradients + blush + highlights = "painted".
import type { CSSProperties, FC } from "react";

export type Accessory = "none" | "bow" | "scarf" | "cap" | "monocle" | "crown" | "apron";

export interface CatSpec {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  cost: number;            // beans to unlock (0 = starter)
  base: string;            // main fur
  shade: string;          // darker fur (gradient bottom)
  belly: string;          // lighter belly/muzzle
  ear: string;            // inner ear / nose pink
  eye: string;            // iris colour
  accent: string;         // accessory colour
  accessory: Accessory;
  patch?: "none" | "tuxedo" | "spots" | "tabby";
}

// ── a single cat, sitting, facing forward ──
export const Cat: FC<{ spec: CatSpec; className?: string; style?: CSSProperties; blink?: boolean }> = ({ spec, className, style, blink }) => {
  const g = `g-${spec.id}`;
  return (
    <svg viewBox="0 0 200 210" fill="none" className={className} style={style} role="img" aria-label={spec.name}>
      <defs>
        <radialGradient id={`${g}-body`} cx="50%" cy="34%" r="75%">
          <stop offset="0%" stopColor={spec.base} />
          <stop offset="100%" stopColor={spec.shade} />
        </radialGradient>
        <radialGradient id={`${g}-cheek`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={spec.ear} stopOpacity="0.75" />
          <stop offset="100%" stopColor={spec.ear} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-belly`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.belly} />
          <stop offset="100%" stopColor={spec.belly} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="196" rx="60" ry="12" fill="#2a1c14" opacity="0.12" />

      {/* tail curling around */}
      <path d="M150 168c34 6 44-22 30-44-9-14-3-26 10-30-24-6-40 12-40 34 0 16-4 30 0 40Z" fill={`url(#${g}-body)`} stroke={spec.shade} strokeWidth="2" />
      <path d="M170 92c9-3 16 4 16 13" stroke={spec.belly} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* body */}
      <path d="M100 96c34 0 54 20 58 52 3 22-8 40-58 40s-61-18-58-40c4-32 24-52 58-52Z" fill={`url(#${g}-body)`} stroke={spec.shade} strokeWidth="2.5" />
      {/* belly patch */}
      <path d="M100 128c16 0 26 10 28 28 1 14-10 22-28 22s-29-8-28-22c2-18 12-28 28-28Z" fill={`url(#${g}-belly)`} opacity="0.85" />

      {/* front paws */}
      <ellipse cx="80" cy="184" rx="14" ry="9" fill={spec.belly} stroke={spec.shade} strokeWidth="2" />
      <ellipse cx="120" cy="184" rx="14" ry="9" fill={spec.belly} stroke={spec.shade} strokeWidth="2" />

      {/* patches (optional) */}
      {spec.patch === "tabby" && (
        <g stroke={spec.shade} strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none">
          <path d="M100 100v14M86 104l2 12M114 104l-2 12" />
        </g>
      )}
      {spec.patch === "spots" && (
        <g fill={spec.shade} opacity="0.4">
          <circle cx="78" cy="150" r="6" /><circle cx="126" cy="158" r="5" /><circle cx="112" cy="140" r="4" />
        </g>
      )}

      {/* head */}
      <g>
        {/* ears */}
        <path d="M62 70c-6-22-2-38 8-40 8-2 18 12 22 30Z" fill={`url(#${g}-body)`} stroke={spec.shade} strokeWidth="2.5" />
        <path d="M138 70c6-22 2-38-8-40-8-2-18 12-22 30Z" fill={`url(#${g}-body)`} stroke={spec.shade} strokeWidth="2.5" />
        <path d="M70 44c4 0 10 10 13 22-8-2-14-2-20 2 1-14 3-24 7-24Z" fill={spec.ear} opacity="0.85" />
        <path d="M130 44c-4 0-10 10-13 22 8-2 14-2 20 2-1-14-3-24-7-24Z" fill={spec.ear} opacity="0.85" />

        {/* face */}
        <ellipse cx="100" cy="80" rx="52" ry="46" fill={`url(#${g}-body)`} stroke={spec.shade} strokeWidth="2.5" />
        {spec.patch === "tuxedo" && <path d="M100 58c14 0 22 12 22 30 0 16-10 26-22 26s-22-10-22-26c0-18 8-30 22-30Z" fill={spec.belly} opacity="0.9" />}

        {/* cheeks blush */}
        <circle cx="70" cy="92" r="14" fill={`url(#${g}-cheek)`} />
        <circle cx="130" cy="92" r="14" fill={`url(#${g}-cheek)`} />

        {/* eyes */}
        {blink ? (
          <g stroke={spec.shade} strokeWidth="3.5" strokeLinecap="round">
            <path d="M74 78c5 4 13 4 18 0" /><path d="M108 78c5 4 13 4 18 0" />
          </g>
        ) : (
          <g>
            <ellipse cx="83" cy="78" rx="9" ry="11" fill="#2a1c14" />
            <ellipse cx="117" cy="78" rx="9" ry="11" fill="#2a1c14" />
            <circle cx="85" cy="74" r="3.4" fill="#fff" opacity="0.9" />
            <circle cx="119" cy="74" r="3.4" fill="#fff" opacity="0.9" />
            <path d="M78 71c3-3 9-3 12 0" stroke={spec.eye} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M112 71c3-3 9-3 12 0" stroke={spec.eye} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
          </g>
        )}

        {/* nose + mouth */}
        <path d="M96 92h8l-4 5Z" fill={spec.ear} stroke={spec.shade} strokeWidth="1" />
        <path d="M100 97c0 5-6 7-10 5M100 97c0 5 6 7 10 5" stroke={spec.shade} strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* whiskers */}
        <g stroke={spec.shade} strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
          <path d="M64 88c-14-2-24 0-30 4M66 96c-14 2-22 6-27 12M136 88c14-2 24 0 30 4M134 96c14 2 22 6 27 12" />
        </g>
      </g>

      {/* accessories */}
      {spec.accessory === "bow" && (
        <g transform="translate(126 46)"><path d="M0 0l16-8v18ZM0 0l-16-8v18Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2" /><circle r="4" fill={spec.accent} stroke="#2a1c14" strokeWidth="2" /></g>
      )}
      {spec.accessory === "scarf" && (
        <g><path d="M60 118c20 12 60 12 80 0l-4 16c-24 10-48 10-72 0Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2.5" /><path d="M120 126l14 30-12 4-8-30Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2.5" /></g>
      )}
      {spec.accessory === "cap" && (
        <g><path d="M60 42c8-20 72-20 80 0Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2.5" /><ellipse cx="100" cy="42" rx="44" ry="7" fill={spec.accent} stroke="#2a1c14" strokeWidth="2.5" /><circle cx="100" cy="24" r="5" fill="#fff" /></g>
      )}
      {spec.accessory === "monocle" && (
        <g><circle cx="117" cy="78" r="15" fill="none" stroke={spec.accent} strokeWidth="3" /><path d="M117 93l4 22" stroke={spec.accent} strokeWidth="2.5" /></g>
      )}
      {spec.accessory === "crown" && (
        <path d="M66 40l8-20 12 14 14-18 14 18 12-14 8 20Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2.5" strokeLinejoin="round" />
      )}
      {spec.accessory === "apron" && (
        <g><path d="M84 120h32v34c0 6-32 6-32 0Z" fill={spec.accent} stroke="#2a1c14" strokeWidth="2" opacity="0.92" /><path d="M84 120l-6 8M116 120l6 8" stroke={spec.accent} strokeWidth="3" strokeLinecap="round" /></g>
      )}
    </svg>
  );
};
