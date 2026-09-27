'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Percent,
  ChevronRight,
  ShieldCheck,
  Truck,
  Wrench,
  Headphones,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { BrandLogo } from '@/components/BrandLogo';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { Product } from '@/types';

export default function HomePage() {
  const { products, categories, brands, blogPosts } = useStore();
  const { t, translateCategoryName, translateDescription, getLocalizedHref } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'discount'>('bestseller');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Hide empty categories and filter to root level
  const activeRootCategories = categories
    .filter(c => (c.level === 1 || !c.parentId) && (c.productCount === undefined || c.productCount > 0))
    .slice(0, 6);

  // Limit curated products on home page to top 8 items per tab
  const tabProducts = React.useMemo(() => {
    let list = products;
    if (activeTab === 'bestseller') {
      list = products.filter(p => p.isBestseller);
    } else if (activeTab === 'new') {
      list = products.filter(p => p.isNew);
    } else if (activeTab === 'discount') {
      list = products.filter(p => p.oldPrice && p.oldPrice > p.price);
    }
    return (list.length > 0 ? list : products).slice(0, 8);
  }, [products, activeTab]);

  // Curate top popular brands for display (exclude Accessories from logo carousel)
  const topBrands = React.useMemo(() => {
    return brands.filter(b => b.name !== 'Accessories').slice(0, 12);
  }, [brands]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* INTERACTIVE HERO SHOWCASE */}
        <HeroSection products={products} />

        {/* ACTIVE CATEGORIES EXPLORER (2 IN A ROW ON MOBILE WITH REAL PHOTOS) */}
        <section className="py-6 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-950">{t.categories}</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">
                  {t.categorySubtitle}
                </p>
              </div>

              <Link
                href={getLocalizedHref('/catalog')}
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                {t.allCategories} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {activeRootCategories.map(cat => {
                const subCats = categories.filter(
                  c => c.parentId === cat.id && (c.productCount === undefined || c.productCount > 0)
                ).slice(0, 3);

                return (
                  <div
                    key={cat.id}
                    className="group relative bg-white hover:bg-zinc-50/50 rounded-xl sm:rounded-2xl border border-zinc-200 hover:border-zinc-900 p-3 sm:p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Category Representative Photo */}
                      <Link
                        href={getLocalizedHref(`/catalog/${cat.slug}`)}
                        className="relative w-full aspect-4/3 sm:aspect-auto sm:h-32 bg-zinc-50 rounded-lg sm:rounded-xl p-2 border border-zinc-100 flex items-center justify-center overflow-hidden group-hover:bg-white group-hover:border-zinc-300 transition-all shadow-2xs mb-2 sm:mb-4"
                      >
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            sizes="(max-width: 640px) 160px, 240px"
                            className="object-contain p-1.5 sm:p-2.5 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-zinc-400">
                            {getCategoryIcon(cat.icon, cat.id, 'w-8 h-8')}
                          </div>
                        )}
                      </Link>

                      {cat.productCount !== undefined && (
                        <div className="mb-1 sm:mb-2">
                          <span className="text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 px-1.5 sm:px-2 py-0.5 rounded">
                            {cat.productCount} {t.itemsCount || 'პროდ.'}
                          </span>
                        </div>
                      )}

                      <Link
                        href={getLocalizedHref(`/catalog/${cat.slug}`)}
                        className="text-xs sm:text-base font-bold sm:font-extrabold text-zinc-950 group-hover:text-blue-600 transition-colors block line-clamp-2 leading-tight sm:leading-snug"
                      >
                        {translateCategoryName(cat.name)}
                      </Link>

                      {/* Subcategories quick links (hidden on mobile to keep 2-in-row tidy) */}
                      {subCats.length > 0 && (
                        <div className="hidden sm:block space-y-1 mt-3">
                          {subCats.map(sub => (
                            <Link
                              key={sub.id}
                              href={getLocalizedHref(`/catalog/${sub.slug}`)}
                              className="text-xs text-zinc-500 hover:text-black block hover:underline truncate"
                            >
                              • {translateCategoryName(sub.name)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 sm:pt-4 border-t border-zinc-100 flex items-center justify-between mt-2.5 sm:mt-4">
                      <Link
                        href={getLocalizedHref(`/catalog/${cat.slug}`)}
                        className="text-[11px] sm:text-xs font-bold text-zinc-900 group-hover:text-blue-600 flex items-center gap-1 sm:gap-1.5 transition-colors"
                      >
                        <span>{t.allProducts}</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CURATED PRODUCTS SHOWCASE TABS (8 TOP PRODUCTS ONLY) */}
        <section className="py-12 sm:py-16 bg-zinc-50 border-y border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            {/* Tab Headers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">{t.featuredProductsTitle}</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {t.featuredProductsSubtitle}
                </p>
              </div>

              <div className="flex items-center bg-white p-1 rounded-xl border border-zinc-200 shadow-2xs overflow-x-auto scrollbar-none flex-nowrap max-w-full">
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'bestseller'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.bestsellers}</span>
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'new'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.newArrivals}</span>
                </button>
                <button
                  onClick={() => setActiveTab('discount')}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'discount'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.discounts}</span>
                </button>
              </div>
            </div>

            {/* Products Grid (Curated 8 Items) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {tabProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={p => setQuickViewProduct(p)}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href={getLocalizedHref('/catalog')}
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-semibold px-7 py-3.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg"
              >
                <span>{t.goToFullCatalog.replace('{count}', String(products.length))}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ADVANTAGES & SERVICES (MODERN LUXURY TRUST BANNER) */}
        <section className="py-14 sm:py-20 bg-zinc-950 text-white relative overflow-hidden">
          {/* Subtle ambient light effects */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1: Fast Delivery */}
              <div className="group relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400/80 uppercase">
                      01 / EXPRESS
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {t.fastDeliveryTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.fastDeliveryDesc}
                  </p>
                </div>
              </div>

              {/* Feature 2: Official Warranty */}
              <div className="group relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-black transition-all">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400/80 uppercase">
                      02 / GUARANTEE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {t.officialWarrantyTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.officialWarrantyDesc}
                  </p>
                </div>
              </div>

              {/* Feature 3: Installation & Setup */}
              <div className="group relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400/80 uppercase">
                      03 / SERVICE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {t.installationTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.installationDesc}
                  </p>
                </div>
              </div>

              {/* Feature 4: Engineering Support */}
              <div className="group relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-black transition-all">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400/80 uppercase">
                      04 / 24/7 PRO
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {t.engineeringSupportTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.engineeringSupportDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OFFICIAL BRANDS SHOWCASE (WITH VECTOR BRAND LOGOS) */}
        <section className="py-12 sm:py-16 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">{t.officialBrandsTitle}</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {t.officialBrandsSubtitle}
                </p>
              </div>

              <Link
                href={getLocalizedHref('/brands')}
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                {t.allBrands} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topBrands.map(brand => (
                <Link
                  key={brand.id}
                  href={getLocalizedHref(`/catalog?brand=${brand.slug}`)}
                  className="bg-white hover:bg-zinc-900 text-zinc-900 hover:text-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:shadow-xl hover:-translate-y-0.5 min-h-[110px]"
                >
                  <div className="h-9 w-full flex items-center justify-center px-2">
                    <BrandLogo brandName={brand.name} className="h-8 w-auto max-w-[130px] group-hover:text-white" />
                  </div>
                  {brand.productCount && (
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-300 mt-2 font-semibold">
                      {brand.productCount} {t.itemsCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TECH BLOG & GUIDES */}
        <section className="py-12 sm:py-16 bg-white border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">{t.blogTitle}</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {t.blogSubtitle}
                </p>
              </div>

              <Link
                href={getLocalizedHref('/blog')}
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                {t.allArticles} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map(post => {
                const locTitle = translateDescription(post.title);
                const locExcerpt = translateDescription(post.excerpt);
                const locCat = translateCategoryName(post.category);

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-900 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <Link href={getLocalizedHref(`/blog/${post.slug}`)} className="block relative aspect-video overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {locCat}
                          </span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        <Link
                          href={getLocalizedHref(`/blog/${post.slug}`)}
                          className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug"
                        >
                          {locTitle}
                        </Link>

                        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                          {locExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-zinc-100 mt-4">
                      <div className="flex items-center gap-2 pt-3">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-200">
                          <Image src={post.author.avatar} alt="" fill className="object-cover" />
                        </div>
                        <span className="text-xs font-medium text-zinc-700">{post.author.name}</span>
                      </div>

                      <span className="text-xs text-zinc-400 pt-3">{post.date}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
