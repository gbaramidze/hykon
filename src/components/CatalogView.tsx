'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  Grid,
  List,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Product, Category } from '@/types';

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

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    initialCategorySlug || null
  );
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
  const [sortBy, setSortBy] = useState<
    'popular' | 'price_asc' | 'price_desc' | 'newest' | 'rating'
  >('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [brandSearch, setBrandSearch] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active Category resolution
  const currentCategory = categories.find(c => c.slug === selectedCategorySlug);

  // Collect all category IDs under the selected category (recursive)
  const targetCategoryIds = useMemo(() => {
    if (!selectedCategorySlug || !currentCategory) return null;

    const ids = new Set<string>([currentCategory.id]);
    const findChildren = (parentId: string) => {
      const children = categories.filter(c => c.parentId === parentId);
      children.forEach(child => {
        ids.add(child.id);
        findChildren(child.id);
      });
    };
    findChildren(currentCategory.id);
    return ids;
  }, [selectedCategorySlug, currentCategory, categories]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (targetCategoryIds && !targetCategoryIds.has(p.categoryId)) {
        // Also check if any category in product categoryPath matches
        const hasMatch = p.categoryPath?.some(cp => targetCategoryIds.has(cp.id));
        if (!hasMatch) return false;
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
    targetCategoryIds,
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

  // Brand toggle
  const toggleBrand = (brandSlug: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandSlug)
        ? prev.filter(b => b !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategorySlug(null);
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

  // Root categories for the tree
  const rootCategories = categories.filter(c => c.level === 1 || !c.parentId);

  // Filtered brands for brand list in sidebar
  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-black">
          Главная
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
        <Link
          href="/catalog"
          onClick={() => setSelectedCategorySlug(null)}
          className={`hover:text-black ${!selectedCategorySlug ? 'text-black font-bold' : ''}`}
        >
          Каталог
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span className="text-black font-semibold truncate">
              {currentCategory.name}
            </span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-950">
            {currentCategory ? currentCategory.name : 'Каталог техники'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Найдено {sortedProducts.length} товаров по вашему запросу
          </p>
        </div>

        {/* Top Controls: Sorting & View Mode & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Фильтры {hasActiveFilters && '(активны)'}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 hidden sm:inline">Сортировка:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="newest">Новинки</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-zinc-500 hover:text-black'
              }`}
              title="Сетка"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-zinc-500 hover:text-black'
              }`}
              title="Список"
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
                  Активные фильтры
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Сбросить все
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedCategorySlug && currentCategory && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    {currentCategory.name}
                    <button onClick={() => setSelectedCategorySlug(null)}>
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
                    <button onClick={() => toggleBrand(bSlug)}>
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    Только в наличии
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                )}
                {discountOnly && (
                  <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-xs text-zinc-800">
                    Только со скидкой
                    <button onClick={() => setDiscountOnly(false)}>
                      <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Nested Categories Tree */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Категории
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  !selectedCategorySlug
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Все категории
              </button>

              {rootCategories.map(root => {
                const subCats = categories.filter(c => c.parentId === root.id);
                const isCurrentRoot =
                  selectedCategorySlug === root.slug ||
                  subCats.some(s => s.slug === selectedCategorySlug);

                return (
                  <div key={root.id} className="space-y-1">
                    <button
                      onClick={() => setSelectedCategorySlug(root.slug)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center justify-between transition-colors ${
                        selectedCategorySlug === root.slug
                          ? 'bg-zinc-900 text-white font-bold'
                          : 'text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{root.name}</span>
                      {subCats.length > 0 && <ChevronDown className="w-3 h-3 opacity-60" />}
                    </button>

                    {/* Subcategories */}
                    {isCurrentRoot && subCats.length > 0 && (
                      <div className="pl-3 border-l-2 border-zinc-200 ml-2 space-y-1 my-1">
                        {subCats.map(sub => {
                          const level3 = categories.filter(c => c.parentId === sub.id);
                          return (
                            <div key={sub.id}>
                              <button
                                onClick={() => setSelectedCategorySlug(sub.slug)}
                                className={`w-full text-left text-[11px] px-2 py-1 rounded transition-colors ${
                                  selectedCategorySlug === sub.slug
                                    ? 'bg-zinc-200 text-black font-bold'
                                    : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                                }`}
                              >
                                {sub.name}
                              </button>

                              {/* Level 3 */}
                              {level3.length > 0 && (
                                <div className="pl-2 space-y-0.5 mt-0.5">
                                  {level3.map(l3 => (
                                    <button
                                      key={l3.id}
                                      onClick={() => setSelectedCategorySlug(l3.slug)}
                                      className={`w-full text-left text-[10px] px-2 py-0.5 rounded transition-colors ${
                                        selectedCategorySlug === l3.slug
                                          ? 'text-blue-600 font-bold'
                                          : 'text-zinc-500 hover:text-black'
                                      }`}
                                    >
                                      • {l3.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Цена (₾)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">От</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">До</label>
                <input
                  type="number"
                  placeholder="10000"
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
              Производитель
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск бренда..."
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
              Статус и Акции
            </h3>
            <label className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded border-zinc-300 text-black focus:ring-black h-3.5 w-3.5"
              />
              <span>Только в наличии</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer select-none">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={e => setDiscountOnly(e.target.checked)}
                className="rounded border-zinc-300 text-black focus:ring-black h-3.5 w-3.5"
              />
              <span>Только со скидкой</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS LIST / GRID */}
        <div className="md:col-span-3">
          {sortedProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {sortedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={p => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-12 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-zinc-900">
                Товары не найдены
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Попробуйте сбросить установленные фильтры или изменить поисковый запрос.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end md:hidden">
          <div className="bg-white w-4/5 max-w-md h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-zinc-900">Фильтры</h3>
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
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">Категория</h4>
                <select
                  value={selectedCategorySlug || ''}
                  onChange={e => setSelectedCategorySlug(e.target.value || null)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                >
                  <option value="">Все категории</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>
                      {'- '.repeat(c.level - 1)} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">Цена</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2">Бренды</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map(b => (
                    <label key={b.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.slug.toLowerCase())}
                        onChange={() => toggleBrand(b.slug.toLowerCase())}
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock / Sale */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                  />
                  <span>Только в наличии</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={e => setDiscountOnly(e.target.checked)}
                  />
                  <span>Только со скидкой</span>
                </label>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-xs font-semibold"
              >
                Сбросить
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-black text-white text-xs font-semibold"
              >
                Показать ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
