'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Layers,
  X,
  Check,
  Folder,
  FolderPlus,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState('Laptop');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const rootCategories = categories.filter(c => c.level === 1 || !c.parentId);

  const openNewCategoryModal = (parentCategory?: Category) => {
    setEditingCategoryId(null);
    setName('');
    setSlug('');
    setParentId(parentCategory ? parentCategory.id : null);
    setIcon('Laptop');
    setImage(
      parentCategory
        ? ''
        : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    );
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId || null);
    setIcon(cat.icon || 'Laptop');
    setImage(cat.image || '');
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const calculatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Determine level
    let level = 1;
    if (parentId) {
      const parent = categories.find(c => c.id === parentId);
      if (parent) level = parent.level + 1;
    }

    const payload = {
      name,
      slug: calculatedSlug,
      parentId,
      level,
      icon,
      image,
      description,
    };

    if (editingCategoryId) {
      updateCategory(editingCategoryId, payload);
    } else {
      addCategory(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
            <FolderTree className="w-6 h-6" />
            <span>Управление структурой категорий</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Древовидная иерархия каталога (Главные категории, Подкатегории и Вложенные разделы 3-го уровня)
          </p>
        </div>

        <button
          onClick={() => openNewCategoryModal()}
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" /> Добавить корневую категорию
        </button>
      </div>

      {/* Category Tree Visualization & Management Cards */}
      <div className="space-y-4">
        {rootCategories.map(root => {
          const level2Subcategories = categories.filter(c => c.parentId === root.id);
          const rootProductsCount = products.filter(
            p => p.categoryId === root.id || p.categoryPath?.some(cp => cp.id === root.id)
          ).length;

          return (
            <div
              key={root.id}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Level 1: Root Header */}
              <div className="p-5 bg-zinc-50/80 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-zinc-950">{root.name}</h2>
                      <span className="text-[10px] bg-zinc-200 text-zinc-700 font-mono px-2 py-0.5 rounded font-semibold">
                        slug: /{root.slug}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{root.description || 'Корневой раздел'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => openNewCategoryModal(root)}
                    className="bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> + Подкатегория
                  </button>

                  <button
                    onClick={() => openEditCategoryModal(root)}
                    className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-200 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Удалить категорию «${root.name}» и все её подкатегории?`)) {
                        deleteCategory(root.id);
                      }
                    }}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Level 2 & Level 3 Subcategories List */}
              <div className="p-5 space-y-4">
                {level2Subcategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {level2Subcategories.map(sub => {
                      const level3 = categories.filter(c => c.parentId === sub.id);
                      return (
                        <div
                          key={sub.id}
                          className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-xs text-zinc-900">
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                              <span>{sub.name}</span>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                (/{sub.slug})
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openNewCategoryModal(sub)}
                                className="text-[11px] text-blue-600 hover:underline font-semibold pr-2"
                                title="Добавить вложенный раздел 3-го уровня"
                              >
                                + 3-й ур.
                              </button>
                              <button
                                onClick={() => openEditCategoryModal(sub)}
                                className="p-1 text-zinc-500 hover:text-black"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteCategory(sub.id)}
                                className="p-1 text-zinc-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Level 3 deep subcategories */}
                          {level3.length > 0 && (
                            <div className="pl-3 border-l-2 border-zinc-200 space-y-1.5 pt-1">
                              {level3.map(l3 => (
                                <div
                                  key={l3.id}
                                  className="flex items-center justify-between text-xs text-zinc-600 bg-white p-2 rounded-lg border border-zinc-100"
                                >
                                  <span className="font-medium">• {l3.name}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => openEditCategoryModal(l3)}
                                      className="p-1 text-zinc-400 hover:text-black"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => deleteCategory(l3.id)}
                                      className="p-1 text-zinc-400 hover:text-rose-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 italic py-2">
                    В этой категории пока нет вложенных подкатегорий.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-zinc-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-950 mb-1">
              {editingCategoryId ? 'Редактирование категории' : 'Новая категория'}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Настройте название, URL-путь (slug) и уровень вложенности
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Название категории *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Видеокарты"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  URL-идентификатор (slug)
                </label>
                <input
                  type="text"
                  placeholder="graphics-cards"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Родительская категория (Вложенность)
                </label>
                <select
                  value={parentId || ''}
                  onChange={e => setParentId(e.target.value || null)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                >
                  <option value="">(Без родителя — Корневая категория 1-го уровня)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {'- '.repeat(c.level - 1)} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  URL изображения обложки (для баннеров)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Краткое описание
                </label>
                <textarea
                  rows={2}
                  placeholder="Описание для каталога и SEO..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="border-t border-zinc-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold hover:bg-zinc-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
