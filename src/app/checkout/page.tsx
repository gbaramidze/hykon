'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Building2,
  Banknote,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  FileText,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, formatPrice, createOrder } = useStore();
  const { language, t, translateProductTitle, getLocalizedHref } = useLanguage();

  const checkoutLabels = {
    ka: {
      home: 'მთავარი',
      namePlaceholder: 'დავით ბერიძე / შპს ჰაიკონ',
      taxIdLabel: 'საიდენტიფიკაციო კოდი (ს/კ ან პ/ნ)',
      taxIdNote: '(ინვოისისთვის)',
      taxIdPlaceholder: '405591432 / 010190...',
      emailNote: '(ინვოისის მისაღებად)',
      emailPlaceholder: 'info@example.ge',
      defaultCity: 'ბათუმი',
      addressPlaceholder: 'ქუჩა, კორპუსი, ბინა...',
      notesPlaceholder: 'სასურველი მიწოდების დრო, დამატებითი კომენტარი...',
      invoiceBadge: 'ინვოისი',
      secureCheckout: '🔒 უსაფრთხო შეკვეთა და ოფიციალური დოკუმენტაცია',
      instantInvoice: 'შეკვეთის შემდეგ მომენტალურად გენერირდება ინვოისი',
      fillRequired: 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი',
      pickupBatumi: 'ბათუმი, საქართველო',
      goToCatalog: 'კატალოგში გადასვლა',
    },
    en: {
      home: 'Home',
      namePlaceholder: 'John Doe / Hykon LLC',
      taxIdLabel: 'Tax ID / Personal ID',
      taxIdNote: '(for invoice)',
      taxIdPlaceholder: '405591432 / 010190...',
      emailNote: '(for receiving invoice)',
      emailPlaceholder: 'info@example.ge',
      defaultCity: 'Batumi',
      addressPlaceholder: 'Street, building, apt...',
      notesPlaceholder: 'Preferred delivery time, notes...',
      invoiceBadge: 'Invoice',
      secureCheckout: '🔒 Secure order & official documentation',
      instantInvoice: 'Official invoice is generated immediately after order',
      fillRequired: 'Please fill in all required fields',
      pickupBatumi: 'Batumi, Georgia',
      goToCatalog: 'Browse Catalog',
    },
    ru: {
      home: 'Главная',
      namePlaceholder: 'Давид Беридзе / ООО Хайкон',
      taxIdLabel: 'Идентификационный код (с/к или п/н)',
      taxIdNote: '(для инвойса)',
      taxIdPlaceholder: '405591432 / 010190...',
      emailNote: '(для получения инвойса)',
      emailPlaceholder: 'info@example.ge',
      defaultCity: 'Батуми',
      addressPlaceholder: 'Улица, дом, квартира...',
      notesPlaceholder: 'Желаемое время доставки, дополнительный комментарий...',
      invoiceBadge: 'Инвойс',
      secureCheckout: '🔒 Безопасный заказ и официальная документация',
      instantInvoice: 'После оформления моментально формируется счет (инвойс)',
      fillRequired: 'Пожалуйста, заполните все обязательные поля',
      pickupBatumi: 'Батуми, Грузия',
      goToCatalog: 'Перейти в каталог',
    },
  }[language];

  // Form states
  const [fullName, setFullName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  const [city, setCity] = useState(checkoutLabels.defaultCity);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash'>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'courier' && subtotal < 150 ? 7 : 0;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || (deliveryMethod === 'courier' && !address)) {
      alert(checkoutLabels.fillRequired);
      return;
    }

    setIsSubmitting(true);

    const order = createOrder({
      customer: {
        fullName: taxId ? `${fullName} (ს/კ: ${taxId})` : fullName,
        phone,
        email: email || 'sales@hykon.ge',
        city,
        address: deliveryMethod === 'pickup' ? `შოურუმი: ${checkoutLabels.pickupBatumi}` : address,
        notes: taxId ? `ს/კ: ${taxId}. ${notes}` : notes,
      },
      deliveryMethod,
      pickupLocation: deliveryMethod === 'pickup' ? checkoutLabels.pickupBatumi : undefined,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.productId,
        productSlug: item.product.slug,
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

    setTimeout(() => {
      router.push(getLocalizedHref(`/order-success/${order.id}`));
    }, 400);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{t.emptyCart}</h1>
          <p className="text-xs text-zinc-500 mb-6">{t.notFoundDesc}</p>
          <Link
            href={getLocalizedHref('/catalog')}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            {checkoutLabels.goToCatalog}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-6">
          <Link href={getLocalizedHref('/')} className="hover:text-black transition-colors">
            {checkoutLabels.home}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <Link href={getLocalizedHref('/cart')} className="hover:text-black transition-colors">
            {t.cartTitle}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-black font-semibold">{t.checkoutTitle}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mb-8">
          {t.checkoutTitle}
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Contact Details */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <h2 className="font-bold text-sm text-zinc-900">{t.contactDetails}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t.fullName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={checkoutLabels.namePlaceholder}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {checkoutLabels.taxIdLabel} <span className="text-zinc-400 font-normal">{checkoutLabels.taxIdNote}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={checkoutLabels.taxIdPlaceholder}
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t.phone} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+995 599 00 00 00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t.email} <span className="text-zinc-400 font-normal">{checkoutLabels.emailNote}</span>
                  </label>
                  <input
                    type="email"
                    placeholder={checkoutLabels.emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Method */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <h2 className="font-bold text-sm text-zinc-900">{t.deliveryMethod}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliveryMethod('courier')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'courier'
                      ? 'border-black bg-zinc-50/70'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {t.courierDelivery}
                    </span>
                    <span className="text-xs font-mono font-semibold">
                      {shippingFee === 0 ? t.free : '7 ₾'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{t.freeDeliveryNotice}</p>
                </div>

                <div
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-black bg-zinc-50/70'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {t.pickupShowroom}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-600">{t.free}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{t.showroomAddress}</p>
                </div>
              </div>

              {deliveryMethod === 'courier' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">{t.city}</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">
                        {t.address} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={checkoutLabels.addressPlaceholder}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">{t.deliveryNotes}</label>
                <textarea
                  rows={2}
                  placeholder={checkoutLabels.notesPlaceholder}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Step 3: Payment Method (Bank Transfer & Invoice) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center font-mono">
                  3
                </span>
                <h2 className="font-bold text-sm text-zinc-900">{t.paymentMethod}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-black bg-zinc-50/70 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-bold text-xs text-zinc-900 block">{t.bankTransfer}</span>
                        <span className="text-[11px] text-zinc-500 font-medium">TBC Bank / Bank of Georgia (RS.GE)</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                      {checkoutLabels.invoiceBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 pl-8 leading-relaxed">
                    {t.bankTransferDesc}
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-black bg-zinc-50/70 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs text-zinc-900">{t.cashOnDelivery}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 pl-8">
                    {t.cashOnDeliveryDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-6 sticky top-24">
            <h3 className="font-bold text-base text-zinc-950">{t.orderSummary}</h3>

            {/* Cart items preview list */}
            <div className="divide-y divide-zinc-200 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 bg-white border border-zinc-200 rounded-lg overflow-hidden shrink-0 p-1">
                    <Image
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={translateProductTitle(item.product.title)}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-900 truncate">
                      {translateProductTitle(item.product.title)}
                    </div>
                    <div className="text-zinc-500 text-[11px]">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-zinc-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing math */}
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>{t.subtotal}:</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>{t.shipping}:</span>
                <span className="font-mono">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-semibold">{t.free}</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>{t.total}:</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isSubmitting ? t.generatingInvoice : t.placeOrder}</span>
            </button>

            <div className="text-[11px] text-zinc-500 space-y-1 text-center">
              <p>{checkoutLabels.secureCheckout}</p>
              <p>{checkoutLabels.instantInvoice}</p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
