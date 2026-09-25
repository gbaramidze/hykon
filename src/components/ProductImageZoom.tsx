'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageZoomProps {
  images: string[];
  title: string;
}

export const ProductImageZoom: React.FC<ProductImageZoomProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const validImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const nextImage = () => setActiveIdx(prev => (prev + 1) % validImages.length);
  const prevImage = () => setActiveIdx(prev => (prev - 1 + validImages.length) % validImages.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with Hover Magnifier */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-square bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden cursor-zoom-in group select-none flex items-center justify-center p-6"
      >
        <Image
          src={validImages[activeIdx]}
          alt={title}
          fill
          priority
          className="object-contain p-4 transition-transform duration-150"
          style={
            isZooming
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: 'scale(2.2)',
                }
              : { transform: 'scale(1)' }
          }
        />

        {/* Hover zoom guide indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-zinc-200 text-zinc-700 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Нажмите для увеличения</span>
        </div>

        {/* Nav arrows if multiple images */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-zinc-200 text-zinc-700 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-zinc-200 text-zinc-700 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-zinc-50 transition-all p-1 ${
                activeIdx === idx
                  ? 'border-black shadow-sm'
                  : 'border-zinc-200 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in select-none">
          {/* Top Bar */}
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

          {/* Central Zoom Canvas */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
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

            {/* Navigation in Lightbox */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {validImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 z-10">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-zinc-800 transition-all ${
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
