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
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* 1. Leaf on top-left of the badge */}
      <path
        d="M58 32C42 22 28 20 8 10C18 24 38 32 58 32Z"
        fill="#449e32"
      />
      <path
        d="M58 32C48 24 36 21 21 16"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* 2. Main Circle Badge (Split vertically / diagonally into Green and Orange) */}
      <g>
        {/* Left Side (Green) */}
        <path
          d="M58 32C41.43 32 28 45.43 28 62C28 78.57 41.43 92 58 92V32Z"
          fill="#449e32"
        />
        {/* Right Side (Orange) */}
        <path
          d="M58 32V92C74.57 92 88 78.57 88 62C88 45.43 74.57 32 58 32Z"
          fill="#e04f21"
        />
      </g>

      {/* 3. Central Silhouette / Atom Core (White stylized human/leaf shape) */}
      <circle cx="58" cy="52" r="8" fill="#ffffff" />
      <path
        d="M58 52C58 52 46 64 46 76C46 80 50 84 58 84C66 84 70 80 70 76C70 64 58 52 58 52Z"
        fill="#ffffff"
      />
      <path
        d="M48 72C52 68 64 68 68 72"
        stroke="#449e32"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 4. Atomic Orbits (Two intersecting orange ellipses) */}
      <g stroke="#e04f21" strokeWidth="2.5" fill="none">
        {/* Orbit 1: Tilted -35 degrees */}
        <ellipse
          cx="58"
          cy="62"
          rx="45"
          ry="15"
          transform="rotate(-35 58 62)"
        />
        {/* Orbit 2: Tilted +35 degrees */}
        <ellipse
          cx="58"
          cy="62"
          rx="45"
          ry="15"
          transform="rotate(35 58 62)"
        />
      </g>

      {/* 5. Orbital Nodes / Electrons (Solid orange spheres) */}
      {/* Node 1 */}
      <circle cx="21" cy="36" r="4.5" fill="#e04f21" />
      <circle cx="21" cy="36" r="6" stroke="#ffffff" strokeWidth="1" />
      {/* Node 2 */}
      <circle cx="95" cy="36" r="4.5" fill="#e04f21" />
      <circle cx="95" cy="36" r="6" stroke="#ffffff" strokeWidth="1" />
      {/* Node 3 */}
      <circle cx="21" cy="88" r="4.5" fill="#e04f21" />
      <circle cx="21" cy="88" r="6" stroke="#ffffff" strokeWidth="1" />
      {/* Node 4 */}
      <circle cx="95" cy="88" r="4.5" fill="#e04f21" />
      <circle cx="95" cy="88" r="6" stroke="#ffffff" strokeWidth="1" />

      {/* 6. Lower blue ribbon text track outline */}
      <path
        d="M26 84C32 94 44 100 58 100C72 100 84 94 90 84"
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export default function Logo({ showText = true, theme = 'color', className, style }: LogoProps) {
  const isColor = theme === 'color';
  
  return (
    <div className={`flex items-center gap-3 ${className || ''}`} style={style}>
      {/* Logo Graphic */}
      <LogoIcon className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 drop-shadow-md" />
      
      {/* Logo Typography */}
      {showText && (
        <div className="flex flex-col select-none">
          <span 
            className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wide leading-none"
            style={{ 
              color: isColor ? '#e04f21' : 'inherit',
              fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'
            }}
          >
            BADN
          </span>
          <span 
            className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight mt-1"
            style={{ color: isColor ? '#449e32' : 'inherit' }}
          >
            Bangladesh Academy of Dietetics and Nutrition
          </span>
        </div>
      )}
    </div>
  );
}
