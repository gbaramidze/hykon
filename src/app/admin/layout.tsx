'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  FileText,
  Building2,
  Settings,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const NAV_ITEMS = [
  { label: 'Дашборд', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Товары', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
  { label: 'Категории (Дерево)', href: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
  { label: 'Заказы', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
  { label: 'Блог и статьи', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
  { label: 'Бренды', href: '/admin/brands', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Настройки и БД', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orders } = useStore();

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen flex bg-zinc-100 text-zinc-900 antialiased font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between border-r border-zinc-800 p-4 shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="px-3 py-2 border-b border-zinc-800 pb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-bold tracking-tighter text-sm rounded-sm font-mono">
                H
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white font-mono">
                  HYKON ADMIN
                </span>
                <span className="text-[10px] text-zinc-400">Управление магазином</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>

                  {item.href === '/admin/orders' && pendingOrdersCount > 0 && (
                    <span className="bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom return to site link */}
        <div className="border-t border-zinc-800 pt-4 px-2 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-white py-2 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> На сайт магазина
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile top strip */}
        <div className="bg-zinc-950 text-white p-4 flex items-center justify-between md:hidden">
          <Link href="/admin" className="font-bold text-sm font-mono">
            HYKON ADMIN
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/admin/products" className="text-zinc-300 hover:text-white">
              Товары
            </Link>
            <Link href="/admin/categories" className="text-zinc-300 hover:text-white">
              Категории
            </Link>
            <Link href="/admin/orders" className="text-zinc-300 hover:text-white">
              Заказы
            </Link>
            <Link href="/" className="text-blue-400 font-semibold">
              Магазин
            </Link>
          </div>
        </div>

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
