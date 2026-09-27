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
      inStockBadge: 'მარაგშია',
      officialPrice: 'ოფიციალური ფასი',
      oldPrice: 'ძველი ფასი',
      added: 'კალათაშია',
      buyNow: 'შეძენა',
      specs: 'დეტალები',
      compare: 'შედარება',
      delivery12Days: 'მიწოდება 1-2 დღე',
      warranty: 'გარანტია 2 წელი',
      return14Days: '14 დღე დაბრუნება',
    },
    en: {
      inStockBadge: 'In Stock',
      officialPrice: 'Official Price',
      oldPrice: 'Old Price',
      added: 'In Cart',
      buyNow: 'Buy Now',
      specs: 'Details',
      compare: 'Compare',
      delivery12Days: '1-2 Days Delivery',
      warranty: '2 Years Warranty',
      return14Days: '14-Day Return',
    },
    ru: {
      inStockBadge: 'В наличии',
      officialPrice: 'Официальная цена',
      oldPrice: 'Старая цена',
      added: 'В корзине',
      buyNow: 'Купить сейчас',
      specs: 'Подробнее',
      compare: 'Сравнить',
      delivery12Days: 'Доставка 1-2 дня',
      warranty: 'Гарантия 2 года',
      return14Days: '14 дней возврат',
    },
  }[language];

  // Pick 5 top diverse flagship products (strictly unique)
  const featuredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const candidates = [
      products.find(p => p.title.includes('შლაგბაუმი') || p.title.includes('Barrier')),
      products.find(p => p.title.includes('Wi-Fi 6') || p.title.includes('როუტერი') || p.title.includes('Access Point')),
      products.find(p => p.title.includes('ColorVu') || p.title.includes('AcuSense') || p.title.includes('კამერა IP')),
      products.find(p => p.title.includes('AJAX') || p.title.includes('საკეტი') || p.title.includes('Smart')),
      products.find(p => p.title.includes('PoE') || p.title.includes('სვიჩი') || p.isBestseller),
    ].filter(Boolean) as Product[];

    const uniqueMap = new Map<string, Product>();
    for (const p of candidates) {
      if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
    }
    for (const p of products) {
      if (uniqueMap.size >= 5) break;
      if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
    }
    return Array.from(uniqueMap.values());
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
  const rawDesc = activeProduct.shortDescription || activeProduct.fullDescription || '';
  const localizedDesc = translateDescription(rawDesc);
  const showDesc = localizedDesc.trim() !== '' && localizedDesc.trim().toLowerCase() !== localizedTitle.trim().toLowerCase();

  // Filter out redundant specs
  const filteredSpecs = (activeProduct.specGroups?.[0]?.items || []).filter(s => {
    const n = s.name.toLowerCase();
    return !n.includes('brand') && !n.includes('ბრენდ') && !n.includes('sku') && !n.includes('არტიკულ') && !n.includes('warranty') && !n.includes('გარანტი');
  }).slice(0, 3);

  return (
    <section className="bg-gradient-to-b from-zinc-50/80 via-white to-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Main Hero Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Left Column: Product Info & CTAs */}
            <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-4">
              <div>
                {/* Brand & Stock Header */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-zinc-950 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    {activeProduct.brand}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {labels.inStockBadge}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono">
                    SKU: {activeProduct.sku}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-950 leading-tight tracking-tight mb-2">
                  {localizedTitle}
                </h1>

                {/* Optional short description */}
                {showDesc && (
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-3">
                    {localizedDesc}
                  </p>
                )}

                {/* Technical Specs Tags */}
                {filteredSpecs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {filteredSpecs.map((spec, i) => (
                      <div
                        key={i}
                        className="bg-zinc-100 text-zinc-700 text-[11px] sm:text-xs px-2.5 py-1 rounded-md"
                      >
                        <span className="font-semibold text-zinc-900">{translateSpecName(spec.name)}:</span>{' '}
                        <span>{translateSpecValue(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 space-y-3">
                <div className="flex items-baseline gap-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-mono">
                    {formatPrice(activeProduct.price)}
                  </div>

                  {activeProduct.oldPrice && (
                    <div className="text-sm sm:text-base text-zinc-400 line-through font-mono">
                      {formatPrice(activeProduct.oldPrice)}
                    </div>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3 w-full max-w-lg">
                  <button
                    onClick={handleAddToCart}
                    className={`col-span-7 sm:col-span-6 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
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
                    className="col-span-3 sm:col-span-4 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-semibold py-3 px-2 text-center rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>{labels.specs}</span>
                    <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                  </Link>

                  <button
                    onClick={() => toggleCompare(activeProduct)}
                    className={`col-span-2 p-3 rounded-xl border flex items-center justify-center transition-all ${
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
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 text-[10px] sm:text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="leading-tight truncate">{labels.delivery12Days}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="leading-tight truncate">{labels.warranty}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="leading-tight truncate">{labels.return14Days}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Image & Thumbnail Carousel */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full bg-zinc-50/70 rounded-2xl border border-zinc-200/60 p-4 flex flex-col items-center justify-center overflow-hidden">
                
                {/* Navigation Arrows */}
                <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                  <button
                    onClick={() =>
                      setCurrentIdx(prev =>
                        prev === 0 ? featuredProducts.length - 1 : prev - 1
                      )
                    }
                    className="p-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs border border-zinc-200"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIdx(prev => (prev + 1) % featuredProducts.length)
                    }
                    className="p-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs border border-zinc-200"
                    aria-label="Next product"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Image */}
                <Link
                  href={getLocalizedHref(`/product/${activeProduct.slug}`)}
                  className="relative w-full h-48 sm:h-56 lg:h-64 block transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={activeProduct.thumbnail || activeProduct.images[0]}
                    alt={activeProduct.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
                    className="object-contain p-2"
                  />
                </Link>

                {/* Mini Thumbnails Selector Strip */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-200/60 w-full justify-center overflow-x-auto py-1">
                  {featuredProducts.map((p, i) => (
                    <button
                      key={`${p.id}-${i}`}
                      onClick={() => setCurrentIdx(i)}
                      className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white border p-1 transition-all shrink-0 ${
                        currentIdx === i
                          ? 'border-black ring-2 ring-black/10 shadow-xs scale-105'
                          : 'border-zinc-200 opacity-60 hover:opacity-100'
                      }`}
                      title={p.title}
                    >
                      <Image
                        src={p.thumbnail || p.images[0]}
                        alt={p.title}
                        fill
                        sizes="48px"
                        className="object-contain p-0.5"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
