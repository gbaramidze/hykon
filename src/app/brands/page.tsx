'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';

export default function BrandsPage() {
  const { brands, products } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">Производители и бренды</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950">
            Официальные бренды
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Каталог мировых производителей техники, представленных в магазине Hykon.ge
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map(brand => {
            const count = products.filter(
              p => p.brand.toLowerCase() === brand.name.toLowerCase()
            ).length;

            return (
              <div
                key={brand.id}
                className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-zinc-900 group-hover:text-blue-600 transition-colors font-mono">
                        {brand.name}
                      </h3>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        Страна: {brand.country}
                      </span>
                    </div>

                    <span className="bg-zinc-100 text-zinc-700 text-xs font-mono font-bold px-2.5 py-1 rounded-full">
                      {count} {count === 1 ? 'товар' : 'товаров'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-6">
                    {brand.description}
                  </p>
                </div>

                <Link
                  href={`/catalog?brand=${brand.slug}`}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-zinc-100 text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors"
                >
                  <span>Смотреть всю продукцию {brand.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
