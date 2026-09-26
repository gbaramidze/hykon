import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_BLOG_POSTS } from '@/data/seedData';

const BASE_URL = 'https://hykon.ge';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function createLocalizedEntries(
  path: string,
  options: {
    priority: number;
    changeFrequency: ChangeFreq;
    lastModified?: Date;
  }
): MetadataRoute.Sitemap {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const kaUrl = `${BASE_URL}${cleanPath}`;
  const enUrl = cleanPath === '/' ? `${BASE_URL}/en` : `${BASE_URL}/en${cleanPath}`;
  const ruUrl = cleanPath === '/' ? `${BASE_URL}/ru` : `${BASE_URL}/ru${cleanPath}`;

  const alternates = {
    languages: {
      ka: kaUrl,
      en: enUrl,
      ru: ruUrl,
      'x-default': kaUrl,
    },
  };

  return [
    {
      url: kaUrl,
      lastModified: options.lastModified || new Date(),
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates,
    },
    {
      url: enUrl,
      lastModified: options.lastModified || new Date(),
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates,
    },
    {
      url: ruUrl,
      lastModified: options.lastModified || new Date(),
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates,
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1. Static Pages for all languages (ka, en, ru)
  const staticPages: { path: string; priority: number; changeFrequency: ChangeFreq }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/catalog', priority: 0.9, changeFrequency: 'daily' },
    { path: '/brands', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { path: '/contacts', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/delivery', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/warranty', priority: 0.7, changeFrequency: 'monthly' },
  ];

  for (const page of staticPages) {
    entries.push(
      ...createLocalizedEntries(page.path, {
        priority: page.priority,
        changeFrequency: page.changeFrequency,
        lastModified: currentDate,
      })
    );
  }

  // 2. Categories for all languages (ka, en, ru)
  for (const category of INITIAL_CATEGORIES) {
    const slug = category.slug || category.id;
    if (!slug) continue;
    entries.push(
      ...createLocalizedEntries(`/catalog?category=${encodeURIComponent(slug)}`, {
        priority: 0.85,
        changeFrequency: 'weekly',
        lastModified: currentDate,
      })
    );
  }

  // 3. Brands for all languages (ka, en, ru)
  for (const brand of INITIAL_BRANDS) {
    const slug = brand.slug || brand.id;
    if (!slug) continue;
    entries.push(
      ...createLocalizedEntries(`/catalog?brand=${encodeURIComponent(slug)}`, {
        priority: 0.8,
        changeFrequency: 'weekly',
        lastModified: currentDate,
      })
    );
  }

  // 4. Blog Posts for all languages (ka, en, ru)
  for (const post of INITIAL_BLOG_POSTS) {
    const slug = post.slug || post.id;
    if (!slug) continue;
    entries.push(
      ...createLocalizedEntries(`/blog/${encodeURIComponent(slug)}`, {
        priority: 0.8,
        changeFrequency: 'weekly',
        lastModified: currentDate,
      })
    );
  }

  // 5. Products for all languages (ka, en, ru)
  const seenProductSlugs = new Set<string>();
  for (const product of INITIAL_PRODUCTS) {
    const slug = product.slug || product.id;
    if (!slug || seenProductSlugs.has(slug)) continue;
    seenProductSlugs.add(slug);

    entries.push(
      ...createLocalizedEntries(`/product/${encodeURIComponent(slug)}`, {
        priority: 0.8,
        changeFrequency: 'weekly',
        lastModified: currentDate,
      })
    );
  }

  return entries;
}
