// The café interior — a layered, painterly backdrop at golden hour. Sits behind
// the counter where the cats are served. Pure authored SVG.
import type { FC } from "react";

export const CafeScene: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 960 560" fill="none" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e9d5b8" /><stop offset="100%" stopColor="#dcc19c" />
      </linearGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd9a0" /><stop offset="45%" stopColor="#f4a988" /><stop offset="100%" stopColor="#c98aa0" />
      </linearGradient>
      <radialGradient id="lamp" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor="#ffe6a8" stopOpacity="0.9" /><stop offset="100%" stopColor="#ffe6a8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a9764a" /><stop offset="100%" stopColor="#8a5a34" />
      </linearGradient>
    </defs>

    {/* wall */}
    <rect width="960" height="560" fill="url(#wall)" />

    {/* big window with dusk sky */}
    <g>
      <rect x="86" y="54" width="360" height="250" rx="14" fill="url(#sky)" stroke="#7a5334" strokeWidth="10" />
      {/* sun */}
      <circle cx="330" cy="150" r="40" fill="#ffe9b8" opacity="0.9" />
      {/* city silhouette */}
      <path d="M86 244h360v60H86Z" fill="#b9748a" opacity="0.55" />
      <g fill="#9c5f78" opacity="0.7">
        <rect x="120" y="196" width="34" height="60" /><rect x="168" y="168" width="26" height="88" />
        <rect x="212" y="210" width="40" height="46" /><rect x="270" y="180" width="30" height="76" />
        <rect x="316" y="204" width="36" height="52" /><rect x="364" y="176" width="28" height="80" />
      </g>
      {/* mullions */}
      <path d="M266 54v250M86 180h360" stroke="#7a5334" strokeWidth="8" />
      {/* sill plant */}
      <g transform="translate(150 300)"><path d="M0 0c-10-26 8-40 6-58M0 0c8-24 26-30 34-46M0 0c-2-30-16-40-14-58" stroke="#5f7d3e" strokeWidth="6" strokeLinecap="round" fill="none" /><path d="M-14 0h28l-4 16h-20Z" fill="#b96f43" stroke="#7a4a2a" strokeWidth="3" /></g>
    </g>

    {/* shelf with coffee jars */}
    <g transform="translate(520 96)">
      <rect x="0" y="60" width="360" height="12" rx="4" fill="url(#wood)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 84} 8)`}>
          <rect width="52" height="52" rx="10" fill="#efe3cd" stroke="#7a5334" strokeWidth="3" />
          <rect y="-8" width="52" height="12" rx="4" fill="#c98a5a" stroke="#7a5334" strokeWidth="3" />
          <rect x="10" y="20" width="32" height="22" rx="4" fill={["#8a5a34", "#5a3826", "#8bab5f", "#a9764a"][i]} opacity="0.8" />
        </g>
      ))}
    </g>

    {/* hanging pendant lamps + glow */}
    {[300, 520, 700].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="0" x2={x} y2="40" stroke="#4a3320" strokeWidth="3" />
        <path d={`M${x - 24} 40h48l-8 26h-32Z`} fill="#caa15c" stroke="#4a3320" strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx={x} cy="120" rx="90" ry="90" fill="url(#lamp)" />
      </g>
    ))}

    {/* monstera plant, left */}
    <g transform="translate(40 300)">
      <path d="M40 120h44l-8 90H48Z" fill="#b96f43" stroke="#7a4a2a" strokeWidth="4" />
      <g fill="#5f7d3e" stroke="#47612f" strokeWidth="3">
        <path d="M62 122c-46 2-70-26-64-64 30 6 48 6 64 30 8-18 30-30 54-28-2 34-22 60-54 62Z" />
      </g>
      <path d="M40 66c8 10 8 30 0 44M60 60c6 12 4 34-4 48" stroke="#3f5628" strokeWidth="2.5" opacity="0.5" fill="none" />
    </g>

    {/* espresso machine on the right end of counter */}
    <g transform="translate(760 300)">
      <rect x="0" y="40" width="150" height="86" rx="12" fill="#c26a4e" stroke="#6b3520" strokeWidth="4" />
      <rect x="14" y="20" width="122" height="30" rx="8" fill="#d98a6e" stroke="#6b3520" strokeWidth="4" />
      <circle cx="40" cy="66" r="9" fill="#f4e9d8" stroke="#6b3520" strokeWidth="3" />
      <circle cx="70" cy="66" r="9" fill="#f4e9d8" stroke="#6b3520" strokeWidth="3" />
      <path d="M104 74v18h18" stroke="#6b3520" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="98" y="92" width="30" height="8" rx="3" fill="#efe3cd" stroke="#6b3520" strokeWidth="3" />
    </g>

    {/* counter across the bottom */}
    <rect x="0" y="470" width="960" height="90" fill="url(#wood)" />
    <rect x="0" y="470" width="960" height="12" fill="#c59a6b" opacity="0.7" />
    <g stroke="#6f4526" strokeWidth="2" opacity="0.35"><path d="M120 482v78M340 482v78M600 482v78M820 482v78" /></g>
  </svg>
);
