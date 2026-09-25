'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Clock, MapPin, CreditCard, Banknote, Percent, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DeliveryPage() {
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
          <span className="text-black font-semibold">Доставка и Оплата</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950">
            Доставка и Оплата
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Быстрая логистика по Тбилиси и всей Грузии, удобные способы онлайн и оффлайн оплаты
          </p>
        </div>

        <div className="space-y-12">
          {/* SECTION 1: DELIVERY */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Способы доставки</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Экспресс по Тбилиси</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Доставка курьером в течение 2-4 часов при заказе до 16:00. При сумме от 150 ₾ — <b>бесплатно</b>. Для заказов до 150 ₾ — 7 ₾.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-zinc-900">По всей Грузии</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Батуми, Кутаиси, Рустави, Зугдиди, Телави и другие регионы. Срок доставки 24–48 часов. Бесплатно от 150 ₾.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Самовывоз из шоурума</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  г. Тбилиси, пр. Ильи Чавчавадзе 37. Забрать можно в любой день с 10:00 до 21:00 после подтверждения менеджером.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: PAYMENT */}
          <section id="payment" className="space-y-6 pt-6 border-t border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Варианты оплаты</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-zinc-700" />
                  <h3 className="font-bold text-sm text-zinc-900">Банковские карты онлайн</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Оплата картами Visa, Mastercard любого банка мира. Поддержка Apple Pay и Google Pay с мгновенным зачислением без скрытых комиссий.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-zinc-900">Оплата при получении</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Наличными лари (GEL) или банковской картой через переносной терминал курьера после проверки целостности устройства и комплектации.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <Percent className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-zinc-900">Рассрочка 0%</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Онлайн рассрочка без первого взноса и переплат через банки TBC Bank, Bank of Georgia и Credo Bank на срок от 3 до 24 месяцев.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-zinc-900">Безналичный расчет для юр. лиц</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Выставление официального счета на оплату через систему RS.GE с полным пакетом закрывающих бухгалтерских документов.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
