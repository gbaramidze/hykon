'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  Grid,
  List,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { Product } from '@/types';

interface CatalogViewProps {
  initialCategorySlug?: string;
  initialQuery?: string;
  initialBrand?: string;
  initialFilter?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategorySlug,
  initialQuery,
  initialBrand,
  initialFilter,
}) => {
  const { products, categories, brands, formatPrice } = useStore();
  const { language, t, translateCategoryName, getLocalizedHref } = useLanguage();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    initialCategorySlug || null
  );

  // Synchronize state if initialCategorySlug prop changes
  useEffect(() => {
    if (initialCategorySlug !== undefined) {
      setSelectedCategorySlug(initialCategorySlug || null);
    }
  }, [initialCategorySlug]);

  // Update browser URL dynamically when category changes
  const handleSelectCategory = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    const targetPath = slug ? `/catalog/${slug}` : '/catalog';
    const localizedUrl = getLocalizedHref(targetPath);

    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const searchStr = currentParams.toString() ? `?${currentParams.toString()}` : '';
      window.history.pushState(null, '', `${localizedUrl}${searchStr}`);
    }
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const catIndex = pathParts.indexOf('catalog');
      if (catIndex !== -1 && pathParts[catIndex + 1]) {
        setSelectedCategorySlug(pathParts[catIndex + 1]);
      } else {
        setSelectedCategorySlug(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand.toLowerCase()] : []
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(initialFilter === 'discount');
  const [isNewOnly, setIsNewOnly] = useState(initialFilter === 'new');
  const [isBestsellerOnly, setIsBestsellerOnly] = useState(initialFilter === 'bestseller');

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [brandSearch, setBrandSearch] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const catalogTopRef = useRef<HTMLDivElement>(null);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategorySlug,
    selectedBrands,
    searchQuery,
    minPrice,
    maxPrice,
    inStockOnly,
    discountOnly,
    isNewOnly,
    isBestsellerOnly,
    sortBy,
    pageSize,
  ]);

  // Active Category resolution
  const decodedCatSlug = selectedCategorySlug ? decodeURIComponent(selectedCategorySlug) : null;
  const currentCategory = categories.find(
    c =>
      c.slug === selectedCategorySlug ||
      c.slug === decodedCatSlug ||
      c.id === selectedCategorySlug ||
      c.name === decodedCatSlug ||
      (decodedCatSlug && decodedCatSlug.includes(c.name))
  );

  // If a legacy Georgian slug was in the URL, automatically normalize to the clean Latin slug
  useEffect(() => {
    if (selectedCategorySlug && currentCategory && selectedCategorySlug !== currentCategory.slug) {
      handleSelectCategory(currentCategory.slug);
    }
  }, [selectedCategorySlug, currentCategory]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategorySlug && currentCategory) {
        if (p.categoryId !== currentCategory.id) {
          const matchPath = p.categoryPath?.some(cp => cp.id === currentCategory.id || cp.slug === selectedCategorySlug);
          if (!matchPath) return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(
          b => b.toLowerCase() === p.brand.toLowerCase()
        );
        if (!brandMatch) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesSku && !matchesDesc) return false;
      }

      // Price range
      if (minPrice !== '' && p.price < Number(minPrice)) return false;
      if (maxPrice !== '' && p.price > Number(maxPrice)) return false;

      // In stock
      if (inStockOnly && !p.inStock) return false;

      // Discounts
      if (discountOnly && (!p.oldPrice || p.oldPrice <= p.price)) return false;

      // New
      if (isNewOnly && !p.isNew) return false;

      // Bestseller
      if (isBestsellerOnly && !p.isBestseller) return false;

      return true;
    });
  }, [
    products,
    selectedCategorySlug,
    currentCategory,
    selectedBrands,
    searchQuery,
    minPrice,
    maxPrice,
    inStockOnly,
    discountOnly,
    isNewOnly,
    isBestsellerOnly,
  ]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [filteredProducts, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedProducts.length);

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smart pagination items with ellipsis (e.g. 1 ... 4 5 6 ... 44)
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range: (number | 'ellipsis')[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
      ) {
        range.push(i);
      } else if (
        (i === safeCurrentPage - delta - 1 && i > 1) ||
        (i === safeCurrentPage + delta + 1 && i < totalPages)
      ) {
        range.push('ellipsis');
      }
    }

    return range.filter((item, idx, arr) => {
      if (item === 'ellipsis' && arr[idx - 1] === 'ellipsis') return false;
      return true;
    });
  }, [totalPages, safeCurrentPage]);

  // Brand toggle
  const toggleBrand = (brandSlug: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandSlug)
        ? prev.filter(b => b !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const clearAllFilters = () => {
    handleSelectCategory(null);
    setSelectedBrands([]);
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setDiscountOnly(false);
    setIsNewOnly(false);
    setIsBestsellerOnly(false);
  };

  const hasActiveFilters =
    Boolean(selectedCategorySlug) ||
    selectedBrands.length > 0 ||
    Boolean(searchQuery) ||
    minPrice !== '' ||
    maxPrice !== '' ||
    inStockOnly ||
    discountOnly ||
    isNewOnly ||
    isBestsellerOnly;

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6 overflow-x-auto">
        <Link href={getLocalizedHref('/')} className="hover:text-black">
          {t.allProducts === 'ყველა პროდუქტი' ? 'მთავარი' : language === 'en' ? 'Home' : 'Главная'}
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
        <Link
          href={getLocalizedHref('/catalog')}
          onClick={() => handleSelectCategory(null)}
          className={`hover:text-black ${!selectedCategorySlug ? 'text-black font-bold' : ''}`}
        >
          {t.catalog}
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="text-black font-semibold truncate">
              {translateCategoryName(currentCategory.name)}
            </span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            {currentCategory ? translateCategoryName(currentCategory.name) : t.catalogMenu}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {t.showing} {sortedProducts.length} {t.of} {products.length} {t.allProducts}
          </p>
        </div>

        {/* Top Controls: Sorting & View Mode & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.categories} {hasActiveFilters && '(+)'}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 hidden sm:inline">{t.sortBy}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
            >
              <option value="popular">{t.sortPopular}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
              <option value="newest">{t.sortNewest}</option>
              <option value="rating">{t.sortRating}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-zinc-500 hover:text-black'
              }`}
              title="Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-zinc-500 hover:text-black'
              }`}
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block space-y-6">
          {/* Active filters pill list */}
          {hasActiveFilters && (
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  {t.categories}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> {t.resetFilters}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    {translateCategoryName(currentCategory.name)}
                    <button onClick={() => handleSelectCategory(null)} className="cursor-pointer">
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                )}
                {selectedBrands.map(bSlug => (
                  <span
                    key={bSlug}
                    className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800 uppercase"
                  >
                    {bSlug}
                    <button onClick={() => toggleBrand(bSlug)} className="cursor-pointer">
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    {t.onlyInStock}
                    <button onClick={() => setInStockOnly(false)} className="cursor-pointer">
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                )}
                {discountOnly && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    {t.onlyDiscount}
                    <button onClick={() => setDiscountOnly(false)} className="cursor-pointer">
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              {t.categories}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectCategory(null)}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                  !selectedCategorySlug
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.allCategories}</span>
              </button>

              {categories.map(cat => {
                const isSelected = selectedCategorySlug === cat.slug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(isSelected ? null : cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-2 rounded-lg font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="shrink-0">
                      {getCategoryIcon(cat.icon, cat.id, 'w-4 h-4')}
                    </span>
                    <span className="truncate">{translateCategoryName(cat.name)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              {t.price}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">{t.priceFrom}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">{t.priceTo}</label>
                <input
                  type="number"
                  placeholder="20000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              {t.filterByBrand}
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchBrand}
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 pl-7 pr-2 py-1.5 rounded-lg text-xs focus:outline-none focus:border-black"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredBrands.map(b => {
                const isChecked = selectedBrands.includes(b.slug.toLowerCase());
                return (
                  <label
                    key={b.id}
                    className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(b.slug.toLowerCase())}
                      className="rounded border-zinc-300 text-black focus:ring-black h-3.5 w-3.5"
                    />
                    <span className="font-medium">{b.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Availability & Flags */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white space-y-2.5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
              {t.specifications}
            </h3>
            <label className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded border-zinc-300 text-black focus:ring-black h-3.5 w-3.5"
              />
              <span>{t.onlyInStock}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer select-none">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={e => setDiscountOnly(e.target.checked)}
                className="rounded border-zinc-300 text-black focus:ring-black h-3.5 w-3.5"
              />
              <span>{t.onlyDiscount}</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS LIST / GRID */}
        <div className="md:col-span-3 space-y-8">
          <div ref={catalogTopRef} className="scroll-mt-28" />

          {sortedProducts.length > 0 ? (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5'
                    : 'space-y-3.5'
                }
              >
                {paginatedProducts.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    viewMode={viewMode}
                    onQuickView={p => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Info & Items Per Page */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 order-2 sm:order-1">
                    <span>
                      {t.showing} <strong className="text-zinc-900 font-semibold">{startIndex + 1}–{endIndex}</strong> {t.of}{' '}
                      <strong className="text-zinc-900 font-semibold">{sortedProducts.length}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
                      <span className="text-zinc-400">{t.perPage}</span>
                      {[24, 48, 96].map(size => (
                        <button
                          key={size}
                          onClick={() => setPageSize(size)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            pageSize === size
                              ? 'bg-zinc-900 text-white font-bold'
                              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1.5 order-1 sm:order-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        safeCurrentPage <= 1
                          ? 'border-zinc-200 text-zinc-300 cursor-not-allowed bg-zinc-50'
                          : 'border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-100 bg-white shadow-2xs'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Page Numbers */}
                    {paginationRange.map((pageItem, idx) => {
                      if (pageItem === 'ellipsis') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-zinc-400 text-xs select-none">
                            …
                          </span>
                        );
                      }

                      const isCurrent = pageItem === safeCurrentPage;
                      return (
                        <button
                          key={pageItem}
                          onClick={() => goToPage(pageItem)}
                          className={`min-w-[36px] h-9 rounded-lg text-xs font-semibold font-mono transition-colors ${
                            isCurrent
                              ? 'bg-zinc-950 text-white shadow-xs font-bold'
                              : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-black'
                          }`}
                        >
                          {pageItem}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(safeCurrentPage + 1)}
                      disabled={safeCurrentPage >= totalPages}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        safeCurrentPage >= totalPages
                          ? 'border-zinc-200 text-zinc-300 cursor-not-allowed bg-zinc-50'
                          : 'border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-100 bg-white shadow-2xs'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-12 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-zinc-900">
                {t.notFound}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {t.notFoundDesc}
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                {t.resetFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex justify-end md:hidden">
          <div className="bg-white w-4/5 max-w-md h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-zinc-900">{t.categories}</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Category selector */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">{t.categories}</h4>
                <select
                  value={selectedCategorySlug || ''}
                  onChange={e => handleSelectCategory(e.target.value || null)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                >
                  <option value="">{t.allCategories}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>
                      {translateCategoryName(c.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">{t.price}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder={t.priceFrom}
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    placeholder={t.priceTo}
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">{t.filterByBrand}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(b => (
                    <label key={b.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.slug.toLowerCase())}
                        onChange={() => toggleBrand(b.slug.toLowerCase())}
                        className="rounded"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-200 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700"
                >
                  {t.resetFilters}
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-black text-white text-xs font-semibold"
                >
                  OK ({sortedProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
