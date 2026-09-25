'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, formatPrice } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 150 || subtotal === 0 ? 0 : 7;
  const total = subtotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'HYKON2026' || promoCode.trim().toUpperCase() === 'TECH10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      setPromoError('Неверный промокод или срок действия истек. Попробуйте TECH10');
    }
  };

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
          <span className="text-black font-semibold">Корзина</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7" />
              <span>Корзина</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {cart.length > 0 ? `Товаров в корзине: ${cart.reduce((a, b) => a + b.quantity, 0)}` : 'Корзина пуста'}
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Очистить корзину
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-16 text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Ваша корзина пуста</h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Самое время добавить понравившиеся гаджеты и технику из каталога!
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                <span>Перейти в каталог</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery progress bar */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-zinc-800">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    {subtotal >= 150 ? (
                      <span className="text-emerald-700">У вас бесплатная доставка по всей Грузии!</span>
                    ) : (
                      <span>
                        До бесплатной доставки осталось <b>{formatPrice(150 - subtotal)}</b>
                      </span>
                    )}
                  </span>
                  <span className="text-zinc-500 font-mono text-[11px]">150 ₾</span>
                </div>
                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Cart Items Cards */}
              <div className="bg-white border border-zinc-200 rounded-2xl divide-y divide-zinc-200 overflow-hidden">
                {cart.map(item => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex-shrink-0 p-2">
                      <Image
                        src={item.product.thumbnail || item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {item.product.brand}
                      </div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-bold text-zinc-900 hover:text-blue-600 line-clamp-2 leading-snug transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        SKU: {item.product.sku}
                      </div>

                      {/* Selected Variants */}
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Object.entries(item.selectedVariants).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50 px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 text-zinc-600 hover:text-black font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 text-zinc-600 hover:text-black font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                      <div className="text-base font-extrabold text-zinc-950 font-mono">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-200 pb-3">
                  Сумма заказа
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Товары ({cart.reduce((a, b) => a + b.quantity, 0)} шт.):</span>
                    <span className="font-mono font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Скидка по промокоду ({discountPercent}%):</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {shippingFee === 0 ? <span className="text-emerald-600">Бесплатно</span> : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-zinc-900">Итого к оплате:</span>
                    <span className="text-2xl font-extrabold text-zinc-950 font-mono">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Promo code form */}
                <form onSubmit={handleApplyPromo} className="pt-2 border-t border-zinc-200 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Промокод (TECH10)"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="w-full bg-white border border-zinc-300 text-xs px-3 py-2 rounded-lg font-mono uppercase focus:outline-none focus:border-black"
                      />
                      <Tag className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Применить
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Промокод на скидку 10% успешно применен!
                    </div>
                  )}
                  {promoError && (
                    <div className="text-[11px] text-rose-600 font-medium">{promoError}</div>
                  )}
                </form>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md block text-center"
                >
                  <span>Перейти к оформлению</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-2 pt-2 text-[11px] text-zinc-500 border-t border-zinc-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Безопасная оплата картами Visa / Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Оплата при получении курьеру доступна</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
