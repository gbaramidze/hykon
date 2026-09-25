'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface MobileBottomNavProps {
  onOpenCatalogDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCatalogDrawer,
}) => {
  const pathname = usePathname();
  const { cartCount, compareList, wishlist } = useStore();

  const isCompare = pathname === '/compare';
  const isWishlist = pathname === '/wishlist';
  const isCart = pathname === '/cart' || pathname === '/checkout';
  const isHome = pathname === '/';
  const isCatalog = pathname.startsWith('/catalog');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full py-1 rounded-lg transition-colors ${
            isHome ? 'text-black font-bold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Главная</span>
        </Link>

        {/* 2. Catalog */}
        <button
          onClick={onOpenCatalogDrawer}
          className={`flex flex-col items-center justify-center w-full py-1 rounded-lg transition-colors ${
            isCatalog ? 'text-black font-bold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <Layers className={`w-5 h-5 ${isCatalog ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Каталог</span>
        </button>

        {/* 3. Compare */}
        <Link
          href="/compare"
          className={`relative flex flex-col items-center justify-center w-full py-1 rounded-lg transition-colors ${
            isCompare ? 'text-black font-bold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <div className="relative">
            <SlidersHorizontal
              className={`w-5 h-5 ${isCompare ? 'stroke-[2.5]' : 'stroke-[1.8]'}`}
            />
            {compareList.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {compareList.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Сравнение</span>
        </Link>

        {/* 4. Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center w-full py-1 rounded-lg transition-colors ${
            isWishlist ? 'text-rose-600 font-bold' : 'text-zinc-500 hover:text-rose-600'
          }`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                isWishlist ? 'stroke-[2.5] fill-rose-600' : 'stroke-[1.8]'
              }`}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Избранное</span>
        </Link>

        {/* 5. Cart */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center w-full py-1 rounded-lg transition-colors ${
            isCart ? 'text-black font-bold' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 ${isCart ? 'stroke-[2.5]' : 'stroke-[1.8]'}`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono animate-fade-in">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Корзина</span>
        </Link>
      </div>
    </div>
  );
};
