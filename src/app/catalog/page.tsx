'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CatalogView } from '@/components/CatalogView';

function CatalogContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const filter = searchParams.get('filter') || undefined;

  return (
    <CatalogView
      initialQuery={query}
      initialBrand={brand}
      initialFilter={filter}
    />
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Загрузка каталога...</div>}>
          <CatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
