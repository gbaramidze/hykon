'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock, Eye, Share2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blogPosts, products } = useStore();

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Статья не найдена</h1>
          <Link href="/blog" className="text-xs font-semibold text-blue-600 underline">
            Вернуться в блог
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Recommended products mentioned in article
  const relatedProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <Link href="/blog" className="hover:text-black">
            Блог
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        <article className="space-y-8">
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-md">
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {post.views} просмотров
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-950 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-y border-zinc-200 py-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-200">
                  <Image src={post.author.avatar} alt="" fill className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{post.author.name}</div>
                  <div className="text-[11px] text-zinc-400">{post.author.role}</div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 font-mono">{post.date}</div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
          </div>

          {/* Content Body */}
          <div className="text-zinc-800 text-sm leading-relaxed space-y-6 max-w-none prose prose-zinc whitespace-pre-line">
            <p className="text-base text-zinc-600 font-medium leading-relaxed border-l-2 border-black pl-4 my-4">
              {post.excerpt}
            </p>
            <div>{post.content}</div>
          </div>

          {/* Tags */}
          <div className="border-t border-zinc-200 pt-6 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-zinc-100 text-zinc-700 text-xs px-3 py-1 rounded-lg font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related products widget */}
          <div className="border-t border-zinc-200 pt-10 mt-10">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">
              Устройства, упомянутые в статье
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
