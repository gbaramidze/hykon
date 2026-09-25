'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ShoppingBag,
  SlidersHorizontal,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  MessageSquare,
  Zap,
  Phone,
  X,
  CreditCard,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Review } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    products,
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
    createOrder,
  } = useStore();

  const product = products.find(p => p.slug === slug);

  // States
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'delivery' | 'reviews'>('specs');
  const [addedAnim, setAddedAnim] = useState(false);
  const [is1ClickModalOpen, setIs1ClickModalOpen] = useState(false);
  const [oneClickPhone, setOneClickPhone] = useState('');
  const [oneClickName, setOneClickName] = useState('');
  const [oneClickSuccess, setOneClickSuccess] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: product?.id || '',
      userName: 'Александр М.',
      rating: 5,
      date: '14 Сентября 2026',
      comment: 'Абсолютно топовое устройство! Сборка монолитная, экран передает цвета идеально. Доставили в Тбилиси за 3 часа.',
      pros: 'Производительность, экран, автономность',
      cons: 'Не обнаружил',
      verifiedPurchase: true,
    },
    {
      id: 'rev-2',
      productId: product?.id || '',
      userName: 'Гиорги К.',
      rating: 5,
      date: '02 Сентября 2026',
      comment: 'Покупал в рассрочку от TBC. Все оформили моментально онлайн. Рекомендую магазин Hykon!',
      verifiedPurchase: true,
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewPros, setNewReviewPros] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Товар не найден</h1>
          <p className="text-xs text-zinc-500 mb-6">Возможно, он был перемещен или удален из каталога.</p>
          <Link href="/catalog" className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold">
            Вернуться в каталог
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const inCompare = isInCompare(product.id);
  const inWish = isInWishlist(product.id);

  // Calculate adjusted price with variants modifier if any
  let currentPrice = product.price;
  if (product.variants) {
    Object.entries(selectedVariants).forEach(([type, name]) => {
      const v = product.variants?.find(item => item.type === type && item.name === name);
      if (v?.priceModifier) currentPrice += v.priceModifier;
    });
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  const handleOneClickBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneClickPhone.trim()) return;

    createOrder({
      customer: {
        fullName: oneClickName || 'Быстрый заказ',
        phone: oneClickPhone,
        email: 'quick-buy@hykon.ge',
        city: 'Тбилиси',
        address: 'Уточняется менеджером по телефону',
        notes: 'Быстрый заказ в 1 клик',
      },
      deliveryMethod: 'courier',
      paymentMethod: 'cash',
      items: [
        {
          productId: product.id,
          productTitle: product.title,
          productSku: product.sku,
          image: product.thumbnail || product.images[0],
          price: currentPrice,
          quantity: quantity,
          selectedVariants,
        },
      ],
      subtotal: currentPrice * quantity,
      discount: 0,
      shippingFee: 0,
      total: currentPrice * quantity,
      status: 'pending',
    });

    setOneClickSuccess(true);
    setTimeout(() => {
      setIs1ClickModalOpen(false);
      setOneClickSuccess(false);
      setOneClickPhone('');
      setOneClickName('');
    }, 3000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor,
      rating: newReviewRating,
      date: 'Сегодня',
      comment: newReviewComment,
      pros: newReviewPros,
      verifiedPurchase: true,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewPros('');
  };

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white w-full max-w-full overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 w-full max-w-full min-w-0 overflow-hidden">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-zinc-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full pb-1">
          <Link href="/" className="hover:text-black flex-shrink-0">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
          <Link href="/catalog" className="hover:text-black flex-shrink-0">
            Каталог
          </Link>
          {product.categoryPath?.map(cp => (
            <React.Fragment key={cp.id}>
              <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
              <Link href={`/catalog/${cp.slug}`} className="hover:text-black flex-shrink-0">
                {cp.name}
              </Link>
            </React.Fragment>
          ))}
          <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
          <span className="text-black font-semibold truncate max-w-[140px] sm:max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-12 border-b border-zinc-200 w-full min-w-0">
          {/* Left: Gallery with Zoom (7 cols) */}
          <div className="lg:col-span-7 min-w-0 w-full">
            <ProductImageZoom images={product.images} title={product.title} />
          </div>

          {/* Right: Info & Buy Box (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & SKU & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <Link
                  href={`/catalog?brand=${product.brand.toLowerCase()}`}
                  className="font-bold text-zinc-900 hover:text-blue-600 uppercase tracking-wider"
                >
                  {product.brand}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="font-mono">SKU: {product.sku}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-zinc-400 font-normal">({reviews.length})</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-950 leading-tight mb-4">
                {product.title}
              </h1>

              {/* Price Block */}
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 mb-6 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-zinc-950 font-mono">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base text-zinc-400 line-through font-mono">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded font-mono">
                      Экономия {formatPrice(product.oldPrice - currentPrice)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-600 flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                  <span>
                    Беспроцентная рассрочка от <b>{formatPrice(Math.round(currentPrice / 12))} / мес</b>
                  </span>
                </div>
              </div>

              {/* Variant Selectors */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">
                      Конфигурация / Вариант:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map(variant => {
                        const isSelected = selectedVariants[variant.type] === variant.name;
                        return (
                          <button
                            key={variant.id}
                            onClick={() =>
                              setSelectedVariants(prev => ({ ...prev, [variant.type]: variant.name }))
                            }
                            className={`text-xs px-3.5 py-2 rounded-xl border font-medium transition-all ${
                              isSelected
                                ? 'border-black bg-black text-white font-semibold'
                                : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                            }`}
                          >
                            {variant.name}{' '}
                            {variant.priceModifier ? `(+${formatPrice(variant.priceModifier)})` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Status & Fast Guarantees */}
              <div className="space-y-2.5 bg-white border border-zinc-200 rounded-xl p-4 mb-6 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Наличие на складе:</span>
                  {product.inStock ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      В наличии ({product.stockCount} шт.)
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-medium">Под заказ</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{product.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>14 дней на обмен или возврат без вопросов</span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  {/* Quantity */}
                  <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 px-1.5 sm:px-2 py-1 shrink-0">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-2 py-1 text-zinc-600 hover:text-black font-bold text-xs sm:text-sm"
                    >
                      -
                    </button>
                    <span className="px-1.5 font-mono font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stockCount || 99, q + 1))}
                      className="px-2 py-1 text-zinc-600 hover:text-black font-bold text-xs sm:text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 sm:py-3.5 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all min-w-0 ${
                      addedAnim
                        ? 'bg-emerald-600 text-white'
                        : product.inStock
                        ? 'bg-black hover:bg-zinc-800 text-white shadow-md'
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    {addedAnim ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span className="truncate">Добавлено</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span className="truncate">{product.inStock ? 'В корзину' : 'Нет в наличии'}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all shrink-0 ${
                      inWish ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-zinc-200 text-zinc-600 hover:text-rose-600'
                    }`}
                    title="В избранное"
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWish ? 'fill-rose-600' : ''}`} />
                  </button>

                  {/* Compare */}
                  <button
                    onClick={() => toggleCompare(product)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all shrink-0 ${
                      inCompare ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-black'
                    }`}
                    title="Сравнить характеристики"
                  >
                    <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* 1-Click Buy Button */}
                {product.inStock && (
                  <button
                    onClick={() => setIs1ClickModalOpen(true)}
                    className="w-full py-2.5 sm:py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Купить в 1 клик (без регистрации)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABS: Specifications, Description, Delivery, Reviews */}
        <div className="py-8 sm:py-12 border-b border-zinc-200 w-full max-w-full overflow-hidden">
          <div className="flex items-center space-x-4 sm:space-x-8 border-b border-zinc-200 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none text-xs sm:text-sm font-semibold max-w-full pb-2">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Характеристики
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Описание товара
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Доставка и гарантия
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <span>Отзывы</span>
              <span className="bg-zinc-100 text-zinc-700 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                {reviews.length}
              </span>
            </button>
          </div>

          {/* TAB 1: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="max-w-4xl space-y-8 animate-fade-in">
              {product.specGroups && product.specGroups.length > 0 ? (
                product.specGroups.map((group, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                    <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-900">
                      {group.group}
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {group.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="grid grid-cols-1 sm:grid-cols-3 px-5 py-3 text-xs gap-2"
                        >
                          <span className="text-zinc-500 font-medium">{item.name}</span>
                          <span className="sm:col-span-2 text-zinc-900 font-semibold">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500">Спецификации для данного товара уточняются.</div>
              )}
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 animate-fade-in text-zinc-800 text-sm leading-relaxed whitespace-pre-line">
              <div className="font-semibold text-lg text-zinc-900 mb-2">
                Обзор устройства {product.title}
              </div>
              <p>{product.fullDescription || product.shortDescription}</p>
            </div>
          )}

          {/* TAB 3: DELIVERY & WARRANTY */}
          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-6 animate-fade-in text-xs text-zinc-700 leading-relaxed">
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="font-bold text-sm text-zinc-900">Условия доставки</h4>
                <p>
                  • <b>Курьер по Тбилиси:</b> Доставка в день заказа при оформлении до 16:00. При сумме заказа от 150 ₾ — <b>бесплатно</b> (до 150 ₾ — 7 ₾).
                </p>
                <p>
                  • <b>Регионы Грузии (Батуми, Кутаиси, Рустави и др.):</b> Экспресс-доставка за 1-2 рабочих дня курьерской службой.
                </p>
                <p>
                  • <b>Самовывоз из шоурума:</b> г. Тбилиси, пр. Чавчавадзе 37 (ежедневно с 10:00 до 21:00).
                </p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="font-bold text-sm text-zinc-900">Гарантийные обязательства</h4>
                <p>
                  Вся техника в магазине Hykon.ge является 100% оригинальной и обеспечивается официальной гарантией производителя до 36 месяцев со дня покупки.
                </p>
                <p>
                  В течение 14 дней с момента получения вы можете вернуть или обменять исправный товар при сохранении товарного вида и упаковки.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
              {/* Existing Reviews List (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-5 rounded-xl border border-zinc-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                            Проверенная покупка
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-500' : 'text-zinc-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">{rev.comment}</p>

                    {rev.pros && (
                      <div className="text-xs text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-100 mt-2">
                        <b>Плюсы:</b> {rev.pros}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Review Form (5 cols) */}
              <div className="md:col-span-5">
                <form
                  onSubmit={handleAddReview}
                  className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-4"
                >
                  <h4 className="font-bold text-sm text-zinc-900">Оставить отзыв</h4>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Оценка
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating ? 'fill-amber-500' : 'text-zinc-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Имя Фамилия"
                      value={newReviewAuthor}
                      onChange={e => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Плюсы / Особенности
                    </label>
                    <input
                      type="text"
                      placeholder="Что вам особенно понравилось?"
                      value={newReviewPros}
                      onChange={e => setNewReviewPros(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Комментарий
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Поделитесь вашими впечатлениями от использования..."
                      value={newReviewComment}
                      onChange={e => setNewReviewComment(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Отправить отзыв
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="py-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Похожие товары</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Instant 1-Click Buy Modal */}
      {is1ClickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative">
            <button
              onClick={() => setIs1ClickModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {oneClickSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900">Заказ успешно оформлен!</h4>
                <p className="text-xs text-zinc-600">
                  Наш оператор свяжется с вами в течение 5 минут для подтверждения адреса доставки.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOneClickBuy} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Быстрый заказ в 1 клик</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Оставьте номер телефона, и мы сразу зарезервируем товар за вами
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center gap-3">
                  <div className="text-xs font-semibold text-zinc-900 line-clamp-1">
                    {product.title}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-900 ml-auto whitespace-nowrap">
                    {formatPrice(currentPrice * quantity)}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Георгий"
                    value={oneClickName}
                    onChange={e => setOneClickName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+995 599 00 00 00"
                    value={oneClickPhone}
                    onChange={e => setOneClickPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Оформить заказ
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
