'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Truck,
  Building2,
  Banknote,
  Percent,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, formatPrice, createOrder } = useStore();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  const [city, setCity] = useState('Тбилиси');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'installment' | 'bank_transfer'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'courier' && subtotal < 150 ? 7 : 0;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || (deliveryMethod === 'courier' && !address)) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    const order = createOrder({
      customer: {
        fullName,
        phone,
        email: email || 'customer@hykon.ge',
        city,
        address: deliveryMethod === 'pickup' ? 'Самовывоз из шоурума (Тбилиси, пр. Чавчавадзе 37)' : address,
        notes,
      },
      deliveryMethod,
      pickupLocation: deliveryMethod === 'pickup' ? 'Тбилиси, пр. Чавчавадзе 37' : undefined,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.productId,
        productTitle: item.product.title,
        productSku: item.product.sku,
        image: item.product.thumbnail || item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
      })),
      subtotal,
      discount: 0,
      shippingFee,
      total,
      status: 'pending',
    });

    router.push(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Корзина пуста</h1>
          <p className="text-xs text-zinc-500 mb-6">
            Для оформления заказа сначала добавьте товары в корзину.
          </p>
          <Link
            href="/catalog"
            className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            Перейти в каталог
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8 w-full max-w-full overflow-hidden">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <Link href="/cart" className="hover:text-black">
            Корзина
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">Оформление заказа</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-zinc-950 mb-8">
          Оформление заказа
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Steps Form (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* STEP 1: CONTACT INFO */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                  <div className="w-7 h-7 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-zinc-950">
                    Контактные данные покупателя
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                      Имя и Фамилия *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Георгий Двали"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                      Номер телефона *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+995 599 00 00 00"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      placeholder="example@mail.ge"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: DELIVERY METHOD */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                  <div className="w-7 h-7 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-zinc-950">
                    Способ получения
                  </h2>
                </div>

                {/* Delivery Option Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'courier'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-xs text-zinc-900">Курьерская доставка</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Доставка прямо до двери по Тбилиси и всей Грузии.
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-xs text-zinc-900">Самовывоз из шоурума</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      г. Тбилиси, пр. Чавчавадзе 37 (Бесплатно, сегодня)
                    </p>
                  </div>
                </div>

                {/* Courier Fields */}
                {deliveryMethod === 'courier' ? (
                  <div className="space-y-4 pt-2 border-t border-zinc-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                          Город *
                        </label>
                        <select
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs focus:outline-none focus:border-black font-medium"
                        >
                          <option value="Тбилиси">Тбилиси (Tbilisi)</option>
                          <option value="Батуми">Батуми (Batumi)</option>
                          <option value="Кутаиси">Кутаиси (Kutaisi)</option>
                          <option value="Рустави">Рустави (Rustavi)</option>
                          <option value="Телави">Телави (Telavi)</option>
                          <option value="Другой город">Другой населенный пункт</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                          Улица, дом, квартира / офис *
                        </label>
                        <input
                          type="text"
                          required={deliveryMethod === 'courier'}
                          placeholder="ул. Руставели 15, кв. 8"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700 space-y-1">
                    <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      Шоурум HYKON: г. Тбилиси, пр. Ильи Чавчавадзе 37
                    </div>
                    <p className="text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Режим работы: ежедневно с 10:00 до 21:00 без выходных.
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Комментарий к заказу (код домофона, удобное время доставки)
                  </label>
                  <input
                    type="text"
                    placeholder="Например: позвонить за полчаса"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* STEP 3: PAYMENT METHOD */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                  <div className="w-7 h-7 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h2 className="text-lg font-bold text-zinc-950">
                    Способ оплаты
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-xs text-zinc-900">Банковская карта онлайн</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Visa, Mastercard, Apple Pay, Google Pay без комиссии.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-xs text-zinc-900">Оплата при получении</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Наличными или картой через терминал курьеру.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('installment')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'installment'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Percent className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-xs text-zinc-900">Рассрочка 0%</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Беспроцентная онлайн рассрочка TBC / Bank of Georgia.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-black bg-zinc-50/70'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-xs text-zinc-900">Безналичный расчет</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Для юридических лиц с предоставлением счет-фактуры.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4 sticky top-24">
                <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-200 pb-3">
                  Ваш заказ ({cart.length} поз.)
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-zinc-200/60">
                  {cart.map(item => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white border border-zinc-200 rounded-lg overflow-hidden flex-shrink-0 p-1">
                        <Image
                          src={item.product.thumbnail || item.product.images[0]}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 truncate">
                          {item.product.title}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-950">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Сумма товаров:</span>
                    <span className="font-mono font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {shippingFee === 0 ? <span className="text-emerald-600">Бесплатно</span> : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900 text-sm">Итого:</span>
                    <span className="text-2xl font-extrabold text-zinc-950 font-mono">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Оформление...' : 'Подтвердить и оформить заказ'}</span>
                </button>

                <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь с условиями публичной оферты и правилами обработки персональных данных.
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
