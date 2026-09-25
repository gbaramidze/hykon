'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  X,
  MapPin,
  Phone,
  CreditCard,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const { orders, formatPrice, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <span>Управление заказами</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Всего {orders.length} заказов в интернет-магазине
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Поиск по номеру заказа, имени клиента или телефону..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st === 'all'
                ? 'Все'
                : st === 'pending'
                ? 'Новые'
                : st === 'processing'
                ? 'В обработке'
                : st === 'shipped'
                ? 'Отправлены'
                : st === 'delivered'
                ? 'Доставлены'
                : 'Отменены'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Заказ & Дата</th>
                <th className="px-4 py-3.5">Покупатель</th>
                <th className="px-4 py-3.5">Город & Доставка</th>
                <th className="px-4 py-3.5">Сумма</th>
                <th className="px-4 py-3.5">Статус</th>
                <th className="px-6 py-3.5 text-right">Детали</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-zinc-900 text-sm">
                      {order.orderNumber}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-zinc-900">{order.customer.fullName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{order.customer.phone}</div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-medium text-zinc-800">{order.customer.city}</div>
                    <div className="text-[10px] text-zinc-500">
                      {order.deliveryMethod === 'courier' ? 'Курьер' : 'Самовывоз'}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-extrabold text-zinc-950 font-mono text-sm">
                      {formatPrice(order.total)}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {order.items.length} поз.
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                        order.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : order.status === 'processing'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : order.status === 'shipped'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}
                    >
                      <option value="pending">Новый (Pending)</option>
                      <option value="processing">В обработке (Processing)</option>
                      <option value="shipped">Отправлен (Shipped)</option>
                      <option value="delivered">Доставлен (Delivered)</option>
                      <option value="cancelled">Отменен (Cancelled)</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setActiveOrderModal(order)}
                      className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-4 h-4" /> <span>Просмотр</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-zinc-200 relative space-y-6">
            <button
              onClick={() => setActiveOrderModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase">
                Детали заказа
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-950 font-mono">
                {activeOrderModal.orderNumber}
              </h2>
              <div className="text-xs text-zinc-500 mt-0.5">
                Оформлен: {new Date(activeOrderModal.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-zinc-900">Покупатель:</div>
                <div>{activeOrderModal.customer.fullName}</div>
                <div className="font-mono">{activeOrderModal.customer.phone}</div>
                <div>{activeOrderModal.customer.email}</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-zinc-900">Адрес & Доставка:</div>
                <div>
                  {activeOrderModal.customer.city}, {activeOrderModal.customer.address}
                </div>
                <div>Способ: {activeOrderModal.deliveryMethod}</div>
                {activeOrderModal.customer.notes && (
                  <div className="text-zinc-500 italic mt-1">
                    «{activeOrderModal.customer.notes}»
                  </div>
                )}
              </div>
            </div>

            {/* Products in Order */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Содержимое заказа
              </h3>
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden">
                {activeOrderModal.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0 p-1">
                        <Image src={item.image} alt="" fill className="object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{item.productTitle}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">SKU: {item.productSku}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">{item.quantity} шт.</div>
                      <div className="text-xs font-bold font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status change */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <div>
                <span className="text-xs text-zinc-500 block">Итого к оплате:</span>
                <span className="text-2xl font-extrabold font-mono text-zinc-950">
                  {formatPrice(activeOrderModal.total)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateOrderStatus(activeOrderModal.id, 'delivered');
                    setActiveOrderModal({ ...activeOrderModal, status: 'delivered' });
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Отметить доставленным
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
