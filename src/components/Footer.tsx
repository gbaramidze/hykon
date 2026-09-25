'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Logo } from '@/components/Logo';

export const Footer: React.FC = () => {
  const { categories } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const rootCategories = categories.filter(c => c.level === 1 || !c.parentId);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 pt-16 pb-24 md:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Propositions / Assurance Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded-xl text-white">
              <Truck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Быстрая доставка</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Доставка день-в-день по Тбилиси. От 150 ₾ — бесплатно.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded-xl text-white">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">100% Оригинал</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Прямые поставки от официальных дистрибьюторов с гарантией.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded-xl text-white">
              <RotateCcw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">14 дней на возврат</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Простой и удобный возврат товара без лишней бюрократии.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded-xl text-white">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Поддержка 7 дней</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Профессиональные консультации экспертов с 10:00 до 21:00.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-zinc-800">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-2 space-y-5">
            <Logo variant="light" />

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Интернет-магазин премиальной электроники и инновационных гаджетов в Грузии. Ноутбуки Apple, кастомные ПК, видеокарты, акустика и умный дом.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                Спецпредложения и закрытые акции
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Спасибо! Вы успешно подписаны на обновления.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Ваш e-mail"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Подписаться
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Каталог товаров
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              {rootCategories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Покупателям
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors">
                  Доставка и самовывоз
                </Link>
              </li>
              <li>
                <Link href="/delivery#payment" className="hover:text-white transition-colors">
                  Способы оплаты и рассрочка
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-white transition-colors">
                  Гарантийное обслуживание
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Сравнение товаров
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">
                  Все производители
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Обзоры и новости
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Showroom */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Контакты и Шоурум
            </h5>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="text-white font-medium">г. Тбилиси, пр. Чавчавадзе 37</p>
              <p>Пн–Вс: 10:00 – 21:00</p>
              <div className="pt-2">
                <a
                  href="tel:+995322005599"
                  className="text-white font-mono font-semibold block hover:text-blue-400 transition-colors"
                >
                  +995 (32) 200-55-99
                </a>
                <a
                  href="mailto:support@hykon.ge"
                  className="text-zinc-400 hover:text-white block mt-1 transition-colors"
                >
                  support@hykon.ge
                </a>
              </div>

              <div className="pt-3">
                <Link
                  href="/admin"
                  className="inline-block text-[11px] text-zinc-500 hover:text-zinc-300 underline"
                >
                  Вход для администратора
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} HYKON.GE. Все права защищены.
          </div>

          <div className="flex items-center space-x-3 text-zinc-400 text-xs">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono">VISA</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono">Mastercard</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono">TBC Bank</span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
