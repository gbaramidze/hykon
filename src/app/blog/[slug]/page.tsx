'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock, Eye, ArrowLeft, Tag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPostDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : '';
  const { blogPosts, products } = useStore();
  const { language, translateCategoryName, translateDescription, getLocalizedHref } = useLanguage();

  const post = blogPosts.find(p => p.slug === slug || encodeURIComponent(p.slug) === slug);

  // Localization labels
  const labels = {
    ka: {
      home: 'მთავარი',
      blog: 'ბლოგი',
      notFound: 'სტატია ვერ მოიძებნა',
      backToBlog: 'ბლოგზე დაბრუნება',
      views: 'ნახვა',
      minRead: 'წთ',
      relatedTitle: 'ამ სტატიაში ნახსენები მოწყობილობები',
      backBtn: 'უკან ბლოგში',
    },
    en: {
      home: 'Home',
      blog: 'Blog',
      notFound: 'Article not found',
      backToBlog: 'Back to blog',
      views: 'views',
      minRead: 'min',
      relatedTitle: 'Products mentioned in this article',
      backBtn: 'Back to blog',
    },
    ru: {
      home: 'Главная',
      blog: 'Блог',
      notFound: 'Статья не найдена',
      backToBlog: 'Вернуться в блог',
      views: 'просмотров',
      minRead: 'мин',
      relatedTitle: 'Устройства, упомянутые в статье',
      backBtn: 'Назад в блог',
    },
  }[language];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{labels.notFound}</h1>
          <Link href={getLocalizedHref('/blog')} className="text-xs font-semibold text-blue-600 underline">
            {labels.backToBlog}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Recommended products mentioned in article
  const relatedProducts = products.slice(0, 3);

  // Translate content dynamically if language is en/ru
  const localizedTitle = translateDescription(post.title);
  const localizedCategory = translateCategoryName(post.category);
  const localizedExcerpt = translateDescription(post.excerpt);
  const localizedContent = translateDescription(post.content);
  const localizedRole = translateDescription(post.author.role);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6 flex-wrap gap-y-1">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <Link href={getLocalizedHref('/blog')} className="hover:text-black transition-colors">
            {labels.blog}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold truncate max-w-xs">{localizedTitle}</span>
        </nav>

        <article className="space-y-8">
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-md border border-blue-100/50">
                {localizedCategory}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-zinc-600">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-zinc-600">
                <Eye className="w-3.5 h-3.5 text-zinc-400" /> {post.views} {labels.views}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 leading-tight tracking-tight">
              {localizedTitle}
            </h1>

            <div className="flex items-center justify-between border-y border-zinc-100 py-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{post.author.name}</div>
                  <div className="text-[11px] text-zinc-500">{localizedRole}</div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 font-mono">{post.date}</div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
            <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
          </div>

          {/* Article Lead Excerpt */}
          {localizedExcerpt && (
            <div className="bg-zinc-50 border-l-4 border-blue-600 rounded-r-xl p-4 sm:p-5">
              <p className="text-sm sm:text-base text-zinc-800 font-medium leading-relaxed">
                {localizedExcerpt}
              </p>
            </div>
          )}

          {/* Markdown Content Body */}
          <div className="text-zinc-800 leading-relaxed max-w-none">
            <MarkdownRenderer content={localizedContent} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-zinc-200 pt-6 flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
              </span>
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-3 py-1 rounded-lg font-medium transition-colors"
                >
                  #{translateDescription(tag)}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="pt-2">
            <Link
              href={getLocalizedHref('/blog')}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {labels.backBtn}
            </Link>
          </div>

          {/* Related products widget */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-zinc-200 pt-10 mt-10">
              <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {labels.relatedTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
