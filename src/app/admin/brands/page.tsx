'use client';

import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Brand } from '@/types';

export default function AdminBrandsPage() {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [country, setCountry] = useState('США');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');

  const openNewBrandModal = () => {
    setEditingBrandId(null);
    setName('');
    setSlug('');
    setCountry('США');
    setLogo('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditBrandModal = (brand: Brand) => {
    setEditingBrandId(brand.id);
    setName(brand.name);
    setSlug(brand.slug);
    setCountry(brand.country);
    setLogo(brand.logo);
    setDescription(brand.description);
    setIsModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const calculatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const payload = {
      name,
      slug: calculatedSlug,
      country,
      logo: logo || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300',
      description,
      featured: true,
    };

    if (editingBrandId) {
      updateBrand(editingBrandId, payload);
    } else {
      addBrand(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            <span>Управление брендами</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Список официальных производителей электроники ({brands.length})
          </p>
        </div>

        <button
          onClick={openNewBrandModal}
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" /> Добавить производителя
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map(brand => {
          const count = products.filter(
            p => p.brand.toLowerCase() === brand.name.toLowerCase()
          ).length;

          return (
            <div
              key={brand.id}
              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-zinc-900 font-mono">
                      {brand.name}
                    </h3>
                    <span className="text-xs text-zinc-400 font-medium">
                      {brand.country} • slug: /{brand.slug}
                    </span>
                  </div>

                  <span className="bg-zinc-100 text-zinc-700 text-xs font-bold px-2.5 py-1 rounded-full font-mono">
                    {count} поз.
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-4">
                  {brand.description}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-end gap-2">
                <button
                  onClick={() => openEditBrandModal(brand)}
                  className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg"
                  title="Редактировать"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Удалить бренд «${brand.name}»?`)) {
                      deleteBrand(brand.id);
                    }
                  }}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-950">
              {editingBrandId ? 'Редактирование бренда' : 'Новый бренд'}
            </h2>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Название бренда *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Razer"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Страна происхождения
                </label>
                <input
                  type="text"
                  placeholder="США"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Описание производителя
                </label>
                <textarea
                  rows={3}
                  placeholder="Краткая информация о бренде..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="border-t border-zinc-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-black text-white text-xs font-semibold"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
