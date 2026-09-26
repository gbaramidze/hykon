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
  Zap,
  Phone,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const {
    language,
    t,
    translateProductTitle,
    translateCategoryName,
    translateDescription,
    translateSpecGroup,
    translateSpecName,
    translateSpecValue,
    getLocalizedHref,
  } = useLanguage();

  const decodedSlug = decodeURIComponent(slug || '');
  const product = products.find(
    p =>
      p.slug === slug ||
      p.slug === decodedSlug ||
      p.id === slug ||
      (p as any).oldSlug === slug ||
      p.sku?.toLowerCase() === slug.toLowerCase()
  );

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
      userName: 'დავით მ.',
      rating: 5,
      date: '24 სექტემბერი 2026',
      comment: 'ძალიან კარგი ხარისხის კამერაა. ღამით ხედვა და AI დეტექცია მუშაობს იდეალურად. მიწოდება მოხდა იმავე დღეს.',
      pros: 'ღამის ფერადი ხედვა, მკაფიო გამოსახულება, მარტივი მონტაჟი',
      cons: 'არ აქვს',
      verifiedPurchase: true,
    },
    {
      id: 'rev-2',
      productId: product?.id || '',
      userName: 'გიორგი კ.',
      rating: 5,
      date: '12 სექტემბერი 2026',
      comment: 'შევუკვეთეთ ინვოისით კომპანიისთვის. საბუთები და ინვოისი მომენტალურად გადმოგვიგზავნეს RS.GE-ზე. რეკომენდაციას ვუწევ Hykon-ს!',
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
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{t.notFound}</h1>
          <p className="text-xs text-zinc-500 mb-6">{t.notFoundDesc}</p>
          <Link href={getLocalizedHref('/catalog')} className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold">
            {t.catalogMenu}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayTitle = translateProductTitle(product.title);
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
        fullName: oneClickName || 'სწრაფი შეკვეთა (1-Click)',
        phone: oneClickPhone,
        email: 'quick-buy@hykon.ge',
        city: 'თბილისი',
        address: 'მისამართი ზუსტდება მენეჯერთან სატელეფონო საუბრისას',
        notes: 'სწრაფი შეკვეთა საიტიდან (1-Click Buy)',
      },
      deliveryMethod: 'courier',
      paymentMethod: 'bank_transfer',
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
      date: 'დღეს',
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

  // SEO: Schema.org Product markup
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.shortDescription || product.title,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://hykon.ge/product/${product.slug}`,
      priceCurrency: 'GEL',
      price: currentPrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'HYKON.GE',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || '4.8',
      reviewCount: reviews.length || '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'მთავარი',
        item: 'https://hykon.ge',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'კატალოგი',
        item: 'https://hykon.ge/catalog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://hykon.ge/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <Link href={getLocalizedHref('/')} className="hover:text-black shrink-0">
            {t.allProducts === 'ყველა პროდუქტი' ? 'მთავარი' : language === 'en' ? 'Home' : 'Главная'}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
          <Link href={getLocalizedHref('/catalog')} className="hover:text-black shrink-0">
            {t.catalog}
          </Link>
          {product.categoryPath?.map(cp => (
            <React.Fragment key={cp.id}>
              <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
              <Link href={getLocalizedHref(`/catalog/${cp.slug}`)} className="hover:text-black shrink-0">
                {translateCategoryName(cp.name)}
              </Link>
            </React.Fragment>
          ))}
          <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="text-black font-semibold truncate max-w-[160px] sm:max-w-xs">{displayTitle}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-zinc-200 w-full min-w-0 items-start">
          {/* Left: Gallery with Zoom (5 cols) */}
          <div className="lg:col-span-5 min-w-0 w-full">
            <ProductImageZoom images={product.images} title={displayTitle} />
          </div>

          {/* Right: Info & Buy Box (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
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
                {displayTitle}
              </h1>

              {/* Price Block */}
              <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200 mb-6 space-y-2">
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
                      {t.saving} {formatPrice(product.oldPrice - currentPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selectors */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">
                      {t.specifications}:
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

              {/* Stock Status & Guarantees */}
              <div className="space-y-2.5 bg-white border border-zinc-200 rounded-xl p-4 mb-6 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{t.inStock}:</span>
                  {product.inStock ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {t.inStock} ({product.stockCount} {t.qty})
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-medium">{t.onOrder}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.freeDeliveryNotice}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.officialWarrantyNotice} (до 36 თვემდე)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.easyReturnNotice}</span>
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
                        <span className="truncate">{t.added}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span className="truncate">{product.inStock ? t.addToCart : t.outOfStock}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all shrink-0 ${
                      inWish ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-zinc-200 text-zinc-600 hover:text-rose-600'
                    }`}
                    title={t.wishlist}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWish ? 'fill-rose-600' : ''}`} />
                  </button>

                  {/* Compare */}
                  <button
                    onClick={() => toggleCompare(product)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all shrink-0 ${
                      inCompare ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-black'
                    }`}
                    title={t.compare}
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
                    {t.buyIn1Click}
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
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {t.specifications}
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {t.description}
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {t.deliveryTab}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 sm:pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <span>{t.reviews}</span>
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
                      {translateSpecGroup(group.group)}
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {group.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="grid grid-cols-1 sm:grid-cols-3 px-5 py-3 text-xs gap-2"
                        >
                          <span className="text-zinc-500 font-medium">
                            {translateSpecName(item.name)}
                          </span>
                          <span className="sm:col-span-2 text-zinc-900 font-semibold">
                            {translateSpecValue(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500">{t.specifications}</div>
              )}
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 animate-fade-in text-zinc-800 text-sm leading-relaxed">
              <div className="font-semibold text-lg text-zinc-900 mb-2">
                {displayTitle}
              </div>
              <div
                className="prose-hykon bg-zinc-50/50 p-6 rounded-2xl border border-zinc-200"
                dangerouslySetInnerHTML={{
                  __html: translateDescription(product.fullDescription || product.shortDescription || `<p>${displayTitle}</p>`)
                }}
              />
            </div>
          )}

          {/* TAB 3: DELIVERY & WARRANTY */}
          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-6 animate-fade-in text-xs text-zinc-700 leading-relaxed">
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="font-bold text-sm text-zinc-900">{t.deliveryAndPayment}</h4>
                <p>
                  • <b>{t.courierDelivery}:</b> 1-2 დღეში საქართველოს ნებისმიერ წერტილში. 150 ₾-დან — <b>უფასო</b>.
                </p>
                <p>
                  • <b>{t.pickupShowroom}:</b> {t.showroomAddress} (ორშ-კვირ 10:00 - 20:00).
                </p>
                <p>
                  • <b>{t.bankTransfer}:</b> ოფიციალური ინვოისის მიღება და გადახდა საბანკო რეკვიზიტებზე (RS.GE).
                </p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="font-bold text-sm text-zinc-900">{t.warrantyAndService}</h4>
                <p>
                  {t.footerAbout}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-8 animate-fade-in">
              {/* Existing reviews list */}
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-1.5 py-0.5 rounded">
                            {t.inStock}
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-400 text-xs font-mono">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed pt-1">{rev.comment}</p>
                    {rev.pros && (
                      <p className="text-[11px] text-zinc-600">
                        <b>+</b> {rev.pros}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                <h4 className="font-bold text-sm text-zinc-900">{t.reviews}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-600 block mb-1">{t.yourName}</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={e => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600 block mb-1">{t.sortRating}</label>
                    <select
                      value={newReviewRating}
                      onChange={e => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-600 block mb-1">{t.description}</label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  {t.submitOrder}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="py-12">
            <h3 className="text-xl font-bold text-zinc-950 mb-6">{t.relatedProducts}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 1-CLICK BUY MODAL */}
      {is1ClickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIs1ClickModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-black hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>

            {oneClickSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{t.orderSuccessMsg}</h3>
              </div>
            ) : (
              <form onSubmit={handleOneClickBuy} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">{t.oneClickTitle}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{t.oneClickDesc}</p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3">
                  <div className="text-xs font-semibold text-zinc-900 truncate flex-1">
                    {displayTitle}
                  </div>
                  <div className="font-mono font-bold text-xs">{formatPrice(currentPrice)}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">{t.yourName}</label>
                  <input
                    type="text"
                    value={oneClickName}
                    onChange={e => setOneClickName(e.target.value)}
                    placeholder="დავით ბერიძე"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t.yourPhone} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={oneClickPhone}
                    onChange={e => setOneClickPhone(e.target.value)}
                    placeholder="+995 599 00 00 00"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  {t.submitOrder}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
