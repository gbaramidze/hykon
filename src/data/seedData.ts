import { Product, Category, Brand, BlogPost, Order } from '@/types';
import rawCategories from './categories.json';
import rawBrands from './brands.json';
import rawProducts from './products.json';
import rawBlogPosts from './blogPosts.json';

export const INITIAL_CATEGORIES: Category[] = rawCategories as Category[];
export const INITIAL_BRANDS: Brand[] = rawBrands as Brand[];
export const INITIAL_PRODUCTS: Product[] = rawProducts as Product[];
export const INITIAL_BLOG_POSTS: BlogPost[] = rawBlogPosts as BlogPost[];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-981',
    orderNumber: 'HYK-98124',
    customer: {
      fullName: 'დავით ბერიძე',
      phone: '+995 599 12 34 56',
      email: 'davit@example.ge',
      city: 'თბილისი',
      address: 'ჭავჭავაძის გამზ. 42',
    },
    deliveryMethod: 'courier',
    paymentMethod: 'card',
    items: [
      {
        productId: 'prod-int-1',
        productTitle: 'ანალოგური კამერა - 2მპ 2.8მმ Dome, მიკროფონით, Turbo HD, HiLook',
        productSku: 'THC-T120-PS 2.8mm',
        image: '/images/products/intellcom/1674032907823.png',
        price: 56.75,
        quantity: 2,
      }
    ],
    subtotal: 113.5,
    discount: 0,
    shippingFee: 0,
    total: 113.5,
    status: 'delivered',
    createdAt: new Date().toISOString(),
  }
];

