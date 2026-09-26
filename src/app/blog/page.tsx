'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Search, Clock, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogListPage() {
  const { blogPosts } = useStore();
  const { language, translateCategoryName, translateDescription, getLocalizedHref } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const labels = {
    ka: {
      home: 'მთავარი',
      blogTitle: 'ბლოგი და ტექნიკის მიმოხილვები',
      mainTitle: 'ბლოგი და ექსპერტთა მიმოხილვები',
      subTitle: 'ტექნიკური გზამკვლევები, უსაფრთხოების სისტემების ტესტები და შედარებები',
      searchPlaceholder: 'ძიება სტატიებში...',
      allTopics: 'ყველა თემა',
      mainTopic: 'მთავარი თემა',
      readArticle: 'სტატიის წაკითხვა',
      noPosts: 'სტატიები ვერ მოიძებნა',
    },
    en: {
      home: 'Home',
      blogTitle: 'Blog & Tech Reviews',
      mainTitle: 'Blog & Expert Tech Reviews',
      subTitle: 'Technical guides, security system tests, and hardware comparisons',
      searchPlaceholder: 'Search articles...',
      allTopics: 'All topics',
      mainTopic: 'Featured',
      readArticle: 'Read article',
      noPosts: 'No articles found',
    },
    ru: {
      home: 'Главная',
      blogTitle: 'Блог и обзоры техники',
      mainTitle: 'Блог и обзоры экспертов',
      subTitle: 'Честные тесты, сравнения флагманов и гиды по выбору электроники',
      searchPlaceholder: 'Поиск по статьям...',
      allTopics: 'Все темы',
      mainTopic: 'Главная тема',
      readArticle: 'Читать статью',
      noPosts: 'Статьи не найдены',
    },
  }[language];

  const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags)));

  const filteredPosts = blogPosts.filter(post => {
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const locTitle = translateDescription(post.title).toLowerCase();
      const locExcerpt = translateDescription(post.excerpt).toLowerCase();
      const locCat = translateCategoryName(post.category).toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        locTitle.includes(q) ||
        locExcerpt.includes(q) ||
        locCat.includes(q)
      );
    }
    return true;
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">{labels.blogTitle}</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
              {labels.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              {labels.subTitle}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder={labels.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tags filter strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === null
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {labels.allTopics}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              #{translateDescription(tag)}
            </button>
          ))}
        </div>

        {/* Featured Big Post */}
        {featuredPost && !selectedTag && !search && (
          <div className="mb-12">
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-zinc-900 transition-all group shadow-sm">
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[300px]">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 md:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                    <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {labels.mainTopic}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-zinc-400" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={getLocalizedHref(`/blog/${featuredPost.slug}`)}>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-950 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                      {translateDescription(featuredPost.title)}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-4">
                    {translateDescription(featuredPost.excerpt)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
                      <Image src={featuredPost.author.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{featuredPost.author.name}</div>
                      <div className="text-[10px] text-zinc-400">{translateDescription(featuredPost.author.role)}</div>
                    </div>
                  </div>

                  <Link
                    href={getLocalizedHref(`/blog/${featuredPost.slug}`)}
                    className="text-xs font-bold text-black flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    {labels.readArticle} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 text-sm">
            {labels.noPosts}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => {
              const locTitle = translateDescription(post.title);
              const locCat = translateCategoryName(post.category);
              const locExcerpt = translateDescription(post.excerpt);
              const locRole = translateDescription(post.author.role);

              return (
                <article
                  key={post.id}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-900 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <Link
                      href={getLocalizedHref(`/blog/${post.slug}`)}
                      className="block relative aspect-video overflow-hidden bg-zinc-100"
                    >
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {locCat}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{post.readTime}</span>
                      </div>

                      <Link
                        href={getLocalizedHref(`/blog/${post.slug}`)}
                        className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug"
                      >
                        {locTitle}
                      </Link>

                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                        {locExcerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-zinc-100 mt-2">
                    <div className="flex items-center gap-2 pt-3">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-200">
                        <Image src={post.author.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-700">{post.author.name}</div>
                        <div className="text-[10px] text-zinc-400">{locRole}</div>
                      </div>
                    </div>

                    <span className="text-[11px] text-zinc-400 pt-3">{post.date}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
