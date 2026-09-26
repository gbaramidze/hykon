'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { categories } = useStore();
  const { language, t, translateCategoryName, getLocalizedHref } = useLanguage();

  const labels = {
    ka: {
      freeDeliveryTitle: 'უფასო მიწოდება 150 ₾-დან',
      freeDeliverySub: 'ბათუმი, თბილისი და საქართველოს ყველა რეგიონი',
      warrantyTitle: 'ოფიციალური გარანტია 3 წლამდე',
      warrantySub: 'Hikvision, Uniview, Ajax, ZKTeco, Ruijie',
      returnTitle: '14 დღიანი დაბრუნების გარანტია',
      returnSub: 'მარტივი გაცვლა და თანხის დაბრუნება',
      b2bTitle: 'B2B & ინვოისები (RS.GE)',
      b2bSub: 'ოფიციალური ანგარიშ-ფაქტურა და დოკუმენტაცია',
      workHours: 'ორშაბათი — კვირა: 10:00 – 21:00',
      showroomCity: 'ქ. ბათუმი, საქართველო',
      allRights: 'ყველა უფლება დაცულია.',
    },
    en: {
      freeDeliveryTitle: 'Free Shipping from 150 ₾',
      freeDeliverySub: 'Batumi, Tbilisi and all regions across Georgia',
      warrantyTitle: 'Official Warranty up to 3 Years',
      warrantySub: 'Hikvision, Uniview, Ajax, ZKTeco, Ruijie',
      returnTitle: '14-Day Return Guarantee',
      returnSub: 'Hassle-free exchange and fast returns',
      b2bTitle: 'B2B & Invoices (RS.GE)',
      b2bSub: 'Official tax invoice and full documentation',
      workHours: 'Monday — Sunday: 10:00 – 21:00',
      showroomCity: 'Batumi, Georgia',
      allRights: 'All rights reserved.',
    },
    ru: {
      freeDeliveryTitle: 'Бесплатная доставка от 150 ₾',
      freeDeliverySub: 'Батуми, Тбилиси и все регионы Грузии',
      warrantyTitle: 'Официальная гарантия до 3 лет',
      warrantySub: 'Hikvision, Uniview, Ajax, ZKTeco, Ruijie',
      returnTitle: '14 дней гарантия возврата',
      returnSub: 'Простой обмен и возврат без лишних вопросов',
      b2bTitle: 'B2B и Инвойсы (RS.GE)',
      b2bSub: 'Официальный счет-фактура и закрывающие документы',
      workHours: 'Понедельник — Воскресенье: 10:00 – 21:00',
      showroomCity: 'г. Батуми, Грузия',
      allRights: 'Все права защищены.',
    },
  }[language];

  return (
    <footer className="bg-zinc-950 text-white pt-12 sm:pt-16 pb-24 md:pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Propositions Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-zinc-800/80">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">{labels.freeDeliveryTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{labels.freeDeliverySub}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="p-3 bg-blue-950/60 border border-blue-800/50 rounded-xl text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">{labels.warrantyTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{labels.warrantySub}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="p-3 bg-purple-950/60 border border-purple-800/50 rounded-xl text-purple-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">{labels.returnTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{labels.returnSub}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-xl text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">{labels.b2bTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{labels.b2bSub}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-zinc-800/80">
          {/* Brand Info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm pt-1">
              {t.footerAbout}
            </p>
            <div className="text-xs text-zinc-400 space-y-1 font-mono pt-2 border-t border-zinc-850">
              <p className="text-zinc-200 font-semibold">{t.companyName}</p>
              <p className="text-zinc-400">{t.companyId}</p>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              {t.categories}
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link
                    href={getLocalizedHref(`/catalog/${cat.slug}`)}
                    className="hover:text-blue-400 transition-colors block py-0.5"
                  >
                    {translateCategoryName(cat.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              {t.forCustomers}
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href={getLocalizedHref('/delivery')} className="hover:text-blue-400 transition-colors block py-0.5">
                  {t.deliveryAndPayment}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/compare')} className="hover:text-blue-400 transition-colors block py-0.5">
                  {t.compare}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/brands')} className="hover:text-blue-400 transition-colors block py-0.5">
                  {t.brands}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/blog')} className="hover:text-blue-400 transition-colors block py-0.5">
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/contacts')} className="hover:text-blue-400 transition-colors block py-0.5">
                  {t.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Showroom */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              {t.contacts}
            </h5>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-zinc-200 font-medium">{labels.showroomCity}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-[11px] leading-tight">{labels.workHours}</span>
              </div>
              <div className="pt-2 border-t border-zinc-850 space-y-1.5">
                <a
                  href="tel:+995591432525"
                  className="text-white font-mono font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors text-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  +995 591 43 25 25
                </a>
                <a
                  href="mailto:support@hykon.ge"
                  className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors text-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  support@hykon.ge
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} HYKON.GE. {labels.allRights}
          </div>

          <div className="flex items-center flex-wrap gap-2.5 text-zinc-400 text-xs">
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-300">
              Bank of Georgia
            </span>
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-300">
              TBC Bank
            </span>
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-300">
              RS.GE Invoice
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
