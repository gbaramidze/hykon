'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageZoomProps {
  images: string[];
  title: string;
}

export const ProductImageZoom: React.FC<ProductImageZoomProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);

  // Swipe / Drag state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const validImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'];

  const nextImage = useCallback(() => {
    setActiveIdx(prev => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevImage = useCallback(() => {
    setActiveIdx(prev => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchDelta(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStart;
    setTouchDelta(diff);
  };

  const handleTouchEnd = () => {
    if (touchStart === null) return;
    const swipeThreshold = 45;
    if (touchDelta < -swipeThreshold) {
      nextImage();
    } else if (touchDelta > swipeThreshold) {
      prevImage();
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsDragging(false);
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setTouchDelta(0);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStart === null) return;
    const diff = e.clientX - touchStart;
    setTouchDelta(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || touchStart === null) return;
    const swipeThreshold = 45;
    if (touchDelta < -swipeThreshold) {
      nextImage();
    } else if (touchDelta > swipeThreshold) {
      prevImage();
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-md mx-auto lg:max-w-none select-none">
      {/* Main Touch Slider Card */}
      <div
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[340px] sm:h-[420px] md:h-[460px] bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-xs cursor-grab active:cursor-grabbing flex items-center justify-center group"
      >
        {/* Top-Right Arrow Navigation Buttons */}
        {validImages.length > 1 && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
            <button
              onClick={e => {
                e.stopPropagation();
                prevImage();
              }}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-90 text-zinc-700 hover:text-black flex items-center justify-center transition-all shadow-xs"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                nextImage();
              }}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-90 text-zinc-700 hover:text-black flex items-center justify-center transition-all shadow-xs"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top-Left Fullscreen Lightbox Trigger */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-zinc-100/90 hover:bg-zinc-200 text-zinc-600 hover:text-black transition-all shadow-xs opacity-80 hover:opacity-100"
          title="Полноэкранный просмотр"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Sliding Image Track */}
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${activeIdx * 100}% + ${touchDelta}px))`,
            transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        >
          {validImages.map((img, idx) => (
            <div
              key={idx}
              className="relative w-full h-full flex-shrink-0 flex items-center justify-center p-6 sm:p-10"
              onClick={() => {
                if (Math.abs(touchDelta) < 5) {
                  setIsLightboxOpen(true);
                }
              }}
            >
              <Image
                src={img}
                alt={`${title} - ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-contain p-4 transition-transform duration-200 group-hover:scale-105 pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Bottom Pagination Dots & Pill Indicator */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/70 backdrop-blur-xs border border-zinc-100/60 shadow-2xs">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                onClick={e => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeIdx === idx
                    ? 'w-7 h-2 bg-black'
                    : 'w-2 h-2 bg-zinc-300 hover:bg-zinc-500'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 h-16 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-white transition-all p-1 shadow-2xs ${
                activeIdx === idx
                  ? 'border-black ring-2 ring-black/10 scale-102'
                  : 'border-zinc-200/80 opacity-60 hover:opacity-100 hover:border-zinc-400'
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in select-none">
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="text-sm font-medium truncate max-w-lg">
              {title} <span className="text-zinc-400 font-mono text-xs">({activeIdx + 1}/{validImages.length})</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLightboxScale(s => Math.max(1, s - 0.5))}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                title="Уменьшить"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <span className="text-xs font-mono text-zinc-300 w-12 text-center">
                {Math.round(lightboxScale * 100)}%
              </span>

              <button
                onClick={() => setLightboxScale(s => Math.min(3.5, s + 0.5))}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                title="Увеличить"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxScale(1);
                }}
                className="p-2 bg-zinc-800 hover:bg-rose-600 text-white rounded-lg transition-colors ml-4"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Canvas */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden my-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative w-full h-full max-w-4xl max-h-[75vh] flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${lightboxScale})` }}
            >
              <Image
                src={validImages[activeIdx]}
                alt={title}
                fill
                className="object-contain"
              />
            </div>

            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {validImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 z-10">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-zinc-800 transition-all ${
                    activeIdx === idx ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
