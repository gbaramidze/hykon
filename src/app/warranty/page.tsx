'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Wrench, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function WarrantyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">Гарантия и Сервис</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950">
            Гарантия и Сервисное обслуживание
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Официальные обязательства производителя и гарантия высокого качества от магазина Hykon.ge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-sm text-zinc-900">Официальная гарантия</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              На всю технику Apple, Asus, Sony, Samsung и Dyson действует официальная гарантия от 12 до 36 месяцев в авторизованных сервисных центрах.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
            <RotateCcw className="w-8 h-8 text-amber-600" />
            <h3 className="font-bold text-sm text-zinc-900">14 дней на возврат</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Если товар вам не подошел, вы можете вернуть или обменять его в течение 14 дней с момента покупки при сохранении товарного вида и чека.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
            <Wrench className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-sm text-zinc-900">Поддержка экспертов</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Наши сертифицированные специалисты помогут с первоначальной настройкой, переносом данных и подбором аксессуаров.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
