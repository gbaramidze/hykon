'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, BlogPost, Order, CartItem } from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BRANDS,
  INITIAL_BLOG_POSTS,
  INITIAL_ORDERS,
} from '@/data/seedData';

type Currency = 'GEL' | 'USD';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  blogPosts: BlogPost[];
  orders: Order[];
  cart: CartItem[];
  compareList: Product[];
  wishlist: string[];
  currency: Currency;
  isMounted: boolean;

  // Shopping Actions
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Comparison Actions
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Settings & Utilities
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInGEL: number) => string;

  // Admin CRUD Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  addBlogPost: (post: Omit<BlogPost, 'id'>) => BlogPost;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  addBrand: (brand: Omit<Brand, 'id'>) => Brand;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const USD_RATE = 2.75; // 1 USD = 2.75 GEL

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('GEL');

  // Load from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedProducts = localStorage.getItem('hykon_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCategories = localStorage.getItem('hykon_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedBrands = localStorage.getItem('hykon_brands');
      if (savedBrands) setBrands(JSON.parse(savedBrands));

      const savedBlog = localStorage.getItem('hykon_blog');
      if (savedBlog) setBlogPosts(JSON.parse(savedBlog));

      const savedOrders = localStorage.getItem('hykon_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem('hykon_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCompare = localStorage.getItem('hykon_compare');
      if (savedCompare) setCompareList(JSON.parse(savedCompare));

      const savedWishlist = localStorage.getItem('hykon_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCurrency = localStorage.getItem('hykon_currency');
      if (savedCurrency === 'USD' || savedCurrency === 'GEL') setCurrencyState(savedCurrency);
    } catch (e) {
      console.error('Failed to load store state from localStorage:', e);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_products', JSON.stringify(products));
  }, [products, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_categories', JSON.stringify(categories));
  }, [categories, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_brands', JSON.stringify(brands));
  }, [brands, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_blog', JSON.stringify(blogPosts));
  }, [blogPosts, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_orders', JSON.stringify(orders));
  }, [orders, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_cart', JSON.stringify(cart));
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_compare', JSON.stringify(compareList));
  }, [compareList, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('hykon_wishlist', JSON.stringify(wishlist));
  }, [wishlist, isMounted]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('hykon_currency', c);
  };

  const formatPrice = (amountInGEL: number): string => {
    if (currency === 'USD') {
      const usdAmount = (amountInGEL / USD_RATE).toFixed(0);
      return `$${Number(usdAmount).toLocaleString()}`;
    }
    return `${amountInGEL.toLocaleString()} ₾`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    const variantKey = selectedVariants ? Object.entries(selectedVariants).sort().map(([k, v]) => `${k}:${v}`).join('|') : '';
    const cartItemId = `${product.id}-${variantKey}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: cartItemId, productId: product.id, product, quantity, selectedVariants }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Comparison operations
  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('Максимум 4 товара для одновременного сравнения.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (productId: string) => compareList.some(p => p.id === productId);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Admin CRUD operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(i => i.productId !== id));
    setCompareList(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(wId => wId !== id));
  };

  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HYK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const addBlogPost = (postData: Omit<BlogPost, 'id'>): BlogPost => {
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}`,
    };
    setBlogPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
  };

  const addBrand = (brandData: Omit<Brand, 'id'>): Brand => {
    const newBrand: Brand = {
      ...brandData,
      id: `brand-${Date.now()}`,
    };
    setBrands(prev => [...prev, newBrand]);
    return newBrand;
  };

  const updateBrand = (id: string, updatedFields: Partial<Brand>) => {
    setBrands(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBrands(INITIAL_BRANDS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem('hykon_products');
    localStorage.removeItem('hykon_categories');
    localStorage.removeItem('hykon_brands');
    localStorage.removeItem('hykon_blog');
    localStorage.removeItem('hykon_orders');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        blogPosts,
        orders,
        cart,
        compareList,
        wishlist,
        currency,
        isMounted,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        toggleWishlist,
        isInWishlist,
        setCurrency,
        formatPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addBrand,
        updateBrand,
        deleteBrand,
        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
