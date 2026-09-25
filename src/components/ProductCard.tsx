'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, SlidersHorizontal, Heart, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const inCompare = isInCompare(product.id);
  const inWish = isInWishlist(product.id);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Extract a key spec snippet if available
  const firstSpec = product.specGroups?.[0]?.items?.[0]?.value || '';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl border border-zinc-200 hover:border-zinc-900 transition-all duration-300 hover:shadow-xl flex flex-col h-full overflow-hidden"
    >
      {/* Top Badges & Action Buttons */}
      <div className="relative p-4 pb-0 flex items-start justify-between z-10">
        <div className="flex flex-col gap-1">
          {discountPercent && (
            <span className="bg-rose-600 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded-sm self-start tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-black text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-sm self-start uppercase tracking-wider">
              NEW
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-amber-500 text-black font-mono font-bold text-[10px] px-2 py-0.5 rounded-sm self-start uppercase tracking-wider">
              TOP
            </span>
          )}
        </div>

        {/* Wishlist & Compare Icons */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full border transition-all ${
              inWish
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white/80 backdrop-blur-xs border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-zinc-400'
            }`}
            title={inWish ? 'Удалить из избранного' : 'В избранное'}
          >
            <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-600' : ''}`} />
          </button>

          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-full border transition-all ${
              inCompare
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white/80 backdrop-blur-xs border-zinc-200 text-zinc-400 hover:text-black hover:border-zinc-400'
            }`}
            title={inCompare ? 'В сравнении' : 'Добавить к сравнению'}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Area with Quick View overlay */}
      <div className="relative w-full aspect-square p-6 flex items-center justify-center">
        <Link href={`/product/${product.slug}`} className="relative w-full h-full block">
          <Image
            src={
              isHovered && product.images && product.images.length > 1
                ? product.images[1]
                : product.thumbnail || product.images[0]
            }
            alt={product.title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={e => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-3 bg-white/95 text-zinc-900 shadow-md border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 hover:bg-black hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
            Быстрый просмотр
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 pt-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            {product.inStock ? (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                В наличии
              </span>
            ) : (
              <span className="text-[11px] font-medium text-zinc-400">Под заказ</span>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-2 block"
            title={product.title}
          >
            {product.title}
          </Link>

          {/* Spec snippet chip */}
          {firstSpec && (
            <div className="text-[11px] text-zinc-500 line-clamp-1 mb-3 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded">
              {firstSpec}
            </div>
          )}
        </div>

        {/* Price & Buy Button */}
        <div className="pt-2 border-t border-zinc-100 mt-2">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-zinc-900 font-mono">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-zinc-400 line-through font-mono">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Monthly installment estimate */}
          <div className="text-[10px] text-zinc-500 font-medium mb-3">
            Рассрочка от {formatPrice(Math.round(product.price / 12))} / мес
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all ${
              addedAnim
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-black hover:bg-zinc-800 text-white'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-4 h-4 animate-scale" />
                <span>Добавлено в корзину</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{product.inStock ? 'В корзину' : 'Нет в наличии'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
