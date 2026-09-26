'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Package,
  Layers,
  Sparkles,
  Flame,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, SpecGroup } from '@/types';

export default function AdminProductsPage() {
  const {
    products,
    categories,
    brands,
    formatPrice,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState<number>(10);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [imageInputs, setImageInputs] = useState<string[]>([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [warranty, setWarranty] = useState('12 месяцев официальной гарантии');
  const [deliveryTime, setDeliveryTime] = useState('Доставка сегодня по Тбилиси');

  // Spec groups dynamic state
  const [specGroups, setSpecGroups] = useState<SpecGroup[]>([
    {
      group: 'Основные характеристики',
      items: [
        { name: 'Процессор', value: '' },
        { name: 'Память', value: '' },
      ],
    },
  ]);

  // Set default category
  useMemo(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openNewProductModal = () => {
    setEditingProductId(null);
    setTitle('');
    setSlug('');
    setSku(`HYK-${Math.floor(1000 + Math.random() * 9000)}`);
    setBrand(brands[0]?.name || 'Apple');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setOldPrice('');
    setInStock(true);
    setStockCount(10);
    setIsNew(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setImageInputs(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80']);
    setShortDescription('');
    setFullDescription('');
    setWarranty('24 месяца официальной гарантии');
    setDeliveryTime('Бесплатная доставка сегодня');
    setSpecGroups([
      {
        group: 'Основные характеристики',
        items: [
          { name: 'Процессор', value: 'Apple Silicon' },
          { name: 'Дисплей', value: '16.0" Liquid Retina' },
        ],
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setSlug(prod.slug);
    setSku(prod.sku);
    setBrand(prod.brand);
    setCategoryId(prod.categoryId);
    setPrice(prod.price);
    setOldPrice(prod.oldPrice || '');
    setInStock(prod.inStock);
    setStockCount(prod.stockCount);
    setIsNew(Boolean(prod.isNew));
    setIsFeatured(Boolean(prod.isFeatured));
    setIsBestseller(Boolean(prod.isBestseller));
    setImageInputs(prod.images && prod.images.length > 0 ? prod.images : [prod.thumbnail]);
    setShortDescription(prod.shortDescription);
    setFullDescription(prod.fullDescription);
    setWarranty(prod.warranty || '12 месяцев');
    setDeliveryTime(prod.deliveryTime || '1-2 дня');
    setSpecGroups(
      prod.specGroups && prod.specGroups.length > 0
        ? prod.specGroups
        : [
            {
              group: 'Основные характеристики',
              items: [{ name: 'Спецификация', value: 'Значение' }],
            },
          ]
    );
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price === '' || !categoryId) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    const calculatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Resolve category breadcrumb hierarchy
    const selectedCat = categories.find(c => c.id === categoryId);
    const catPath = [];
    if (selectedCat) {
      if (selectedCat.parentId) {
        const parentCat = categories.find(c => c.id === selectedCat.parentId);
        if (parentCat) {
          if (parentCat.parentId) {
            const grandParent = categories.find(c => c.id === parentCat.parentId);
            if (grandParent) catPath.push({ id: grandParent.id, name: grandParent.name, slug: grandParent.slug });
          }
          catPath.push({ id: parentCat.id, name: parentCat.name, slug: parentCat.slug });
        }
      }
      catPath.push({ id: selectedCat.id, name: selectedCat.name, slug: selectedCat.slug });
    }

    const payload = {
      title,
      slug: calculatedSlug,
      sku: sku || `HYK-${Date.now()}`,
      brand,
      categoryId,
      categoryPath: catPath,
      price: Number(price),
      oldPrice: oldPrice !== '' ? Number(oldPrice) : undefined,
      inStock,
      stockCount: Number(stockCount),
      rating: 5.0,
      reviewCount: 1,
      isNew,
      isFeatured,
      isBestseller,
      images: imageInputs.filter(Boolean),
      thumbnail: imageInputs[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      shortDescription,
      fullDescription,
      specGroups: specGroups.filter(g => g.group.trim() && g.items.length > 0),
      warranty,
      deliveryTime,
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const addImageToForm = () => {
    if (newImageUrl.trim()) {
      setImageInputs([...imageInputs, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageFromForm = (idx: number) => {
    setImageInputs(imageInputs.filter((_, i) => i !== idx));
  };

  // Dynamic specs handlers
  const addSpecRow = (groupIdx: number) => {
    const next = [...specGroups];
    next[groupIdx].items.push({ name: '', value: '' });
    setSpecGroups(next);
  };

  const removeSpecRow = (groupIdx: number, itemIdx: number) => {
    const next = [...specGroups];
    next[groupIdx].items = next[groupIdx].items.filter((_, i) => i !== itemIdx);
    setSpecGroups(next);
  };

  const addSpecGroup = () => {
    setSpecGroups([
      ...specGroups,
      { group: `Группа характеристик ${specGroups.length + 1}`, items: [{ name: '', value: '' }] },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-950">
            Товары каталога
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Всего {products.length} товаров в базе данных
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" /> Добавить новый товар
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Поиск по названию, артикулу (SKU) или бренду..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
          >
            <option value="">Все категории</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {'- '.repeat(c.level - 1)} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Товар</th>
                <th className="px-4 py-3.5">Категория</th>
                <th className="px-4 py-3.5">Цена</th>
                <th className="px-4 py-3.5">Остаток</th>
                <th className="px-4 py-3.5">Статус</th>
                <th className="px-6 py-3.5 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredProducts.map(prod => {
                const category = categories.find(c => c.id === prod.categoryId);
                return (
                  <tr key={prod.id} className="hover:bg-zinc-50 transition-colors">
                    {/* Title & SKU & Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden flex-shrink-0 p-1">
                          <Image
                            src={prod.thumbnail || prod.images?.[0] || '/images/placeholder.svg'}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            {prod.brand}
                          </div>
                          <div className="font-bold text-zinc-900 truncate">
                            {prod.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            SKU: {prod.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-zinc-600">
                      <span className="bg-zinc-100 px-2.5 py-1 rounded text-[11px] font-medium">
                        {category?.name || 'Без категории'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-zinc-900 font-mono text-sm">
                        {formatPrice(prod.price)}
                      </div>
                      {prod.oldPrice && (
                        <div className="text-[10px] text-zinc-400 line-through font-mono">
                          {formatPrice(prod.oldPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock Count */}
                    <td className="px-4 py-4 font-mono font-semibold">
                      <span
                        className={
                          prod.stockCount <= 3
                            ? 'text-rose-600 font-bold'
                            : prod.stockCount <= 8
                            ? 'text-amber-600'
                            : 'text-zinc-800'
                        }
                      >
                        {prod.stockCount} шт.
                      </span>
                    </td>

                    {/* Status badges */}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.inStock ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            В наличии
                          </span>
                        ) : (
                          <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded">
                            Нет
                          </span>
                        )}
                        {prod.isNew && (
                          <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                        {prod.isBestseller && (
                          <span className="bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить товар «${prod.title}»?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL PRODUCT ADD / EDIT MODAL DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-200 p-6 md:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-950 mb-1">
              {editingProductId ? 'Редактирование товара' : 'Добавление нового товара'}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Заполните параметры товара, фотографии, вложенную категорию и технические характеристики
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Apple MacBook Pro 16 M3 Max"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Артикул (SKU) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HYK-APL-001"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Производитель (Бренд) *
                  </label>
                  <select
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Вложенная категория *
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {'- '.repeat(c.level - 1)} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Цена (₾ GEL) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Старая цена (скидка)
                  </label>
                  <input
                    type="number"
                    placeholder="3499"
                    value={oldPrice}
                    onChange={e => setOldPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Остаток на складе
                  </label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={e => setStockCount(Number(e.target.value))}
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={e => setInStock(e.target.checked)}
                      className="rounded border-zinc-300 text-black focus:ring-black h-4 w-4"
                    />
                    <span>В наличии</span>
                  </label>
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 text-xs font-semibold text-zinc-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="rounded border-zinc-300 text-black h-4 w-4"
                  />
                  <span>Бейдж "NEW"</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={e => setIsBestseller(e.target.checked)}
                    className="rounded border-zinc-300 text-black h-4 w-4"
                  />
                  <span>Хит продаж (TOP)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded border-zinc-300 text-black h-4 w-4"
                  />
                  <span>Рекомендуемый товар</span>
                </label>
              </div>

              {/* Photos / Gallery URLs Manager */}
              <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Фотографии товара (Галерея с увеличением)
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    Первое фото — главное превью
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Вставьте URL изображения (https://...)"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-zinc-200 p-2 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={addImageToForm}
                    className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    + Добавить фото
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {imageInputs.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 bg-white border-2 border-zinc-200 rounded-xl overflow-hidden group p-1"
                    >
                      <Image src={imgUrl} alt="" fill className="object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImageFromForm(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Удалить"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                          Главное
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Specifications Matrix Builder */}
              <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Технические характеристики (Сравнение)
                  </h3>
                  <button
                    type="button"
                    onClick={addSpecGroup}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    + Добавить блок характеристик
                  </button>
                </div>

                {specGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="bg-white p-4 rounded-xl border border-zinc-200 space-y-3">
                    <input
                      type="text"
                      placeholder="Название группы (например: Процессор и Память)"
                      value={group.group}
                      onChange={e => {
                        const next = [...specGroups];
                        next[groupIdx].group = e.target.value;
                        setSpecGroups(next);
                      }}
                      className="w-full font-bold text-xs bg-zinc-50 border border-zinc-200 p-2 rounded-lg"
                    />

                    <div className="space-y-2">
                      {group.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Параметр (напр. Ядра)"
                            value={item.name}
                            onChange={e => {
                              const next = [...specGroups];
                              next[groupIdx].items[itemIdx].name = e.target.value;
                              setSpecGroups(next);
                            }}
                            className="w-1/3 bg-zinc-50 border border-zinc-200 p-1.5 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Значение (напр. 16 ядер)"
                            value={item.value}
                            onChange={e => {
                              const next = [...specGroups];
                              next[groupIdx].items[itemIdx].value = e.target.value;
                              setSpecGroups(next);
                            }}
                            className="flex-1 bg-zinc-50 border border-zinc-200 p-1.5 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecRow(groupIdx, itemIdx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addSpecRow(groupIdx)}
                      className="text-[11px] text-zinc-600 font-semibold hover:text-black"
                    >
                      + Добавить строку в эту группу
                    </button>
                  </div>
                ))}
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Краткое описание (для карточки и превью)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Кратко опишите ключевые особенности модели..."
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Полное подробное описание
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Полное описание устройства, возможности, технологии..."
                    value={fullDescription}
                    onChange={e => setFullDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-zinc-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold hover:bg-zinc-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Сохранить товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
