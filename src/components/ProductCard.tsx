'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, SlidersHorizontal, Heart, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  viewMode = 'grid',
}) => {
  const {
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
  } = useStore();
  const {
    t,
    translateProductTitle,
    translateSpecName,
    translateSpecValue,
    getLocalizedHref,
  } = useLanguage();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const inCompare = isInCompare(product.id);
  const inWish = isInWishlist(product.id);

  const displayTitle = translateProductTitle(product.title);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const specItems = product.specGroups?.flatMap(g => g.items).slice(0, 3) || [];

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-xl border border-zinc-200 hover:border-zinc-900 transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row overflow-hidden p-4 gap-5"
      >
        {/* Left image area */}
        <div className="relative w-full sm:w-48 h-48 sm:h-48 shrink-0 bg-zinc-50/50 rounded-lg p-3 flex items-center justify-center border border-zinc-100">
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && (
              <span className="bg-rose-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-xs">
                -{discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-xs">
                NEW
              </span>
            )}
          </div>

          <Link href={getLocalizedHref(`/product/${product.slug}`)} className="relative w-full h-full block">
            <Image
              src={
                isHovered && product.images && product.images.length > 1
                  ? product.images[1]
                  : product.thumbnail || product.images[0]
              }
              alt={displayTitle}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              loading="lazy"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Center: Info & Specs */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                {product.brand}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-400 font-mono text-[11px]">
                SKU: {product.sku}
              </span>
              <span className="text-zinc-300">•</span>
              {product.inStock ? (
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t.inStock}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-zinc-400">{t.onOrder}</span>
              )}
            </div>

            <Link
              href={getLocalizedHref(`/product/${product.slug}`)}
              className="text-base font-bold text-zinc-950 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 block"
            >
              {displayTitle}
            </Link>

            {product.shortDescription && (
              <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Spec tags */}
            {specItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {specItems.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-medium"
                  >
                    <b className="text-zinc-900 mr-1">{translateSpecName(spec.name)}:</b> {translateSpecValue(spec.value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Price & Buy Box */}
        <div className="w-full sm:w-56 shrink-0 flex flex-col justify-between sm:border-l sm:border-zinc-100 sm:pl-5 pt-3 sm:pt-0 border-t border-zinc-100 sm:border-t-0">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl font-bold text-zinc-950 font-mono">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-zinc-400 line-through font-mono">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                addedAnim
                  ? 'bg-emerald-600 text-white'
                  : product.inStock
                  ? 'bg-black hover:bg-zinc-800 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.added}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? t.addToCart : t.outOfStock}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={handleWishlistClick}
                className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  inWish
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-zinc-300'
                }`}
                title={t.wishlist}
              >
                <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-600' : ''}`} />
              </button>

              <button
                onClick={handleCompareClick}
                className={`py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  inCompare
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'bg-white border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-300'
                }`}
                title={t.compare}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {onQuickView && (
                <button
                  onClick={e => {
                    e.preventDefault();
                    onQuickView(product);
                  }}
                  className="py-1.5 px-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-300 text-xs font-medium flex items-center justify-center gap-1 transition-all bg-white"
                  title={t.quickView}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW (Default)
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden"
    >
      {/* Product Image & Badges Overlaid */}
      <div className="relative w-full aspect-4/3 sm:aspect-square bg-zinc-50/50 p-2.5 sm:p-4 flex items-center justify-center overflow-hidden border-b border-zinc-100">
        {/* Badges (Top Left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-rose-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-xs shadow-2xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-xs shadow-2xs">
              NEW
            </span>
          )}
        </div>

        {/* Action icons (Top Right) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-full border transition-all ${
              inWish
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white/90 backdrop-blur-2xs border-zinc-200/80 text-zinc-400 hover:text-rose-600 hover:border-zinc-400 shadow-2xs'
            }`}
            title={t.wishlist}
          >
            <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-600' : ''}`} />
          </button>

          <button
            onClick={handleCompareClick}
            className={`p-1.5 rounded-full border transition-all ${
              inCompare
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white/90 backdrop-blur-2xs border-zinc-200/80 text-zinc-400 hover:text-black hover:border-zinc-400 shadow-2xs'
            }`}
            title={t.compare}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Image Link */}
        <Link href={getLocalizedHref(`/product/${product.slug}`)} className="relative w-full h-full block">
          <Image
            src={
              isHovered && product.images && product.images.length > 1
                ? product.images[1]
                : product.thumbnail || product.images[0]
            }
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={e => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-2 bg-white/95 text-zinc-900 shadow-md border border-zinc-200 px-2.5 py-1 rounded-md text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-black hover:text-white"
          >
            <Eye className="w-3 h-3" />
            {t.quickView}
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            {product.inStock ? (
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t.inStock}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-zinc-400">{t.onOrder}</span>
            )}
          </div>

          {/* Title */}
          <Link
            href={getLocalizedHref(`/product/${product.slug}`)}
            className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-blue-600 line-clamp-2 h-8 sm:h-9 leading-snug transition-colors mb-2 block"
            title={displayTitle}
          >
            {displayTitle}
          </Link>
        </div>

        {/* Price & Buy Button */}
        <div className="pt-2 border-t border-zinc-100 mt-1">
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-base sm:text-lg font-bold text-zinc-950 font-mono">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-zinc-400 line-through font-mono">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              addedAnim
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-black hover:bg-zinc-800 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.added}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.inStock ? t.addToCart : t.outOfStock}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
