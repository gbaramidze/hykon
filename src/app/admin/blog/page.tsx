'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FileText, Plus, Edit2, Trash2, X, Check, Eye } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { BlogPost } from '@/types';

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Обзоры техники');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80');
  const [authorName, setAuthorName] = useState('Эксперт Hykon');
  const [readTime, setReadTime] = useState('5 мин');
  const [tagsInput, setTagsInput] = useState('Apple, Обзор, Техника');

  const openNewPostModal = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setCategory('Обзоры техники');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80');
    setAuthorName('Ника Барамидзе');
    setReadTime('6 мин');
    setTagsInput('Apple, Флагманы, 2026');
    setIsModalOpen(true);
  };

  const openEditPostModal = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAuthorName(post.author.name);
    setReadTime(post.readTime);
    setTagsInput(post.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const calculatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: calculatedSlug,
      excerpt,
      content,
      coverImage,
      author: {
        name: authorName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Tech Редактор',
      },
      date: 'Сегодня',
      readTime,
      category,
      tags,
      views: 10,
    };

    if (editingPostId) {
      updateBlogPost(editingPostId, payload);
    } else {
      addBlogPost(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <span>Управление блогом и статьями</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Публикация обзоров, руководств по выбору и новостей электроники ({blogPosts.length})
          </p>
        </div>

        <button
          onClick={openNewPostModal}
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" /> Написать статью
        </button>
      </div>

      {/* Blog Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <div
            key={post.id}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full bg-zinc-100">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>

              <div className="p-5 space-y-2">
                <div className="text-[11px] font-bold text-blue-600 uppercase">
                  {post.category} • {post.readTime}
                </div>
                <h3 className="font-bold text-sm text-zinc-900 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-zinc-100 flex items-center justify-between mt-2">
              <span className="text-[11px] text-zinc-400 font-mono pt-3">
                {post.views} просмотров
              </span>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => openEditPostModal(post)}
                  className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg"
                  title="Редактировать"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Удалить статью «${post.title}»?`)) {
                      deleteBlogPost(post.id);
                    }
                  }}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-zinc-200 relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-950">
              {editingPostId ? 'Редактирование статьи' : 'Новая статья блога'}
            </h2>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Заголовок статьи *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Заголовок обзора..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Рубрика / Категория
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Время на чтение
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  URL обложки
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Краткий анонс (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Текст статьи (Markdown поддерживается)
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Теги (через запятую)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
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
                  Сохранить статью
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
