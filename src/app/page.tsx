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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* INTERACTIVE HERO SHOWCASE */}
        <HeroSection products={products} />

        {/* ACTIVE CATEGORIES EXPLORER (EMPTY HIDDEN) */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-950">{t.categories}</h2>
                <p className="text-xs text-zinc-500 mt-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRootCategories.map(cat => {
                const subCats = categories.filter(
                  c => c.parentId === cat.id && (c.productCount === undefined || c.productCount > 0)
                ).slice(0, 3);

                return (
                  <div
                    key={cat.id}
                    className="group relative bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-200 hover:border-zinc-900 p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <Link
                          href={getLocalizedHref(`/catalog/${cat.slug}`)}
                          className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors block"
                        >
                          {translateCategoryName(cat.name)}
                        </Link>
                        <span className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                          {getCategoryIcon(cat.icon, cat.id, 'w-5 h-5')}
                        </span>
                      </div>

                      {/* Subcategories quick links */}
                      {subCats.length > 0 && (
                        <div className="space-y-1.5 my-3">
                          {subCats.map(sub => (
                            <Link
                              key={sub.id}
                              href={getLocalizedHref(`/catalog/${sub.slug}`)}
                              className="text-xs text-zinc-600 hover:text-black block hover:underline"
                            >
                              • {translateCategoryName(sub.name)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between mt-4">
                      <Link
                        href={getLocalizedHref(`/catalog/${cat.slug}`)}
                        className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        {t.allProducts} <ArrowRight className="w-3.5 h-3.5" />
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
                <h2 className="text-2xl font-bold text-zinc-950">{t.featuredProductsTitle}</h2>
                <p className="text-xs text-zinc-500 mt-1">
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

        {/* ADVANTAGES & SERVICES */}
        <section className="py-12 sm:py-16 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 hover:border-zinc-900 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{t.fastDeliveryTitle}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {t.fastDeliveryDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 hover:border-zinc-900 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{t.officialWarrantyTitle}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {t.officialWarrantyDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 hover:border-zinc-900 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{t.installationTitle}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {t.installationDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 hover:border-zinc-900 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{t.engineeringSupportTitle}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {t.engineeringSupportDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BRANDS CAROUSEL */}
        <section className="py-12 sm:py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-950">{t.officialBrandsTitle}</h2>
                <p className="text-xs text-zinc-500 mt-1">
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

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  href={getLocalizedHref(`/catalog?brand=${brand.slug}`)}
                  className="bg-white hover:bg-black text-zinc-900 hover:text-white border border-zinc-200 hover:border-black rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all group hover:shadow-md"
                >
                  <div className="font-extrabold text-sm font-mono group-hover:text-white">
                    {brand.name}
                  </div>
                  {brand.productCount && (
                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 mt-1 font-mono">
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
                <h2 className="text-2xl font-bold text-zinc-950">{t.blogTitle}</h2>
                <p className="text-xs text-zinc-500 mt-1">
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
