'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ContactsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">Контакты и Шоурум</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950">
            Контакты и Флагманский Шоурум
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Мы находимся в самом центре Тбилиси и рады ответить на любые вопросы
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info & Map (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Адрес шоурума</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Грузия, г. Тбилиси, пр. Ильи Чавчавадзе 37 (метро Делиси / Ваке)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Часы работы</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Понедельник — Воскресенье: 10:00 – 21:00 (без перерывов и выходных)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Телефон клиентской поддержки</h3>
                  <a
                    href="tel:+995322005599"
                    className="text-xs text-zinc-900 font-mono font-bold hover:text-blue-600 block mt-0.5"
                  >
                    +995 (32) 200-55-99
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Электронная почта</h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Для общих вопросов: <a href="mailto:support@hykon.ge" className="font-semibold underline">support@hykon.ge</a><br />
                    Для юр. лиц: <a href="mailto:b2b@hykon.ge" className="font-semibold underline">b2b@hykon.ge</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Showroom Map Representation */}
            <div className="bg-zinc-100 rounded-2xl border border-zinc-200 aspect-video flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-2" />
              <div className="font-bold text-xs text-zinc-900">HYKON Store Tbilisi</div>
              <div className="text-[11px] text-zinc-500">пр. Ильи Чавчавадзе 37</div>
              <div className="mt-3 text-[10px] bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-700">
                Рядом удобная охраняемая парковка для клиентов
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
                Напишите нам сообщение
              </h2>
              <p className="text-xs text-zinc-500">
                Консультанты ответят вам в течение 15 минут в рабочее время
              </p>

              {sent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ираклий"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Email или телефон *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+995 599 ... или name@mail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Текст сообщения *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Интересует наличие модели или консультация..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Отправить сообщение
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
