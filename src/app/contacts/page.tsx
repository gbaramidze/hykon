'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactsPage() {
  const { language, getLocalizedHref } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const labels = {
    ka: {
      home: 'მთავარი',
      title: 'კონტაქტები და შოურუმი',
      subtitle: 'ჩვენი შოურუმი მდებარეობს ბათუმში. მზად ვართ გიპასუხოთ ნებისმიერ კითხვაზე.',
      showroomAddressTitle: 'შოურუმის მისამართი',
      addressLine1: 'საქართველო, ქ. ბათუმი',
      addressLine2: 'ბათუმი, საქართველო (Batumi, Georgia)',
      workHoursTitle: 'სამუშაო საათები',
      workHours: 'ორშაბათი — კვირა: 10:00 – 21:00 (ყოველდღე, დასვენების გარეშე)',
      phoneSupportTitle: 'მომხმარებელთა მხარდაჭერა',
      emailTitle: 'ელექტრონული ფოსტა',
      forGeneral: 'ზოგადი კითხვებისთვის:',
      forB2B: 'იურიდიული პირებისთვის:',
      showroomMapNote: 'მოსახერხებელი პარკინგი და შეკვეთების თვითგატანის პუნქტი',
      formTitle: 'მოგვწერეთ შეტყობინება',
      formSubtitle: 'კონსულტანტები გიპასუხებენ 15 წუთის განმავლობაში',
      successMsg: 'თქვენი შეტყობინება გაგზავნილია! მალე დაგიკავშირდებით.',
      nameLabel: 'თქვენი სახელი *',
      namePlaceholder: 'გიორგი',
      contactLabel: 'Email ან ტელეფონის ნომერი *',
      contactPlaceholder: '+995 599 ... ან email@domain.ge',
      msgLabel: 'შეტყობინების ტექსტი *',
      msgPlaceholder: 'მოდელის ხელმისაწვდომობა ან კონსულტაცია...',
      submitBtn: 'შეტყობინების გაგზავნა',
    },
    en: {
      home: 'Home',
      title: 'Contacts & Showroom',
      subtitle: 'We are located in Batumi and ready to answer any questions',
      showroomAddressTitle: 'Showroom Address',
      addressLine1: 'Batumi, Georgia',
      addressLine2: 'Batumi, Georgia (ბათუმი, საქართველო)',
      workHoursTitle: 'Working Hours',
      workHours: 'Monday — Sunday: 10:00 – 21:00 (Daily, no days off)',
      phoneSupportTitle: 'Customer Support Phone',
      emailTitle: 'Email Addresses',
      forGeneral: 'For general inquiries:',
      forB2B: 'For B2B & Corporate:',
      showroomMapNote: 'Convenient customer parking and order pickup counter',
      formTitle: 'Send us a message',
      formSubtitle: 'Our technical specialists will reply within 15 minutes during business hours',
      successMsg: 'Your message has been sent! We will contact you shortly.',
      nameLabel: 'Your Name *',
      namePlaceholder: 'Alex',
      contactLabel: 'Email or Phone Number *',
      contactPlaceholder: '+995 599 ... or name@mail.com',
      msgLabel: 'Message Details *',
      msgPlaceholder: 'Inquire about models, quotes, or setup support...',
      submitBtn: 'Send Message',
    },
    ru: {
      home: 'Главная',
      title: 'Контакты и Флагманский Шоурум',
      subtitle: 'Мы находимся в Батуми и рады ответить на любые технические и коммерческие вопросы',
      showroomAddressTitle: 'Адрес шоурума',
      addressLine1: 'Грузия, г. Батуми',
      addressLine2: 'ბათუმი, საქართველო (Batumi, Georgia)',
      workHoursTitle: 'Часы работы',
      workHours: 'Понедельник — Воскресенье: 10:00 – 21:00 (без выходных)',
      phoneSupportTitle: 'Телефон клиентской поддержки',
      emailTitle: 'Электронная почта',
      forGeneral: 'Для общих вопросов:',
      forB2B: 'Для юр. лиц и B2B:',
      showroomMapNote: 'Удобная парковка для клиентов и пункт самовывоза заказов',
      formTitle: 'Напишите нам сообщение',
      formSubtitle: 'Консультанты ответят вам в течение 15 минут в рабочее время',
      successMsg: 'Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.',
      nameLabel: 'Ваше имя *',
      namePlaceholder: 'Ираклий',
      contactLabel: 'Email или телефон *',
      contactPlaceholder: '+995 599 ... или name@mail.com',
      msgLabel: 'Текст сообщения *',
      msgPlaceholder: 'Интересует наличие модели или консультация...',
      submitBtn: 'Отправить сообщение',
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">{labels.title}</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            {labels.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {labels.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info & Map (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{labels.showroomAddressTitle}</h3>
                  <p className="text-xs text-zinc-900 font-medium mt-0.5">
                    {labels.addressLine1}
                  </p>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">
                    {labels.addressLine2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{labels.workHoursTitle}</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {labels.workHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{labels.phoneSupportTitle}</h3>
                  <a
                    href="tel:+995591432525"
                    className="text-sm text-zinc-900 font-mono font-bold hover:text-emerald-600 block mt-0.5"
                  >
                    +995 591 43 25 25
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{labels.emailTitle}</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {labels.forGeneral} <a href="mailto:support@hykon.ge" className="font-semibold underline">support@hykon.ge</a><br />
                    {labels.forB2B} <a href="mailto:b2b@hykon.ge" className="font-semibold underline">b2b@hykon.ge</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Showroom Map Representation */}
            <div className="bg-zinc-100 rounded-2xl border border-zinc-200 aspect-video flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-2" />
              <div className="font-bold text-sm text-zinc-900">HYKON Store & Showroom</div>
              <div className="text-xs text-zinc-600 mt-0.5">ბათუმი, საქართველო</div>
              <div className="text-[11px] text-zinc-400">Batumi, Georgia</div>
              <div className="mt-3 text-[10px] bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-700">
                {labels.showroomMapNote}
              </div>
            </div>
          </div>

          {/* Contact Form (6 cols) */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-xs"
            >
              <h2 className="text-lg font-bold text-zinc-900">
                {labels.formTitle}
              </h2>
              <p className="text-xs text-zinc-500">
                {labels.formSubtitle}
              </p>

              {sent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>{labels.successMsg}</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {labels.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={labels.namePlaceholder}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {labels.contactLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={labels.contactPlaceholder}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {labels.msgLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={labels.msgPlaceholder}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> {labels.submitBtn}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
