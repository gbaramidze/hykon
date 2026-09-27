'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, ShoppingBag, SlidersHorizontal, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProductImageZoom } from './ProductImageZoom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
  } = useStore();
  const { language, t, translateProductTitle, translateDescription, getLocalizedHref } = useLanguage();

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inCompare = isInCompare(product.id);
  const inWish = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const displayTitle = translateProductTitle(product.title);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariants);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const variantLabel = {
    ka: 'კონფიგურაცია / ვარიანტები:',
    en: 'Configuration / Options:',
    ru: 'Конфигурация / Варианты:',
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors shadow-2xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Gallery Column with Touch Slider */}
          <div className="w-full">
            <ProductImageZoom images={images} title={displayTitle} />
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Header with Brand, SKU and Stock info with safe right padding */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5 pr-12">
                <span className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <span className="text-xs text-zinc-500 font-mono">SKU: {product.sku}</span>
                <span className="text-zinc-300">•</span>
                {product.inStock ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t.inStock}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-zinc-400">{t.onOrder || t.outOfStock}</span>
                )}
              </div>

              <h2 className="text-xl font-bold text-zinc-950 mb-3 leading-snug">
                {displayTitle}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-zinc-950 font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 line-clamp-3 mb-5 leading-relaxed">
                {translateDescription(product.shortDescription || product.fullDescription || '')}
              </p>

              {/* Variants Picker if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2.5 mb-5">
                  <span className="text-xs font-semibold text-zinc-900 block">
                    {variantLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() =>
                          setSelectedVariants(prev => ({ ...prev, [variant.type]: variant.name }))
                        }
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedVariants[variant.type] === variant.name
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {variant.name} {variant.priceModifier ? `(+${formatPrice(variant.priceModifier)})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery & Warranty Information Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-zinc-100 pt-4 mb-6">
                <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-tight">
                    <div className="font-bold text-zinc-900">{t.freeDeliveryNotice || 'სწრაფი მიწოდება'}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{product.deliveryTime || '1-2 დღე'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-tight">
                    <div className="font-bold text-zinc-900">{t.officialWarrantyNotice || 'ოფიციალური გარანტია'}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{product.warranty || '2 წელი'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : product.inStock
                      ? 'bg-black hover:bg-zinc-800 text-white shadow-xs'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  {added ? (
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

                <button
                  onClick={() => toggleCompare(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    inCompare
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-black'
                  }`}
                  title={t.compare}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    inWish
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-zinc-200 text-zinc-600 hover:text-rose-600'
                  }`}
                  title={t.wishlist}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              <Link
                href={getLocalizedHref(`/product/${product.slug}`)}
                onClick={onClose}
                className="block text-center text-xs font-semibold text-zinc-600 hover:text-black py-1 transition-colors"
              >
                {t.viewDetails} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
