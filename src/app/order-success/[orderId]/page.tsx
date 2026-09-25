'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { orders, formatPrice } = useStore();

  const order = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Заказ не найден</h1>
          <Link href="/" className="text-xs font-semibold text-blue-600 underline">
            Вернуться на главную
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-3xl font-extrabold text-zinc-950">
            Спасибо за ваш заказ!
          </h1>

          <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
            Номер заказа: <b className="font-mono text-zinc-900 text-sm">{order.orderNumber}</b>.
            Мы отправили подтверждение на {order.customer.email || 'ваш номер'}. Менеджер свяжется с вами для уточнения деталей.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" /> Распечатать чек
            </button>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              Продолжить покупки <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Printable Order Receipt */}
        <div id="printable-receipt" className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-10 space-y-8 shadow-xs">
          {/* Top Receipt Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
                HYKON.GE • КАССОВЫЙ ЧЕК / ЗАКАЗ
              </div>
              <div className="text-2xl font-extrabold text-zinc-950 font-mono mt-1">
                {order.orderNumber}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-zinc-500">
              <div>Дата: {new Date(order.createdAt).toLocaleString()}</div>
              <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold mt-1 bg-blue-50 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Статус: {order.status === 'pending' ? 'Принят в обработку' : order.status}
              </div>
            </div>
          </div>

          {/* Customer and Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
            <div className="space-y-2 bg-white p-5 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                Получатель
              </h4>
              <p className="font-semibold text-sm text-zinc-900">{order.customer.fullName}</p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400" /> {order.customer.phone}
              </p>
              <p>{order.customer.email}</p>
            </div>

            <div className="space-y-2 bg-white p-5 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                Доставка и Оплата
              </h4>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>
                  {order.deliveryMethod === 'pickup'
                    ? 'Самовывоз: г. Тбилиси, пр. Чавчавадзе 37'
                    : `${order.customer.city}, ${order.customer.address}`}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  Оплата:{' '}
                  {order.paymentMethod === 'card'
                    ? 'Банковская карта онлайн'
                    : order.paymentMethod === 'cash'
                    ? 'Оплата курьеру при получении'
                    : order.paymentMethod === 'installment'
                    ? 'Рассрочка 0%'
                    : 'Безналичный расчет'}
                </span>
              </p>
            </div>
          </div>

          {/* Items Breakdown Table */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-3 bg-zinc-100 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700">
              Состав заказа
            </div>
            <div className="divide-y divide-zinc-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden flex-shrink-0 p-1">
                      <Image src={item.image} alt={item.productTitle} fill className="object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{item.productTitle}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">SKU: {item.productSku}</div>
                      {item.selectedVariants && (
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          {Object.values(item.selectedVariants).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-zinc-500">{item.quantity} шт.</div>
                    <div className="text-sm font-bold font-mono text-zinc-950">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total calculations */}
          <div className="space-y-2 border-t border-zinc-200 pt-4 text-xs text-zinc-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Сумма заказа:</span>
              <span className="font-mono font-semibold text-zinc-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span className="font-mono font-semibold text-zinc-900">
                {order.shippingFee === 0 ? <span className="text-emerald-600">Бесплатно</span> : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-zinc-200 pt-2 text-sm">
              <span className="font-bold text-zinc-900">Итого:</span>
              <span className="text-xl font-extrabold text-zinc-950 font-mono">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
