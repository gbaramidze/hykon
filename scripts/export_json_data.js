const fs = require('fs');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u10A0-\u10FF-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectBrand(title, currentBrand) {
  const t = title.toLowerCase();
  if (t.includes('hikvision')) return 'Hikvision';
  if (t.includes('hiwatch')) return 'HiWatch';
  if (t.includes('hilook')) return 'HiLook';
  if (t.includes('dahua')) return 'Dahua';
  if (t.includes('imou')) return 'Imou';
  if (t.includes('uniview') || t.includes('unv')) return 'Uniview';
  if (t.includes('ezviz')) return 'EZVIZ';
  if (t.includes('ubiquiti') || t.includes('unifi')) return 'Ubiquiti';
  if (t.includes('mikrotik')) return 'MikroTik';
  if (t.includes('ruijie') || t.includes('reyee')) return 'Ruijie';
  if (t.includes('tp-link') || t.includes('tplink')) return 'TP-Link';
  if (t.includes('cisco')) return 'Cisco';
  if (t.includes('seagate')) return 'Seagate';
  if (t.includes('western digital') || t.includes('wd ') || t.includes('wd_') || t.includes('wd-')) return 'Western Digital';
  if (t.includes('tiandy')) return 'Tiandy';
  if (t.includes('ajax')) return 'Ajax';
  if (t.includes('zkteco')) return 'ZKTeco';
  if (t.includes('draytek')) return 'DrayTek';
  if (t.includes('commax')) return 'Commax';
  if (t.includes('paradox')) return 'Paradox';
  if (t.includes('kstar')) return 'KSTAR';
  if (t.includes('leoch')) return 'Leoch';
  if (t.includes('dsppa')) return 'DSPPA';
  if (t.includes('draka')) return 'Draka';
  
  if (currentBrand && currentBrand !== 'Other') return currentBrand;
  return 'Hykon';
}

function run() {
  const sanotechProducts = JSON.parse(fs.readFileSync('scripts/raw_scraped_products.json', 'utf8'));
  const intellcomProducts = JSON.parse(fs.readFileSync('scripts/intellcom_products.json', 'utf8'));

  const decodeEntities = (str) => {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&bull;/g, '•')
      .replace(/&deg;/g, '°');
  };

  const allProducts = [...sanotechProducts, ...intellcomProducts];

  for (const p of allProducts) {
    p.brand = detectBrand(p.title, p.brand);
    p.description = decodeEntities(p.description);
  }

  const categoriesMap = new Map();

  for (const p of allProducts) {
    if (!p.categoryPath || p.categoryPath.length === 0) {
      p.categoryPath = [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' }
      ];
      p.categoryId = 'cat-cctv';
    }

    let parentId = undefined;
    for (let i = 0; i < p.categoryPath.length; i++) {
      const cp = p.categoryPath[i];
      if (!categoriesMap.has(cp.id)) {
        categoriesMap.set(cp.id, {
          id: cp.id,
          name: cp.name,
          slug: cp.slug || slugify(cp.name),
          parentId,
          level: i + 1,
          icon: i === 0 ? 'Camera' : undefined
        });
      }
      parentId = cp.id;
    }
  }

  const allCategories = Array.from(categoriesMap.values());

  const getDescendantIds = (catId) => {
    const ids = new Set([catId]);
    const findChildren = (pId) => {
      const children = allCategories.filter(c => c.parentId === pId);
      children.forEach(ch => {
        ids.add(ch.id);
        findChildren(ch.id);
      });
    };
    findChildren(catId);
    return ids;
  };

  allCategories.forEach(cat => {
    const descendantIds = getDescendantIds(cat.id);
    let count = 0;
    for (const prod of allProducts) {
      if (descendantIds.has(prod.categoryId)) {
        count++;
      } else if (prod.categoryPath && prod.categoryPath.some(cp => descendantIds.has(cp.id))) {
        count++;
      }
    }
    cat.productCount = count;
  });

  const populatedCategories = allCategories.filter(c => c.productCount > 0);

  // Brands
  const brandsMap = new Map();
  for (const prod of allProducts) {
    const brandName = prod.brand.trim();
    const brandSlug = slugify(brandName);
    if (!brandsMap.has(brandSlug)) {
      brandsMap.set(brandSlug, {
        id: `brand-${brandSlug}`,
        name: brandName,
        slug: brandSlug,
        productCount: 0,
      });
    }
    brandsMap.get(brandSlug).productCount++;
  }

  const allBrands = Array.from(brandsMap.values()).sort((a, b) => b.productCount - a.productCount);

  // Write JSON files
  fs.writeFileSync('src/data/categories.json', JSON.stringify(populatedCategories, null, 2), 'utf8');
  fs.writeFileSync('src/data/brands.json', JSON.stringify(allBrands, null, 2), 'utf8');
  fs.writeFileSync('src/data/products.json', JSON.stringify(allProducts, null, 2), 'utf8');

  // Lightweight seedData.ts
  const seedTs = `import { Product, Category, Brand, BlogPost } from '@/types';
import rawCategories from './categories.json';
import rawBrands from './brands.json';
import rawProducts from './products.json';

export const INITIAL_CATEGORIES: Category[] = rawCategories as Category[];
export const INITIAL_BRANDS: Brand[] = rawBrands as Brand[];
export const INITIAL_PRODUCTS: Product[] = rawProducts as Product[];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'როგორ შევარჩიოთ ვიდეო-სამეთვალყურეო კამერა სახლისთვის და ბიზნესისთვის',
    slug: 'how-to-choose-cctv-cameras',
    excerpt: 'სრული გზამკვლევი: IP კამერები, ColorVu, PoE კვება და NVR ჩამწერები.',
    content: 'თანამედროვე უსაფრთხოების სისტემებში ვიდეო მეთვალყურეობა უმნიშვნელოვანეს როლს თამაშობს...',
    coverImage: '/images/products/1766050519198.jpg',
    author: 'გიორგი მაისურაძე',
    date: '24 სექტემბერი 2026',
    category: 'გიდები',
    tags: ['CCTV', 'HiLook', 'Hikvision', 'Security']
  }
];
`;

  fs.writeFileSync('src/data/seedData.ts', seedTs, 'utf8');
  console.log(`Saved 1484 products to src/data/products.json and updated seedData.ts!`);
}

run();
