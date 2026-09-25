'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = true,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <Link href="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* High-Tech Vector Emblem */}
      <div className="relative w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center p-1.5 shadow-sm border border-zinc-800 group-hover:border-zinc-600 transition-colors flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Vertical Bar */}
          <path d="M22 18V82H36V18H22Z" fill="#FFFFFF" />
          {/* Right Vertical Bar */}
          <path d="M64 18V82H78V18H64Z" fill="#FFFFFF" />
          {/* Cyber Diagonal Crossbar */}
          <path d="M36 42H64V58H36V42Z" fill="#FFFFFF" />
          {/* Center Electric Blue Diamond Accent */}
          <polygon points="50,38 58,50 50,62 42,50" fill="#2563EB" />
          <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span
            className={`font-black text-lg md:text-xl tracking-tighter leading-none font-mono ${
              isLight ? 'text-white' : 'text-zinc-950'
            }`}
          >
            HYKON
          </span>
          <span className="text-blue-600 font-bold text-lg md:text-xl leading-none">.</span>
          <span
            className={`text-xs md:text-sm font-semibold tracking-wider font-mono ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            GE
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[8px] uppercase tracking-[0.2em] font-semibold leading-tight ${
              isLight ? 'text-zinc-400' : 'text-zinc-400'
            }`}
          >
            Premium Tech
          </span>
        )}
      </div>
    </Link>
  );
};
