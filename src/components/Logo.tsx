'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
  const { getLocalizedHref } = useLanguage();
  const isLight = variant === 'light';

  return (
    <Link
      href={getLocalizedHref('/')}
      className={`flex items-center gap-3 group select-none ${className}`}
    >
      {/* High-Tech Vector Emblem */}
      <div
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center p-2 shadow-sm transition-all duration-300 group-hover:scale-105 shrink-0 border ${
          isLight
            ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-white shadow-zinc-950/50'
            : 'bg-gradient-to-br from-zinc-950 to-zinc-900 border-zinc-800 text-white shadow-zinc-200/50'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Vertical Bar */}
          <rect x="20" y="16" width="16" height="68" rx="4" fill="#FFFFFF" />
          {/* Right Vertical Bar */}
          <rect x="64" y="16" width="16" height="68" rx="4" fill="#FFFFFF" />
          {/* Center High-Tech Connecting Bar */}
          <rect x="32" y="42" width="36" height="16" rx="3" fill="#2563EB" />
          {/* Glowing Center Core */}
          <circle cx="50" cy="50" r="4" fill="#60A5FA" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-0.5">
          <span
            className={`font-black text-xl sm:text-2xl tracking-tight font-sans transition-colors ${
              isLight ? 'text-white' : 'text-zinc-950 group-hover:text-blue-600'
            }`}
          >
            HYKON
          </span>
          <span className="text-blue-500 font-extrabold text-xl sm:text-2xl">.</span>
          <span
            className={`text-xs sm:text-sm font-bold tracking-wider font-mono ${
              isLight ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            GE
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[9px] uppercase tracking-[0.22em] font-bold mt-0.5 ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Security & Tech
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
