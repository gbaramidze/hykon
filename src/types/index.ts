export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  level: number; // 1 = Main/Root, 2 = Subcategory, 3 = Sub-subcategory
  icon?: string;
  image?: string;
  description?: string;
  order?: number;
  featured?: boolean;
  productCount?: number;
}

export interface SpecItem {
  name: string;
  value: string;
}

export interface SpecGroup {
  group: string;
  items: SpecItem[];
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'storage' | 'ram' | 'size';
  value: string;
  priceModifier?: number; // e.g. +200 or 0
  inStock?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  oldSlug?: string;
  sku: string;
  brand: string;
  categoryId: string;
  categoryPath?: { id: string; name: string; slug: string }[];
  price: number;
  oldPrice?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  fullDescription: string;
  specGroups: SpecGroup[];
  variants?: ProductVariant[];
  warranty: string;
  deliveryTime: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  country: string;
  featured?: boolean;
  productCount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  views: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  pros?: string;
  cons?: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. productId + variants combo)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface OrderItem {
  productId: string;
  productSlug?: string;
  productTitle: string;
  productSku: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    notes?: string;
  };
  deliveryMethod: 'courier' | 'pickup';
  pickupLocation?: string;
  paymentMethod: 'card' | 'cash' | 'installment' | 'bank_transfer';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
