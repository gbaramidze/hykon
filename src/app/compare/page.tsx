'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SlidersHorizontal,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCart, formatPrice } = useStore();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Collect all unique spec groups and names across all items in compareList
  const comparisonStructure = useMemo(() => {
    const groupsMap = new Map<string, Set<string>>();

    compareList.forEach(prod => {
      prod.specGroups?.forEach(group => {
        if (!groupsMap.has(group.group)) {
          groupsMap.set(group.group, new Set<string>());
        }
        group.items?.forEach(item => {
          groupsMap.get(group.group)!.add(item.name);
        });
      });
    });

    return Array.from(groupsMap.entries()).map(([groupName, specNamesSet]) => ({
      groupName,
      specNames: Array.from(specNamesSet),
    }));
  }, [compareList]);

  // Helper to find a specific spec value for a product
  const getProductSpecValue = (product: Product, groupName: string, specName: string): string => {
    const group = product.specGroups?.find(g => g.group === groupName);
    if (!group) return '—';
    const item = group.items?.find(i => i.name.toLowerCase() === specName.toLowerCase());
    return item ? item.value : '—';
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8 w-full max-w-full overflow-hidden">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">Сравнение товаров</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 flex items-center gap-3">
              <SlidersHorizontal className="w-7 h-7" />
              <span>Сравнение товаров</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Наглядное сравнение технических характеристик и цен моделей
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDifferences}
                  onChange={e => setOnlyDifferences(e.target.checked)}
                  className="rounded border-zinc-300 text-black focus:ring-black h-4 w-4"
                />
                <span>Показывать только различия</span>
              </label>

              <button
                onClick={clearCompare}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Очистить список ({compareList.length})
              </button>
            </div>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-16 text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">
              Список сравнения пуст
            </h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              Добавляйте интересующие товары в сравнение с помощью иконки на карточке товара или на странице с подробным описанием.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                <span>Перейти в каталог товаров</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-8 w-full max-w-full">
            <div className="min-w-[700px] border border-zinc-200 rounded-2xl bg-white shadow-xs overflow-hidden">
              {/* Top Products Grid */}
              <div
                className="grid divide-x divide-zinc-200 border-b border-zinc-200 bg-zinc-50/50"
                style={{
                  gridTemplateColumns: `240px repeat(${compareList.length}, minmax(240px, 1fr))`,
                }}
              >
                {/* Column header cell */}
                <div className="p-6 flex flex-col justify-end">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Товары в сравнении ({compareList.length}/4)
                  </div>
                  <Link
                    href="/catalog"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-2 block"
                  >
                    + Добавить еще товар
                  </Link>
                </div>

                {/* Product cards in header */}
                {compareList.map(prod => {
                  const isAdded = addedIds.includes(prod.id);
                  return (
                    <div key={prod.id} className="p-6 bg-white relative flex flex-col justify-between">
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                        title="Удалить из сравнения"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div>
                        {/* Image */}
                        <div className="relative aspect-square w-32 h-32 mx-auto mb-4">
                          <Image
                            src={prod.thumbnail || prod.images[0]}
                            alt={prod.title}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-1">
                          {prod.brand}
                        </div>

                        <Link
                          href={`/product/${prod.slug}`}
                          className="text-xs font-bold text-zinc-900 hover:text-blue-600 line-clamp-2 mb-2 leading-snug"
                        >
                          {prod.title}
                        </Link>

                        <div className="text-base font-extrabold text-zinc-950 font-mono mb-3">
                          {formatPrice(prod.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(prod)}
                        disabled={!prod.inStock}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : prod.inStock
                            ? 'bg-black hover:bg-zinc-800 text-white'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> В корзине
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> В корзину
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Specs Rows */}
              {comparisonStructure.map((group, groupIdx) => (
                <div key={groupIdx} className="border-b border-zinc-200">
                  {/* Group Header */}
                  <div className="bg-zinc-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
                    {group.groupName}
                  </div>

                  {/* Group Items */}
                  {group.specNames.map((specName, specIdx) => {
                    const values = compareList.map(p => getProductSpecValue(p, group.groupName, specName));
                    const allSame = values.every(v => v.toLowerCase() === values[0].toLowerCase());

                    if (onlyDifferences && allSame) {
                      return null;
                    }

                    return (
                      <div
                        key={specIdx}
                        className="grid divide-x divide-zinc-200 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors"
                        style={{
                          gridTemplateColumns: `240px repeat(${compareList.length}, minmax(240px, 1fr))`,
                        }}
                      >
                        <div className="p-4 text-xs font-medium text-zinc-500 bg-zinc-50/40">
                          {specName}
                        </div>

                        {compareList.map(p => {
                          const val = getProductSpecValue(p, group.groupName, specName);
                          return (
                            <div
                              key={p.id}
                              className={`p-4 text-xs text-zinc-900 ${
                                !allSame && compareList.length > 1 ? 'font-semibold bg-amber-50/20' : ''
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
