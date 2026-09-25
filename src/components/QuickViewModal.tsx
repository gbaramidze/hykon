'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, ShoppingBag, SlidersHorizontal, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inCompare = isInCompare(product.id);
  const inWish = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariants);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center p-4">
              <Image
                src={images[selectedImageIdx]}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-zinc-50 transition-all ${
                      selectedImageIdx === idx ? 'border-black' : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-zinc-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 mb-3 leading-snug">
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-zinc-900 font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 line-clamp-3 mb-4 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variants Picker if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-semibold text-zinc-900 block">
                    Доступные конфигурации / Цвета:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() =>
                          setSelectedVariants(prev => ({ ...prev, [variant.type]: variant.name }))
                        }
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedVariants[variant.type] === variant.name
                            ? 'border-black bg-black text-white'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {variant.name} {variant.priceModifier ? `(+${formatPrice(variant.priceModifier)})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="space-y-2 border-t border-zinc-100 pt-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{product.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : product.inStock
                      ? 'bg-black hover:bg-zinc-800 text-white'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      Добавлено
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      В корзину
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleCompare(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    inCompare
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-black'
                  }`}
                  title="Сравнение"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    inWish
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-zinc-200 text-zinc-600 hover:text-rose-600'
                  }`}
                  title="В избранное"
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs font-semibold text-zinc-500 hover:text-black py-1"
              >
                Открыть полную страницу товара со спецификациями →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
