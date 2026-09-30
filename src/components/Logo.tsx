import React, { useState, CSSProperties } from 'react';
import badnLogoCroppedImg from '../assets/images/badn_logo_cropped.png';

export const BADN_LOGO_IMAGE = 'https://i.ibb.co.com/Cs3J3TgL/badn-logo-png.png';
export const BADN_LOGO_FALLBACK = badnLogoCroppedImg;

interface LogoProps {
  showText?: boolean;
  theme?: 'light' | 'dark' | 'color';
  className?: string;
  style?: CSSProperties;
  size?: number | string;
}

export function LogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  const [imgSrc, setImgSrc] = useState(BADN_LOGO_IMAGE);
  const isCropped = imgSrc.includes('cropped') || imgSrc.includes('badn-logo');

  return (
    <picture className="w-full h-full block">
      <source type="image/webp" srcSet="/optimized/badn-logo-thumb.webp" />
      <img
        src={imgSrc}
        alt="BADN Logo"
        onError={() => {
          if (imgSrc !== BADN_LOGO_FALLBACK) {
            setImgSrc(BADN_LOGO_FALLBACK);
          }
        }}
        className={`w-full h-full ${isCropped ? 'object-contain' : 'object-cover scale-[1.25]'} object-center ${className || ''}`}
        style={style}
        width={48}
        height={48}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}

export default function Logo({ showText = false, theme = 'color', className, style, size }: LogoProps) {
  let sizeClasses = "w-14 h-14 sm:w-16 sm:h-16";
  let customStyle: CSSProperties = { ...style };

  if (size) {
    if (typeof size === 'number') {
      customStyle.width = `${size}px`;
      customStyle.height = `${size}px`;
      sizeClasses = "";
    } else if (typeof size === 'string') {
      if (size.startsWith('w-') || size.includes('h-')) {
        sizeClasses = size;
      } else {
        customStyle.width = size;
        customStyle.height = size;
        sizeClasses = "";
      }
    }
  }

  const [imgSrc, setImgSrc] = useState(BADN_LOGO_IMAGE);
  const isCropped = imgSrc.includes('cropped') || imgSrc.includes('badn-logo');

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className || ''}`} style={customStyle}>
      {/* Logo Graphic */}
      <div className={`${sizeClasses} shrink-0 flex items-center justify-center overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 drop-shadow-sm`}>
        <picture className="w-full h-full block">
          <source type="image/webp" srcSet="/optimized/badn-logo-thumb.webp" />
          <img
            src={imgSrc}
            alt="BADN - Bangladesh Academy of Dietetics and Nutrition"
            onError={() => {
              if (imgSrc !== BADN_LOGO_FALLBACK) {
                setImgSrc(BADN_LOGO_FALLBACK);
              }
            }}
            className={`w-full h-full ${isCropped ? 'object-contain' : 'object-cover scale-[1.25]'} object-center`}
            style={size && typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined}
            width={64}
            height={64}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      {/* Logo Typography */}
      {showText && (
        <div className="flex flex-col min-w-0 select-none text-left">
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
