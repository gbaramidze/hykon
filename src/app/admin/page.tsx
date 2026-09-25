'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminDashboardPage() {
  const { products, categories, orders, formatPrice, updateOrderStatus } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const lowStockProducts = products.filter(p => p.stockCount <= 5);
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950">
            Панель управления магазином
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Сводка продаж, управление каталогом, категориями и заказами в реальном времени
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products?action=new"
            className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Добавить товар
          </Link>
          <Link
            href="/admin/categories"
            className="bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5" /> Категории
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Общая выручка</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-950 font-mono">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            По подтвержденным заказам
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Всего заказов</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-950 font-mono">
            {orders.length}
          </div>
          <div className="text-[11px] text-zinc-500">
            {orders.filter(o => o.status === 'pending').length} ожидают обработки
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Товаров в каталоге</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-950 font-mono">
            {products.length}
          </div>
          <div className="text-[11px] text-zinc-500">
            В {categories.length} категориях и подкатегориях
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Мало на складе</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-950 font-mono">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            Остаток ≤ 5 шт.
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Последние заказы</h2>
              <p className="text-xs text-zinc-500">Поступающие заявки от покупателей</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Все заказы <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-200 overflow-x-auto">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order.id} className="p-5 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-zinc-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-zinc-800 mt-1">
                      {order.customer.fullName} ({order.customer.city})
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {order.items.length} поз. • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-zinc-950 font-mono">
                      {formatPrice(order.total)}
                    </div>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                      className="mt-1 bg-zinc-100 border border-zinc-200 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="processing">В работе</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400">Нет заказов</div>
            )}
          </div>
        </div>

        {/* Quick Low Stock Alert (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Остатки на исходе</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono font-bold">
              {lowStockProducts.length}
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map(prod => (
              <div key={prod.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-900 truncate">
                    {prod.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    SKU: {prod.sku}
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-rose-50 text-rose-700 text-xs font-mono font-bold px-2 py-0.5 rounded">
                    {prod.stockCount} шт.
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-800 pt-2"
          >
            Управление складом товаров →
          </Link>
        </div>
      </div>
    </div>
  );
}
