'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Percent,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function HomePage() {
  const { products, categories, brands, blogPosts, formatPrice } = useStore();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'discount'>('bestseller');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const rootCategories = categories.filter(c => c.level === 1 || !c.parentId);

  // Filter products by active tab
  const tabProducts = products.filter(p => {
    if (activeTab === 'bestseller') return p.isBestseller;
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'discount') return p.oldPrice && p.oldPrice > p.price;
    return true;
  });

  const featuredHeroProduct = products.find(p => p.id === 'prod-macbook-pro-16-m3-max') || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-200 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Text & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Флагманская коллекция 2026</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.1]">
                  Чистая мощь. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500">
                    Без компромиссов.
                  </span>
                </h1>

                <p className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl">
                  Премиальная техника Apple, ASUS ROG, Sony и Dyson с официальной гарантией. Бесплатная экспресс-доставка по Тбилиси в день заказа.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/catalog"
                    className="bg-black hover:bg-zinc-800 text-white px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <span>Перейти в каталог</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/catalog/computers-laptops"
                    className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Apple & Компьютеры
                  </Link>
                </div>

                {/* Micro guarantees */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200/80 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Доставка от 150 ₾ бесплатно</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Гарантия до 3 лет</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>14 дней на возврат</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Showcase Product Card */}
              {featuredHeroProduct && (
                <div className="lg:col-span-6">
                  <div className="relative bg-white rounded-2xl border border-zinc-200 p-8 shadow-2xl hover:border-zinc-900 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        {featuredHeroProduct.brand} • Выбор экспертов
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold px-2.5 py-1 rounded">
                        В наличии
                      </span>
                    </div>

                    <div className="relative aspect-video w-full mb-6">
                      <Image
                        src={featuredHeroProduct.thumbnail || featuredHeroProduct.images[0]}
                        alt={featuredHeroProduct.title}
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-zinc-900">
                        {featuredHeroProduct.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {featuredHeroProduct.shortDescription}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <div>
                          <div className="text-xs text-zinc-400">Цена со скидкой</div>
                          <div className="text-2xl font-extrabold text-zinc-900 font-mono">
                            {formatPrice(featuredHeroProduct.price)}
                          </div>
                        </div>

                        <Link
                          href={`/product/${featuredHeroProduct.slug}`}
                          className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          Подробнее <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CATEGORY GRID EXPLORER */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Категории техники</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Большой ассортимент с быстрой фильтрацией по характеристикам
                </p>
              </div>

              <Link
                href="/catalog"
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1"
              >
                Все категории <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rootCategories.map(cat => {
                const subCats = categories.filter(c => c.parentId === cat.id).slice(0, 3);
                return (
                  <div
                    key={cat.id}
                    className="group relative bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-200 hover:border-zinc-900 p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <Link
                            href={`/catalog/${cat.slug}`}
                            className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors block"
                          >
                            {cat.name}
                          </Link>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Subcategories quick list */}
                      {subCats.length > 0 && (
                        <div className="space-y-1 my-3">
                          {subCats.map(sub => (
                            <Link
                              key={sub.id}
                              href={`/catalog/${sub.slug}`}
                              className="text-xs text-zinc-600 hover:text-black block hover:underline"
                            >
                              • {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mt-4 bg-white border border-zinc-100">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT SHOWCASE TABS */}
        <section className="py-16 bg-zinc-50 border-y border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            {/* Tab Headers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Популярные товары</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Актуальные позиции с гарантией и доставкой
                </p>
              </div>

              <div className="flex items-center bg-white p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'bestseller'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Хиты продаж
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'new'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Новинки 2026
                </button>
                <button
                  onClick={() => setActiveTab('discount')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'discount'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  Суперскидки
                </button>
              </div>
            </div>

            {/* Products Grid */}
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
                href="/catalog"
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 font-semibold px-6 py-3 rounded-xl text-xs transition-colors"
              >
                <span>Смотреть весь каталог техники ({products.length} позиций)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* BRANDS SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Официальные бренды</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Прямые поставки оригинальной продукции с официальной гарантией
                </p>
              </div>

              <Link
                href="/brands"
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1"
              >
                Все производители <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  href={`/catalog?brand=${brand.slug}`}
                  className="bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-black rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all group hover:shadow-md"
                >
                  <div className="font-extrabold text-sm text-zinc-800 group-hover:text-black font-mono">
                    {brand.name}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {brand.country}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TECH BLOG & BUYING GUIDES */}
        <section className="py-16 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Блог и экспертные обзоры</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Тесты новинок, сравнения железа и полезные инструкции
                </p>
              </div>

              <Link
                href="/blog"
                className="text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1"
              >
                Все статьи <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map(post => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-900 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
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
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug"
                      >
                        {post.title}
                      </Link>

                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-zinc-100 mt-4">
                    <div className="flex items-center gap-2 pt-3">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-200">
                        <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-zinc-700">{post.author.name}</span>
                    </div>

                    <span className="text-xs text-zinc-400 pt-3">{post.date}</span>
                  </div>
                </article>
              ))}
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
