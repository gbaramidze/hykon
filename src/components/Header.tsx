'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Truck,
  PhoneCall,
  Laptop,
  Smartphone,
  Tv,
  Camera,
  Home,
  Gamepad2,
  Sparkles,
  Percent,
  Globe,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/data/translations';
import { Logo } from '@/components/Logo';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { getCategoryIcon } from '@/utils/categoryIcons';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    language,
    setLanguage,
    t,
    translateProductTitle,
    translateCategoryName,
    getLocalizedHref,
  } = useLanguage();
  const {
    products,
    categories,
    cartCount,
    cartTotal,
    compareList,
    wishlist,
    currency,
    setCurrency,
    formatPrice,
  } = useStore();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      router.push(getLocalizedHref(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 w-full">
        {/* Top utility strip (Desktop) */}
        <div className="bg-zinc-950 text-zinc-300 text-xs py-1.5 px-4 hidden md:block border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="flex items-center gap-1.5 text-zinc-200">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {t.freeDeliveryBadge}
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                {t.warrantyBadge}
              </span>
            </div>

            <div className="flex items-center space-x-5">
              <a
                href="tel:+995591432525"
                className="flex items-center gap-1 hover:text-white transition-colors font-mono"
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" />
                +995 591 43 25 25
              </a>

              <div className="h-3 w-px bg-zinc-800" />

              {/* Language Switcher */}
              <div className="flex items-center space-x-1">
                {(['ka', 'en', 'ru'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold uppercase transition-colors ${
                      language === lang
                        ? 'bg-zinc-800 text-white shadow-2xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ka' ? 'GEO' : lang === 'en' ? 'ENG' : 'RUS'}
                  </button>
                ))}
              </div>

              <div className="h-3 w-px bg-zinc-800" />

              {/* Currency selector */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrency('GEL')}
                  className={`px-1.5 py-0.5 rounded font-mono text-[11px] transition-colors ${
                    currency === 'GEL'
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ₾ GEL
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-1.5 py-0.5 rounded font-mono text-[11px] transition-colors ${
                    currency === 'USD'
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 md:py-3.5 w-full">
          {/* Top Row: Logo & Actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 -ml-1 text-zinc-800 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Logo />
            </div>

            {/* Desktop: Catalog Button */}
            <div className="relative hidden md:block" ref={catalogRef}>
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isCatalogOpen
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {isCatalogOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>{t.catalogMenu}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCatalogOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Desktop Mega Menu Dropdown */}
              {isCatalogOpen && (
                <div className="absolute left-0 top-full mt-2 w-[720px] bg-white rounded-2xl shadow-2xl border border-zinc-200 p-5 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-zinc-100">
                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      {t.categories}
                    </span>
                    <Link
                      href={getLocalizedHref('/catalog')}
                      onClick={() => setIsCatalogOpen(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      {t.allProducts} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[440px] overflow-y-auto pr-1">
                    {categories.map(cat => {
                      return (
                        <Link
                          key={cat.id}
                          href={getLocalizedHref(`/catalog/${cat.slug}`)}
                          onClick={() => setIsCatalogOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group text-zinc-800 hover:text-black border border-transparent hover:border-zinc-200"
                        >
                          <span className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="p-2 rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors shrink-0">
                              {getCategoryIcon(cat.icon, cat.id, 'w-4 h-4')}
                            </span>
                            <span className="text-xs font-semibold truncate">{translateCategoryName(cat.name)}</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 placeholder:text-zinc-400 text-xs pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 focus:border-black focus:outline-none transition-all"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-400 hover:text-black absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Desktop Live Suggestions */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-fade-in">
                  {searchResults.length > 0 ? (
                    <div className="p-2 divide-y divide-zinc-100">
                      <div className="px-3 py-1.5 text-[10px] text-zinc-400 font-bold uppercase">
                        {t.searchResults}
                      </div>
                      {searchResults.map(prod => (
                        <Link
                          key={prod.id}
                          href={getLocalizedHref(`/product/${prod.slug}`)}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors group"
                        >
                          <div className="relative w-11 h-11 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden flex-shrink-0 p-1">
                            <Image
                              src={prod.thumbnail || prod.images[0]}
                              alt={prod.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-zinc-400 uppercase">
                              {prod.brand}
                            </div>
                            <div className="text-xs font-semibold text-zinc-900 truncate group-hover:text-blue-600">
                              {translateProductTitle(prod.title)}
                            </div>
                          </div>
                          <div className="text-right font-mono font-bold text-xs text-zinc-950">
                            {formatPrice(prod.price)}
                          </div>
                        </Link>
                      ))}
                      <div className="p-2 bg-zinc-50 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs font-bold text-zinc-900 hover:text-blue-600"
                        >
                          {t.searchResults} «{searchQuery}» →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      {t.noResults}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Icons (Desktop & Mobile Clean Header) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Mobile Language Switcher */}
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 md:hidden">
                {(['ka', 'en', 'ru'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      language === lang ? 'bg-black text-white' : 'text-zinc-600'
                    }`}
                  >
                    {lang === 'ka' ? 'GE' : lang === 'en' ? 'EN' : 'RU'}
                  </button>
                ))}
              </div>

              {/* Desktop Compare */}
              <Link
                href={getLocalizedHref('/compare')}
                className="hidden md:flex relative p-2.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors items-center gap-1.5"
                title={t.compare}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {compareList.length}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-semibold">{t.compare}</span>
              </Link>

              {/* Desktop Wishlist */}
              <Link
                href={getLocalizedHref('/wishlist')}
                className="hidden md:flex relative p-2.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors items-center gap-1.5"
                title={t.wishlist}
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-semibold">{t.wishlist}</span>
              </Link>

              {/* Cart Button (Always Visible) */}
              <Link
                href={getLocalizedHref('/cart')}
                className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-3 py-2 rounded-xl transition-all shadow-xs group shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono animate-fade-in">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold leading-none">
                    {t.cart}
                  </div>
                  <div className="text-xs font-bold font-mono leading-tight">
                    {formatPrice(cartTotal)}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 2: Mobile Search Bar */}
          <div className="mt-2.5 md:hidden relative w-full" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-xs pl-9 pr-9 py-2 rounded-xl focus:outline-none focus:border-black transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-zinc-400 hover:text-black absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Live Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-fade-in">
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-zinc-100">
                    {searchResults.map(prod => (
                      <Link
                        key={prod.id}
                        href={getLocalizedHref(`/product/${prod.slug}`)}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                      >
                        <div className="relative w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden flex-shrink-0 p-1">
                          <Image
                            src={prod.thumbnail || prod.images[0]}
                            alt={prod.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase">
                            {prod.brand}
                          </div>
                          <div className="text-xs font-semibold text-zinc-900 truncate">
                            {translateProductTitle(prod.title)}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-xs text-zinc-950">
                          {formatPrice(prod.price)}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    {t.noResults}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Secondary Navigation Strip (Desktop) */}
        <div className="border-t border-zinc-100 px-4 py-2 bg-white hidden lg:block overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-zinc-600">
            <div className="flex items-center space-x-6">
              <Link
                href={getLocalizedHref('/catalog?filter=bestseller')}
                className="flex items-center gap-1 text-zinc-900 hover:text-blue-600 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t.bestsellers}
              </Link>
              <Link
                href={getLocalizedHref('/catalog?filter=new')}
                className="text-zinc-800 hover:text-black transition-colors"
              >
                {t.newArrivals}
              </Link>
              <Link
                href={getLocalizedHref('/catalog?filter=discount')}
                className="text-rose-600 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Percent className="w-3.5 h-3.5" />
                {t.discounts}
              </Link>
              <Link href={getLocalizedHref('/brands')} className="hover:text-black transition-colors">
                {t.brands}
              </Link>
              <Link href={getLocalizedHref('/blog')} className="hover:text-black transition-colors">
                {t.blog}
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-zinc-500">
              <Link href={getLocalizedHref('/delivery')} className="hover:text-black transition-colors">
                {t.deliveryAndPayment}
              </Link>
              <Link href={getLocalizedHref('/warranty')} className="hover:text-black transition-colors">
                {t.warrantyAndService}
              </Link>
              <Link href={getLocalizedHref('/contacts')} className="hover:text-black transition-colors">
                {t.contacts}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden flex animate-fade-in">
            <div className="bg-white w-4/5 max-w-sm h-full flex flex-col p-5 overflow-y-auto shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                <Logo />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Picker in Drawer */}
              <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 mb-4">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  {t.switchLanguage}:
                </span>
                <div className="flex items-center gap-1">
                  {(['ka', 'en', 'ru'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-bold uppercase transition-colors ${
                        language === lang
                          ? 'bg-black text-white shadow-2xs'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {lang === 'ka' ? 'GEO' : lang === 'en' ? 'ENG' : 'RUS'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Content */}
              <div className="space-y-4 flex-1">
                <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider">
                  {t.catalogMenu}
                </div>

                <div className="space-y-1">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={getLocalizedHref(`/catalog/${cat.slug}`)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 text-xs font-semibold text-zinc-900 hover:text-blue-600 border-b border-zinc-100 last:border-0 group"
                    >
                      <span className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors shrink-0">
                          {getCategoryIcon(cat.icon, cat.id, 'w-3.5 h-3.5')}
                        </span>
                        <span className="truncate">{translateCategoryName(cat.name)}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-1 text-xs">
                  <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
                    {t.quickLinks}
                  </div>
                  <Link
                    href={getLocalizedHref('/brands')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    {t.brands}
                  </Link>
                  <Link
                    href={getLocalizedHref('/blog')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    {t.blog}
                  </Link>
                  <Link
                    href={getLocalizedHref('/delivery')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    {t.deliveryAndPayment}
                  </Link>
                  <Link
                    href={getLocalizedHref('/warranty')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    {t.warrantyAndService}
                  </Link>
                  <Link
                    href={getLocalizedHref('/contacts')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    {t.contacts}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <MobileBottomNav onOpenCatalogDrawer={() => setIsMobileMenuOpen(true)} />
    </>
  );
};
