'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { orders, formatPrice } = useStore();
  const { language, t, translateProductTitle, getLocalizedHref } = useLanguage();

  const order = orders.find(o => o.id === orderId) || orders[0];

  const successLabels = {
    ka: {
      title: 'შეკვეთა წარმატებით გაფორმდა!',
      orderNum: 'შეკვეთის ნომერი:',
      orderDesc: 'ინვოისი გენერირებულია ქვემოთ. შეგიძლიათ პირდაპირ ამობეჭდოთ ან შეინახოთ PDF ფაილად.',
      home: 'მთავარი',
      backHome: 'მთავარზე დაბრუნება',
      bankDetailsTitle: 'საბანკო რეკვიზიტები გადარიცხვისთვის:',
      bankName: 'სს "საქართველოს ბანკი" (Bank of Georgia / BOG)',
      purpose: 'ინვოისი',
      buyerDetailsTitle: 'მყიდველის მონაცემები:',
      nameLabel: 'სახელი / ორგანიზაცია:',
      phoneLabel: 'ტელეფონი:',
      addressLabel: 'მიწოდების მისამართი:',
      paymentLabel: 'გადახდის მეთოდი:',
      bankPayment: 'საბანკო გადარიცხვა (ინვოისი)',
      cashPayment: 'ნაღდი / მიღებისას',
      notice1: 'ინვოისის გადახდის ვადა: 3 საბანკო დღე.',
      notice2: 'თანხა მოიცავს საქართველოს კანონმდებლობით გათვალისწინებულ დღგ-ს (18%).',
      notice3: 'ოფიციალური ელექტრონული ანგარიშ-ფაქტურა აიტვირთება RS.GE-ზე.',
      signature: 'ხელმოწერა / ბეჭედი',
      subtotalNoVat: 'ღირებულება (დღგ-ს გარეშე):',
      vat18: 'დღგ 18%:',
      shipping: 'მიწოდება:',
      totalToPay: 'სულ გადასახდელი:',
    },
    en: {
      title: 'Order Placed Successfully!',
      orderNum: 'Order Number:',
      orderDesc: 'Official invoice is generated below. You can print it or save as PDF directly.',
      home: 'Home',
      backHome: 'Back to Home',
      bankDetailsTitle: 'Banking Details for Wire Transfer:',
      bankName: 'JSC "Bank of Georgia" (BOG)',
      purpose: 'Invoice',
      buyerDetailsTitle: 'Buyer Details:',
      nameLabel: 'Name / Company:',
      phoneLabel: 'Phone:',
      addressLabel: 'Delivery Address:',
      paymentLabel: 'Payment Method:',
      bankPayment: 'Bank Transfer (Invoice)',
      cashPayment: 'Cash on Delivery',
      notice1: 'Payment term: 3 banking days.',
      notice2: 'Total amount includes 18% VAT under Georgian law.',
      notice3: 'Official tax invoice will be uploaded to RS.GE.',
      signature: 'Signature / Stamp',
      subtotalNoVat: 'Subtotal (excl. VAT):',
      vat18: 'VAT 18%:',
      shipping: 'Shipping:',
      totalToPay: 'Total Amount:',
    },
    ru: {
      title: 'Заказ успешно оформлен!',
      orderNum: 'Номер заказа:',
      orderDesc: 'Счет на оплату (инвойс) сформирован ниже. Вы можете распечатать его или сохранить в PDF.',
      home: 'Главная',
      backHome: 'Вернуться на главную',
      bankDetailsTitle: 'Банковские реквизиты для безналичной оплаты:',
      bankName: 'АО "Банк Грузии" (Bank of Georgia / BOG)',
      purpose: 'Счет',
      buyerDetailsTitle: 'Данные плательщика:',
      nameLabel: 'ФИО / Организация:',
      phoneLabel: 'Телефон:',
      addressLabel: 'Адрес доставки:',
      paymentLabel: 'Способ оплаты:',
      bankPayment: 'Безналичный расчет (Инвойс)',
      cashPayment: 'Оплата при получении',
      notice1: 'Срок оплаты счета: 3 банковских дня.',
      notice2: 'В стоимость включен официальный НДС 18% по законодательству Грузии.',
      notice3: 'Электронная накладная (ანგარიშ-ფაქტურა) будет зарегистрирована в RS.GE.',
      signature: 'Подпись / Печать',
      subtotalNoVat: 'Сумма без НДС:',
      vat18: 'НДС 18%:',
      shipping: 'Доставка:',
      totalToPay: 'Итого к оплате:',
    },
  }[language];

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{t.notFound}</h1>
          <Link href={getLocalizedHref('/')} className="text-xs font-semibold text-blue-600 underline">
            {successLabels.backHome}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const vatAmount = Math.round((order.total - order.total / 1.18) * 100) / 100;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Top Celebration Bar (Hidden on print) */}
        <div className="text-center space-y-4 mb-10 print:hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            {successLabels.title}
          </h1>

          <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
            {successLabels.orderNum} <b className="font-mono text-zinc-900 text-sm">{order.orderNumber}</b>. {successLabels.orderDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" /> {t.printInvoice}
            </button>

            <Link
              href={getLocalizedHref('/catalog')}
              className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            >
              {t.catalogMenu} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* OFFICIAL PRINTABLE INVOICE / ანგარიშ-ფაქტურა */}
        <div
          id="invoice-document"
          className="bg-white border border-zinc-300 rounded-2xl p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0 text-zinc-900"
        >
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-zinc-900 pb-6 gap-6">
            <div>
              <div className="text-2xl font-black tracking-wider text-black font-mono">
                HYKON<span className="text-blue-600">.GE</span>
              </div>
              <div className="text-xs font-semibold text-zinc-600 mt-1">
                ი.მ. Hykon / I/E Hykon
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 space-y-0.5">
                <p>საიდენტიფიკაციო კოდი (ს/კ): <b>61001070627</b></p>
                <p>მისამართი: ბათუმი, საქართველო (Batumi, Georgia)</p>
                <p>ტელეფონი: +995 591 43 25 25 | sales@hykon.ge</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block bg-zinc-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2">
                {t.invoice}
              </div>
              <div className="text-base font-extrabold font-mono text-zinc-950">
                № {order.orderNumber}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                {t.invoiceDate}: <b>{new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US')}</b>
              </div>
            </div>
          </div>

          {/* Parties Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200 text-xs">
            {/* Beneficiary Requisites */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
              <div className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                {successLabels.bankDetailsTitle}
              </div>
              <div className="space-y-1.5 pt-1 text-zinc-800">
                <p>
                  <b>{t.bankName}:</b> {successLabels.bankName}
                </p>
                <p>
                  <b>{t.iban} (GEL):</b> <code className="bg-white px-2 py-0.5 rounded border border-zinc-200 font-mono font-bold text-blue-700">GE14BG0000000596306409</code>
                </p>
                <p>
                  <b>SWIFT:</b> <code>BAGAGE22</code>
                </p>
                <p className="pt-1 text-[11px] text-zinc-600">
                  <b>{t.purpose}:</b> {successLabels.purpose} {order.orderNumber}
                </p>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
              <div className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {successLabels.buyerDetailsTitle}
              </div>
              <div className="space-y-1 pt-1 text-zinc-800">
                <p>
                  <b>{successLabels.nameLabel}</b> {order.customer.fullName}
                </p>
                <p>
                  <b>{successLabels.phoneLabel}</b> {order.customer.phone}
                </p>
                <p>
                  <b>{successLabels.addressLabel}</b> {order.customer.city}, {order.customer.address}
                </p>
                <p>
                  <b>{successLabels.paymentLabel}</b> {order.paymentMethod === 'bank_transfer' ? successLabels.bankPayment : successLabels.cashPayment}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 bg-zinc-100 text-zinc-800">
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px]">#</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px]">{t.item}</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px]">{t.sku}</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px] text-center">{t.qty}</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px] text-right">{t.unitPrice}</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-[11px] text-right">{t.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-3 font-mono text-zinc-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-zinc-900">
                      {translateProductTitle(item.productTitle)}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500">{item.productSku}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{formatPrice(item.price)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Math Summary & Signatures */}
          <div className="pt-4 border-t-2 border-zinc-900 flex flex-col sm:flex-row items-start justify-between gap-8">
            <div className="text-xs text-zinc-500 space-y-1.5 max-w-sm">
              <p>• {successLabels.notice1}</p>
              <p>• {successLabels.notice2}</p>
              <p>• {successLabels.notice3}</p>

              <div className="pt-8 flex items-center gap-6">
                <div>
                  <div className="h-0.5 w-36 bg-zinc-400 mb-1" />
                  <span className="text-[10px] text-zinc-400">{successLabels.signature}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div className="flex justify-between text-zinc-600">
                <span>{successLabels.subtotalNoVat}</span>
                <span className="font-mono">{formatPrice(Math.round((order.subtotal - vatAmount) * 100) / 100)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>{successLabels.vat18}</span>
                <span className="font-mono">{formatPrice(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>{successLabels.shipping}</span>
                <span className="font-mono">{order.shippingFee === 0 ? t.free : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-300">
                <span>{successLabels.totalToPay}</span>
                <span className="font-mono text-blue-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
