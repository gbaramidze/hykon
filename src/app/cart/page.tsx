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
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, formatPrice } = useStore();
  const { language, t, translateProductTitle, getLocalizedHref } = useLanguage();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 150 || subtotal === 0 ? 0 : 7;
  const total = subtotal - discountAmount + shippingFee;

  const promoLabels = {
    ka: {
      itemsInCart: `კალათაშია: ${cart.reduce((a, b) => a + b.quantity, 0)} ც.`,
      clearCart: 'კალათის გასუფთავება',
      discount: 'ფასდაკლება პრომოკოდით',
      promoPlaceholder: 'პრომოკოდი (TECH10)',
      apply: 'გამოყენება',
      promoSuccess: '10%-იანი ფასდაკლების პრომოკოდი გააქტიურდა!',
      promoError: 'არასწორი პრომოკოდი. სცადეთ TECH10',
      freeDeliveryNotice: 'უფასო მიწოდება მთელ საქართველოში!',
      freeDeliveryLeft: 'უფასო მიწოდებამდე დარჩა',
      itemsQty: 'ც.',
      bankTransferGuarantee: 'საბანკო გადარიცხვა და ინვოისი (RS.GE)',
      codGuarantee: 'გადახდა მიღებისას კურიერთან ხელმისაწვდომია',
      emptyDesc: 'დაამატეთ სასურველი მოწყობილობები კატალოგიდან!',
      goToCatalog: 'კატალოგში გადასვლა',
      home: 'მთავარი',
    },
    en: {
      itemsInCart: `Items in cart: ${cart.reduce((a, b) => a + b.quantity, 0)}`,
      clearCart: 'Clear Cart',
      discount: 'Promo Discount',
      promoPlaceholder: 'Promo Code (TECH10)',
      apply: 'Apply',
      promoSuccess: '10% discount promo code successfully applied!',
      promoError: 'Invalid or expired promo code. Try TECH10',
      freeDeliveryNotice: 'Free shipping across Georgia!',
      freeDeliveryLeft: 'Add for free delivery:',
      itemsQty: 'pcs',
      bankTransferGuarantee: 'Bank Transfer & RS.GE Official Invoice',
      codGuarantee: 'Cash or card on delivery available',
      emptyDesc: 'Explore our catalog and add security tech and equipment!',
      goToCatalog: 'Browse Catalog',
      home: 'Home',
    },
    ru: {
      itemsInCart: `Товаров в корзине: ${cart.reduce((a, b) => a + b.quantity, 0)}`,
      clearCart: 'Очистить корзину',
      discount: 'Скидка по промокоду',
      promoPlaceholder: 'Промокод (TECH10)',
      apply: 'Применить',
      promoSuccess: 'Промокод на скидку 10% успешно применен!',
      promoError: 'Неверный промокод или срок действия истек. Попробуйте TECH10',
      freeDeliveryNotice: 'У вас бесплатная доставка по всей Грузии!',
      freeDeliveryLeft: 'До бесплатной доставки осталось',
      itemsQty: 'шт.',
      bankTransferGuarantee: 'Безналичный расчет / Банковский перевод (Инвойс)',
      codGuarantee: 'Оплата при получении курьеру доступна',
      emptyDesc: 'Самое время добавить понравившиеся гаджеты и технику из каталога!',
      goToCatalog: 'Перейти в каталог',
      home: 'Главная',
    },
  }[language];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'HYKON2026' || promoCode.trim().toUpperCase() === 'TECH10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      setPromoError(promoLabels.promoError);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {promoLabels.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">{t.cartTitle}</span>
        </nav>

        <div className="border-b border-zinc-200 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7" />
              <span>{t.cartTitle}</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {cart.length > 0 ? promoLabels.itemsInCart : t.emptyCart}
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {promoLabels.clearCart}
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-16 text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">{t.emptyCart}</h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              {promoLabels.emptyDesc}
            </p>
            <div className="pt-2">
              <Link
                href={getLocalizedHref('/catalog')}
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                <span>{promoLabels.goToCatalog}</span>
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
                      <span className="text-emerald-700">{promoLabels.freeDeliveryNotice}</span>
                    ) : (
                      <span>
                        {promoLabels.freeDeliveryLeft} <b>{formatPrice(150 - subtotal)}</b>
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
                    <div className="relative w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden shrink-0 p-2">
                      <Image
                        src={item.product.thumbnail || item.product.images[0]}
                        alt={translateProductTitle(item.product.title)}
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
                        href={getLocalizedHref(`/product/${item.product.slug}`)}
                        className="text-sm font-bold text-zinc-900 hover:text-blue-600 line-clamp-2 leading-snug transition-colors"
                      >
                        {translateProductTitle(item.product.title)}
                      </Link>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        {t.sku}: {item.product.sku}
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
                        className="px-2 text-zinc-600 hover:text-black font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 text-zinc-600 hover:text-black font-bold text-xs cursor-pointer"
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
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title={language === 'ka' ? 'წაშლა' : language === 'en' ? 'Remove' : 'Удалить'}
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
                  {t.orderSummary}
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>{t.subtotal} ({cart.reduce((a, b) => a + b.quantity, 0)} {promoLabels.itemsQty}):</span>
                    <span className="font-mono font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>{promoLabels.discount} ({discountPercent}%):</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t.shipping}:</span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {shippingFee === 0 ? <span className="text-emerald-600">{t.free}</span> : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-zinc-900">{t.total}:</span>
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
                        placeholder={promoLabels.promoPlaceholder}
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="w-full bg-white border border-zinc-300 text-xs px-3 py-2 rounded-lg font-mono uppercase focus:outline-none focus:border-black"
                      />
                      <Tag className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {promoLabels.apply}
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> {promoLabels.promoSuccess}
                    </div>
                  )}
                  {promoError && (
                    <div className="text-[11px] text-rose-600 font-medium">{promoError}</div>
                  )}
                </form>

                {/* Checkout Button */}
                <Link
                  href={getLocalizedHref('/checkout')}
                  className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md block text-center cursor-pointer"
                >
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-2 pt-2 text-[11px] text-zinc-500 border-t border-zinc-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{promoLabels.bankTransferGuarantee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{promoLabels.codGuarantee}</span>
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
