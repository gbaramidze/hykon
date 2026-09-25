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
  Settings,
  Percent,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Logo } from '@/components/Logo';
import { MobileBottomNav } from '@/components/MobileBottomNav';

const ICON_MAP: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Tv: <Tv className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
};

export const Header: React.FC = () => {
  const router = useRouter();
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
  const [activeRootCategory, setActiveRootCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const rootCategories = categories.filter(c => c.level === 1 || !c.parentId);

  useEffect(() => {
    if (rootCategories.length > 0 && !activeRootCategory) {
      setActiveRootCategory(rootCategories[0].id);
    }
  }, [rootCategories, activeRootCategory]);

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
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeRoot = rootCategories.find(c => c.id === activeRootCategory);
  const subCategories = categories.filter(c => c.parentId === activeRootCategory);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 w-full">
        {/* Top utility strip (Desktop) */}
        <div className="bg-zinc-950 text-zinc-300 text-xs py-1.5 px-4 hidden md:block border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="flex items-center gap-1.5 text-zinc-200">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                Бесплатная доставка по всей Грузии от 150 ₾
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Официальная гарантия до 36 мес.
              </span>
            </div>

            <div className="flex items-center space-x-5">
              <a
                href="tel:+995322005599"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-zinc-400" />
                +995 (32) 200-55-99
              </a>

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

              <div className="h-3 w-px bg-zinc-800" />

              <Link
                href="/admin"
                className="flex items-center gap-1 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-[11px] font-medium transition-all"
              >
                <Settings className="w-3 h-3 text-zinc-400" />
                Админ панель
              </Link>
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
                aria-label="Открыть меню"
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
                <span>Каталог товаров</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCatalogOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Desktop Mega Menu Dropdown */}
              {isCatalogOpen && (
                <div className="absolute left-0 top-full mt-2 w-[860px] bg-white rounded-2xl shadow-2xl border border-zinc-200 p-0 overflow-hidden z-50 flex divide-x divide-zinc-100 animate-fade-in">
                  <div className="w-64 bg-zinc-50 p-3 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Разделы техники
                    </div>
                    {rootCategories.map(cat => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveRootCategory(cat.id)}
                        onClick={() => {
                          setIsCatalogOpen(false);
                          router.push(`/catalog/${cat.slug}`);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          activeRootCategory === cat.id
                            ? 'bg-white text-black shadow-xs font-bold'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-zinc-600">
                            {cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : <Laptop className="w-4 h-4" />}
                          </span>
                          <span>{cat.name}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[460px]">
                    {activeRoot ? (
                      <div>
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                          <div>
                            <h3 className="text-base font-bold text-zinc-950">{activeRoot.name}</h3>
                            <p className="text-xs text-zinc-500">{activeRoot.description}</p>
                          </div>
                          <Link
                            href={`/catalog/${activeRoot.slug}`}
                            onClick={() => setIsCatalogOpen(false)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            Смотреть все <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {subCategories.length > 0 ? (
                          <div className="grid grid-cols-2 gap-6">
                            {subCategories.map(sub => {
                              const level3 = categories.filter(c => c.parentId === sub.id);
                              return (
                                <div key={sub.id} className="space-y-2">
                                  <Link
                                    href={`/catalog/${sub.slug}`}
                                    onClick={() => setIsCatalogOpen(false)}
                                    className="text-xs font-bold text-zinc-900 hover:text-blue-600 block transition-colors"
                                  >
                                    {sub.name}
                                  </Link>

                                  {level3.length > 0 && (
                                    <ul className="space-y-1.5">
                                      {level3.map(l3 => (
                                        <li key={l3.id}>
                                          <Link
                                            href={`/catalog/${l3.slug}`}
                                            onClick={() => setIsCatalogOpen(false)}
                                            className="text-xs text-zinc-600 hover:text-black hover:underline transition-colors block"
                                          >
                                            {l3.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 py-8 text-center">
                            В этой категории нет вложенных подразделов.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Поиск техники: MacBook, iPhone 16, RTX 4090, Dyson..."
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
                        Найдено в каталоге
                      </div>
                      {searchResults.map(prod => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
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
                              {prod.title}
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
                          Все результаты для «{searchQuery}» →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      По запросу «{searchQuery}» ничего не найдено.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Icons (Desktop & Mobile Clean Header) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Mobile Currency Pill */}
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 md:hidden">
                <button
                  onClick={() => setCurrency('GEL')}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    currency === 'GEL' ? 'bg-black text-white font-bold' : 'text-zinc-600'
                  }`}
                >
                  ₾
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    currency === 'USD' ? 'bg-black text-white font-bold' : 'text-zinc-600'
                  }`}
                >
                  $
                </button>
              </div>

              {/* Desktop Compare */}
              <Link
                href="/compare"
                className="hidden md:flex relative p-2.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors items-center gap-1.5"
                title="Сравнение товаров"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {compareList.length}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-semibold">Сравнение</span>
              </Link>

              {/* Desktop Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex relative p-2.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors items-center gap-1.5"
                title="Избранное"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-semibold">Избранное</span>
              </Link>

              {/* Cart Button (Always Visible) */}
              <Link
                href="/cart"
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
                    Корзина
                  </div>
                  <div className="text-xs font-bold font-mono leading-tight">
                    {formatPrice(cartTotal)}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 2: Mobile Search Bar (Spacious and 100% width on Phones) */}
          <div className="mt-2.5 md:hidden relative w-full" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Поиск в каталоге: MacBook, iPhone 16..."
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
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-fade-in">
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-zinc-100">
                    {searchResults.map(prod => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                      >
                        <div className="relative w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden flex-shrink-0 p-1">
                          <Image src={prod.thumbnail || prod.images[0]} alt="" fill className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 truncate">
                            {prod.title}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {formatPrice(prod.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-2 bg-zinc-50 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-zinc-900"
                      >
                        Смотреть все ({searchResults.length}) →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    Ничего не найдено
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
                href="/catalog?filter=bestseller"
                className="flex items-center gap-1 text-zinc-900 hover:text-blue-600 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Хиты продаж
              </Link>
              <Link
                href="/catalog?filter=new"
                className="text-zinc-800 hover:text-black transition-colors"
              >
                Новинки 2026
              </Link>
              <Link
                href="/catalog?filter=discount"
                className="text-rose-600 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Percent className="w-3.5 h-3.5" />
                Скидки и акции
              </Link>
              <Link href="/brands" className="hover:text-black transition-colors">
                Бренды
              </Link>
              <Link href="/blog" className="hover:text-black transition-colors">
                Блог и обзоры
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-zinc-500">
              <Link href="/delivery" className="hover:text-black transition-colors">
                Доставка и оплата
              </Link>
              <Link href="/warranty" className="hover:text-black transition-colors">
                Гарантия и сервис
              </Link>
              <Link href="/contacts" className="hover:text-black transition-colors">
                Шоурум и контакты
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

              {/* Drawer Content */}
              <div className="space-y-4 flex-1">
                <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider">
                  Каталог категорий
                </div>

                <div className="space-y-1">
                  {rootCategories.map(root => {
                    const subCats = categories.filter(c => c.parentId === root.id);
                    const isExpanded = mobileExpandedCat === root.id;

                    return (
                      <div key={root.id} className="border-b border-zinc-100 last:border-0 pb-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/catalog/${root.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 py-2 text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-2"
                          >
                            <span>{root.icon && ICON_MAP[root.icon] ? ICON_MAP[root.icon] : <Laptop className="w-4 h-4 text-zinc-500" />}</span>
                            <span>{root.name}</span>
                          </Link>

                          {subCats.length > 0 && (
                            <button
                              onClick={() => setMobileExpandedCat(isExpanded ? null : root.id)}
                              className="p-2 text-zinc-400 hover:text-black"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-black' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Subcategories Accordion */}
                        {isExpanded && subCats.length > 0 && (
                          <div className="pl-6 space-y-1.5 py-2 border-l-2 border-zinc-200 ml-2 animate-fade-in">
                            {subCats.map(sub => (
                              <Link
                                key={sub.id}
                                href={`/catalog/${sub.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-xs text-zinc-600 hover:text-black font-medium py-1"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-1 text-xs">
                  <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
                    Навигация
                  </div>
                  <Link
                    href="/brands"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    Все бренды
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    Блог и обзоры техники
                  </Link>
                  <Link
                    href="/delivery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    Доставка и способы оплаты
                  </Link>
                  <Link
                    href="/contacts"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium text-zinc-800"
                  >
                    Контакты и шоурум в Тбилиси
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 font-bold text-blue-600 bg-blue-50 rounded-xl mt-3 text-center"
                  >
                    ⚙️ Панель администратора
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
