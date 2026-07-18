import React, { SVGProps, HTMLAttributes, CSSProperties } from 'react';

interface LogoProps {
  showText?: boolean;
  theme?: 'light' | 'dark' | 'color';
  className?: string;
  style?: CSSProperties;
}

export function LogoIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Circular paths for curved text */}
      <defs>
        {/* Top Text path (semi-circle curving up) */}
        <path
          id="topTextPath"
          d="M 90,220 A 160,160 0 0,1 410,220"
          fill="none"
        />
        {/* Bottom Text path (semi-circle curving down, right to left so text is right-side up) */}
        <path
          id="bottomTextPath"
          d="M 410,220 A 160,160 0 0,1 90,220"
          fill="none"
        />
      </defs>

      {/* 1. Curved text above and below the badge */}
      {/* Top Curved Text: "EMPOWERING NUTRITION PROFESSIONALS" */}
      <text fontFamily="'Inter', 'Helvetica Neue', sans-serif" fontSize="16.5" fontWeight="800" fill="#e04f21" letterSpacing="1.2">
        <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
          EMPOWERING NUTRITION PROFESSIONALS
        </textPath>
      </text>

      {/* Bottom Curved Text: "BANGLADESH ACADEMY OF DIETETICS AND NUTRITION" */}
      <text fontFamily="'Inter', 'Helvetica Neue', sans-serif" fontSize="14.5" fontWeight="800" fill="#1b3b6f" letterSpacing="0.8">
        <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
          BANGLADESH ACADEMY OF DIETETICS &amp; NUTRITION
        </textPath>
      </text>

      {/* 2. Main Circle Badge (centered at 250, 220, r=105) */}
      <g>
        {/* Left Side (Green) */}
        <path
          d="M 250,115 A 105,105 0 0,0 250,325 Z"
          fill="#036b37"
        />
        {/* Right Side (Orange) */}
        <path
          d="M 250,115 A 105,105 0 0,1 250,325 Z"
          fill="#e04f21"
        />
      </g>

      {/* 3. Central Silhouette / Atom Core (White human/leaf figure) */}
      <circle cx="250" cy="180" r="14" fill="#ffffff" />
      
      {/* Arms stretching upwards/outwards */}
      <path
        d="M 250,195 C 235,195 210,208 190,222 C 185,226 188,232 194,230 C 210,222 232,216 250,216 C 268,216 290,222 306,230 C 312,232 315,226 310,222 C 290,208 265,195 250,195 Z"
        fill="#ffffff"
      />
      {/* Torso split legs */}
      <path
        d="M 230,224 C 230,224 212,250 212,282 C 212,292 222,298 232,298 C 242,298 250,282 250,266 C 250,282 258,298 268,298 C 278,298 288,292 288,282 C 288,250 270,224 270,224 Z"
        fill="#ffffff"
      />

      {/* 4. Atomic Orbits */}
      <g strokeWidth="4" fill="none">
        {/* Orbit 1: Tilted -35 degrees (Orange) */}
        <ellipse
          cx="250"
          cy="220"
          rx="135"
          ry="42"
          transform="rotate(-35 250 220)"
          stroke="#e04f21"
        />
        {/* Orbit 2: Tilted +35 degrees (Green) */}
        <ellipse
          cx="250"
          cy="220"
          rx="135"
          ry="42"
          transform="rotate(35 250 220)"
          stroke="#036b37"
        />
      </g>

      {/* 5. Orbital Nodes */}
      <circle cx="138" cy="142" r="11" fill="#e04f21" stroke="#ffffff" strokeWidth="3" />
      <circle cx="362" cy="142" r="11" fill="#e04f21" stroke="#ffffff" strokeWidth="3" />
      <circle cx="138" cy="298" r="11" fill="#e04f21" stroke="#ffffff" strokeWidth="3" />
      <circle cx="362" cy="298" r="11" fill="#e04f21" stroke="#ffffff" strokeWidth="3" />

      {/* 6. Open Book */}
      <g transform="translate(0, 10)">
        {/* Book Cover / Shadow (Dark Green) */}
        <path
          d="M 250,345 L 150,335 C 140,334 135,338 135,345 L 135,372 C 135,379 140,383 150,382 L 250,392 L 350,382 C 360,383 365,379 365,372 L 365,345 C 365,338 360,334 350,335 Z"
          fill="#014221"
        />
        {/* Book Pages (White) */}
        <path
          d="M 250,340 C 215,330 170,330 145,340 L 145,367 C 170,357 215,357 250,367 C 285,357 330,357 355,367 L 355,340 C 330,330 285,330 250,340 Z"
          fill="#ffffff"
          stroke="#014221"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Book spine line */}
        <path
          d="M 250,340 L 250,367"
          stroke="#014221"
          strokeWidth="3.5"
        />
      </g>

      {/* 7. "BADN" Brand Text */}
      <text
        x="250"
        y="435"
        fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
        fontSize="64"
        fontWeight="900"
        fill="#036b37"
        textAnchor="middle"
        letterSpacing="2"
      >
        BADN
      </text>

      {/* 8. Tagline */}
      <line x1="80" y1="465" x2="140" y2="465" stroke="#036b37" strokeWidth="3" strokeLinecap="round" />
      <line x1="360" y1="465" x2="420" y2="465" stroke="#036b37" strokeWidth="3" strokeLinecap="round" />
      
      <text
        x="250"
        y="470"
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontSize="14.5"
        fontWeight="800"
        fill="#036b37"
        textAnchor="middle"
        letterSpacing="1.5"
      >
        KNOWLEDGE • NUTRITION • EXCELLENCE
      </text>
    </svg>
  );
}

export default function Logo({ showText = true, theme = 'color', className, style }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className || ''}`} style={style}>
      {/* Logo Graphic */}
      <LogoIcon className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-300" />
      
      {/* Logo Typography */}
      {showText && (
        <div className="flex flex-col min-w-0 select-none">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-brand leading-none">
            BADN
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-tight mt-1 max-w-[180px] sm:max-w-xs">
            Bangladesh Academy of Dietetics & Nutrition
          </span>
        </div>
      )}
    </div>
  );
}
