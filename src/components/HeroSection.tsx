'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSectionProps {
  products: Product[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ products }) => {
  const { formatPrice, addToCart, toggleCompare, isInCompare } = useStore();
  const { language, translateProductTitle, translateDescription, translateSpecName, translateSpecValue, getLocalizedHref } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);

  const labels = {
    ka: {
      inStockBadge: 'მარაგშია (საქართველო)',
      officialPrice: 'ოფიციალური ფასი',
      oldPrice: 'ძველი ფასი',
      added: 'დამატებულია კალათაში',
      buyNow: 'შეძენა',
      specs: 'მახასიათებლები',
      compare: 'შედარება',
      delivery12Days: 'მიწოდება 1-2 დღე',
      warranty: 'გარანტია',
      return14Days: '14 დღე დაბრუნება',
    },
    en: {
      inStockBadge: 'In Stock (Georgia)',
      officialPrice: 'Official Price',
      oldPrice: 'Old Price',
      added: 'Added to Cart',
      buyNow: 'Buy Now',
      specs: 'Specifications',
      compare: 'Compare',
      delivery12Days: '1-2 Days Delivery',
      warranty: 'Warranty',
      return14Days: '14-Day Return',
    },
    ru: {
      inStockBadge: 'В наличии (Грузия)',
      officialPrice: 'Официальная цена',
      oldPrice: 'Старая цена',
      added: 'Добавлено в корзину',
      buyNow: 'Купить сейчас',
      specs: 'Характеристики',
      compare: 'Сравнить',
      delivery12Days: 'Доставка 1-2 дня',
      warranty: 'Гарантия',
      return14Days: '14 дней возврат',
    },
  }[language];

  // Pick 5 top diverse flagship products
  const featuredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const picks = [
      products.find(p => p.title.includes('შლაგბაუმი') || p.title.includes('Barrier')),
      products.find(p => p.title.includes('Wi-Fi 6') || p.title.includes('როუტერი') || p.title.includes('Access Point')),
      products.find(p => p.title.includes('ColorVu') || p.title.includes('AcuSense') || p.title.includes('კამერა IP')),
      products.find(p => p.title.includes('AJAX') || p.title.includes('საკეტი') || p.title.includes('Smart')),
      products.find(p => p.title.includes('PoE') || p.title.includes('სვიჩი') || p.isBestseller),
    ].filter(Boolean) as Product[];

    return picks.length > 0 ? picks : products.slice(0, 5);
  }, [products]);

  const activeProduct = featuredProducts[currentIdx] || products[0];

  // Auto advance hero slide every 7 seconds
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % featuredProducts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (!activeProduct) return null;

  const inCompare = isInCompare(activeProduct.id);

  const handleAddToCart = () => {
    addToCart(activeProduct, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  const localizedTitle = translateProductTitle(activeProduct.title);
  const localizedDesc = translateDescription(activeProduct.shortDescription || activeProduct.fullDescription || '');

  return (
    <section className="relative bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-200 overflow-hidden">
      {/* Background soft glow accents */}
      <div className="absolute -top-40 right-10 w-96 h-96 bg-zinc-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Main Hero Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          {/* Left Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-zinc-900 text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider font-mono">
                {activeProduct.brand}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {labels.inStockBadge}
              </span>
              <span className="text-zinc-400 text-xs font-mono">
                SKU: {activeProduct.sku}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 leading-tight tracking-tight mb-3 line-clamp-2">
                {localizedTitle}
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                {localizedDesc}
              </p>
            </div>

            {/* Spec Chips */}
            {activeProduct.specGroups?.[0]?.items && (
              <div className="flex flex-wrap gap-2 pt-1">
                {activeProduct.specGroups[0].items.slice(0, 3).map((spec, i) => (
                  <div
                    key={i}
                    className="bg-white border border-zinc-200 text-zinc-700 text-xs px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    <span className="font-semibold text-zinc-900">{translateSpecName(spec.name)}:</span>{' '}
                    <span>{translateSpecValue(spec.value)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price & Purchase Actions */}
            <div className="pt-4 border-t border-zinc-200/80 space-y-4">
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    {labels.officialPrice}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono">
                    {formatPrice(activeProduct.price)}
                  </div>
                </div>

                {activeProduct.oldPrice && (
                  <div>
                    <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      {labels.oldPrice}
                    </div>
                    <div className="text-lg text-zinc-400 line-through font-mono">
                      {formatPrice(activeProduct.oldPrice)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    addedAnim
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-zinc-800 text-white'
                  }`}
                >
                  {addedAnim ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{labels.added}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{labels.buyNow}</span>
                    </>
                  )}
                </button>

                <Link
                  href={getLocalizedHref(`/product/${activeProduct.slug}`)}
                  className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>{labels.specs}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => toggleCompare(activeProduct)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    inCompare
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-300 text-zinc-600 hover:border-black'
                  }`}
                  title={labels.compare}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] leading-tight">{labels.delivery12Days}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] leading-tight">{labels.warranty} {activeProduct.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] leading-tight">{labels.return14Days}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px]">
              {/* Slide Navigation Arrows */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                <button
                  onClick={() =>
                    setCurrentIdx(prev =>
                      prev === 0 ? featuredProducts.length - 1 : prev - 1
                    )
                  }
                  className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIdx(prev => (prev + 1) % featuredProducts.length)
                  }
                  className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                  aria-label="Next product"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Image */}
              <Link
                href={getLocalizedHref(`/product/${activeProduct.slug}`)}
                className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] block transition-transform duration-500 hover:scale-105"
              >
                <Image
                  src={activeProduct.thumbnail || activeProduct.images[0]}
                  alt={activeProduct.title}
                  fill
                  priority
                  className="object-contain p-4"
                />
              </Link>

              {/* Slide dots indicator */}
              <div className="flex items-center gap-2 mt-4 z-10">
                {featuredProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentIdx === i ? 'w-8 bg-black' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
