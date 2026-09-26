import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/compare',
          '/wishlist',
          '/_next/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/compare',
          '/wishlist',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/compare',
          '/wishlist',
        ],
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-success',
          '/order-success/*',
          '/compare',
          '/wishlist',
        ],
      },
    ],
    sitemap: 'https://hykon.ge/sitemap.xml',
    host: 'https://hykon.ge',
  };
}
