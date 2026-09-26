'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function WishlistPage() {
  const { wishlist, products } = useStore();
  const { language, t, getLocalizedHref } = useLanguage();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  const wishlistLabels = {
    ka: {
      subtitle: `შენახული პროდუქტების სია (${savedProducts.length})`,
      emptyTitle: 'რჩეულების სია ცარიელია',
      emptyDesc: 'შეინახეთ თქვენთვის საინტერესო პროდუქცია, რათა სწრაფად დაუბრუნდეთ მათ შეძენას.',
      goToCatalog: 'კატალოგში გადასვლა',
    },
    en: {
      subtitle: `Saved products list (${savedProducts.length})`,
      emptyTitle: 'Your wishlist is empty',
      emptyDesc: 'Save products you like to easily find and purchase them later.',
      goToCatalog: 'Browse Catalog',
    },
    ru: {
      subtitle: `Список отложенных товаров (${savedProducts.length})`,
      emptyTitle: 'Ваш список избранного пуст',
      emptyDesc: 'Сохраняйте понравившиеся товары, чтобы не потерять их и вернуться к покупке в любое удобное время.',
      goToCatalog: 'Перейти в каталог',
    },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 flex items-center gap-3">
              <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
              <span>{t.wishlist}</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {wishlistLabels.subtitle}
            </p>
          </div>
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-16 text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">{wishlistLabels.emptyTitle}</h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              {wishlistLabels.emptyDesc}
            </p>
            <div className="pt-2">
              <Link
                href={getLocalizedHref('/catalog')}
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                <span>{wishlistLabels.goToCatalog}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
