'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Clock, MapPin, CreditCard, Banknote, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function DeliveryPage() {
  const { language, getLocalizedHref } = useLanguage();

  const content = {
    ka: {
      home: 'მთავარი',
      title: 'მიწოდება და გადახდა',
      subtitle: 'სწრაფი ლოგისტიკა ბათუმში, თბილისსა და მთელ საქართველოში, გადახდის მოსახერხებელი მეთოდები',
      deliveryMethods: 'მიწოდების მეთოდები',
      method1Title: 'ექსპრეს მიწოდება (თბილისი / ბათუმი)',
      method1Desc: 'კურიერული მიწოდება შეკვეთის დღესვე. 150 ₾-დან შეკვეთებზე — უფასო. 150 ₾-მდე შეკვეთებზე — 7 ₾.',
      method2Title: 'მიწოდება მთელ საქართველოში',
      method2Desc: 'ქუთაისი, რუსთავი, ზუგდიდი, თელავი და სხვა რეგიონები. მიწოდების ვადა: 24–48 საათი. 150 ₾-დან უფასო.',
      method3Title: 'გატანა შოურუმიდან (ბათუმი)',
      method3Desc: 'ქ. ბათუმი, საქართველო. გატანა შესაძლებელია ყოველდღე 10:00-დან 21:00-მდე მენეჯერთან შეთანხმებით.',
      paymentOptions: 'გადახდის ვარიანტები',
      pay1Title: 'საბანკო გადარიცხვა (ინვოისით)',
      pay1Desc: 'ოფიციალური ინვოისის ავტომატური გენერაცია RS.GE სისტემით ფიზიკური და იურიდიული პირებისთვის.',
      pay2Title: 'გადახდა მიღებისას',
      pay2Desc: 'ნაღდი ანგარიშსწორებით ან ბარათით კურიერთან პროდუქტის ვიზუალური შემოწმების შემდეგ.',
      pay3Title: 'ონლაინ გადახდა საბანკო ბარათით',
      pay3Desc: 'Visa, Mastercard, Apple Pay და Google Pay მომენტალური ჩარიცხვით ყოველგვარი დამატებითი საკომისიოს გარეშე.',
    },
    en: {
      home: 'Home',
      title: 'Delivery & Payment',
      subtitle: 'Fast logistics in Batumi, Tbilisi and across Georgia, convenient payment methods',
      deliveryMethods: 'Delivery Methods',
      method1Title: 'Express Courier (Tbilisi / Batumi)',
      method1Desc: 'Same-day courier delivery for orders before 16:00. Free on orders above 150 ₾ (7 ₾ under 150 ₾).',
      method2Title: 'Nationwide Delivery across Georgia',
      method2Desc: 'Kutaisi, Rustavi, Zugdidi, Telavi and all regions. Delivery time 24–48 hours. Free from 150 ₾.',
      method3Title: 'Showroom Pickup (Batumi)',
      method3Desc: 'Batumi, Georgia. Available daily from 10:00 to 21:00 after manager confirmation.',
      paymentOptions: 'Payment Options',
      pay1Title: 'Bank Transfer (Proforma Invoice)',
      pay1Desc: 'Automated invoice generation for individuals & corporate B2B clients via RS.GE with all accounting documents.',
      pay2Title: 'Cash / Card on Delivery',
      pay2Desc: 'Pay in cash (GEL) or via card terminal to the courier after inspecting the package.',
      pay3Title: 'Online Card Payment',
      pay3Desc: 'Visa, Mastercard, Apple Pay, and Google Pay with zero transaction fees.',
    },
    ru: {
      home: 'Главная',
      title: 'Доставка и Оплата',
      subtitle: 'Быстрая логистика по Батуми, Тбилиси и всей Грузии, удобные способы оплаты',
      deliveryMethods: 'Способы доставки',
      method1Title: 'Экспресс по Тбилиси и Батуми',
      method1Desc: 'Доставка курьером в день заказа. При сумме от 150 ₾ — бесплатно. Для заказов до 150 ₾ — 7 ₾.',
      method2Title: 'По всей Грузии',
      method2Desc: 'Батуми, Кутаиси, Рустави, Зугдиди, Телави и другие регионы. Срок доставки 24–48 часов. Бесплатно от 150 ₾.',
      method3Title: 'Самовывоз из шоурума (Батуми)',
      method3Desc: 'г. Батуми, Грузия. Забрать можно в любой день с 10:00 до 21:00 после подтверждения менеджером.',
      paymentOptions: 'Варианты оплаты',
      pay1Title: 'Безналичный расчет для юр. лиц и ИП',
      pay1Desc: 'Выставление официального счета на оплату через систему RS.GE с полным пакетом закрывающих бухгалтерских документов.',
      pay2Title: 'Оплата при получении',
      pay2Desc: 'Наличными лари (GEL) или банковской картой через терминал курьера после проверки целостности устройства.',
      pay3Title: 'Банковские карты онлайн',
      pay3Desc: 'Оплата картами Visa, Mastercard любого банка мира. Поддержка Apple Pay и Google Pay без скрытых комиссий.',
    },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {content.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">{content.title}</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {content.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {/* SECTION 1: DELIVERY */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>{content.deliveryMethods}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{content.method1Title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.method1Desc}
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{content.method2Title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.method2Desc}
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{content.method3Title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.method3Desc}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: PAYMENT */}
          <section id="payment" className="space-y-6 pt-6 border-t border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>{content.paymentOptions}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-zinc-900">{content.pay1Title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.pay1Desc}
                </p>
              </div>

              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-zinc-900">{content.pay2Title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.pay2Desc}
                </p>
              </div>

              <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-zinc-700" />
                  <h3 className="font-bold text-sm text-zinc-900">{content.pay3Title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {content.pay3Desc}
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
