'use client';

import React, { useState } from 'react';
import { Settings, RotateCcw, Download, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSettingsPage() {
  const {
    products,
    categories,
    brands,
    blogPosts,
    orders,
    resetToDefaultData,
  } = useStore();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить все данные к исходному демонстрационному каталогу? Текущие изменения будут заменены.')) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  const exportData = () => {
    const backup = {
      products,
      categories,
      brands,
      blogPosts,
      orders,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hykon_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <span>Настройки магазина и База данных</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Управление резервными копиями, синхронизацией и демонстрационными данными
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>База данных успешно сброшена к исходным эталонным товарам и категориям!</span>
        </div>
      )}

      {/* Stats Breakdown */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
          Статистика хранилища
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="text-zinc-400">Товаров в БД</div>
            <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{products.length}</div>
          </div>
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="text-zinc-400">Категорий</div>
            <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{categories.length}</div>
          </div>
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="text-zinc-400">Брендов</div>
            <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{brands.length}</div>
          </div>
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="text-zinc-400">Заказов</div>
            <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Export / Backup */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
          Резервное копирование и Экспорт
        </h2>
        <p className="text-xs text-zinc-600">
          Вы можете выгрузить весь каталог товаров со спецификациями, категориями и заказами в формате JSON.
        </p>

        <button
          onClick={exportData}
          className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Экспортировать JSON дамп
        </button>
      </div>

      {/* Reset Section */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Опасная зона: Сброс базы данных</span>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Нажатие кнопки восстановит заводской набор товаров (Apple MacBook Pro M3 Max, Asus Zephyrus OLED, iPhone 16 Pro Max, Sony WH-1000XM5, LG G4 OLED, Dyson V15 и др.) и полную 3-уровневую структуру категорий.
        </p>

        <button
          onClick={handleReset}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" /> Сбросить данные к эталонным
        </button>
      </div>
    </div>
  );
}
