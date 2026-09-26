const fs = require('fs');
const path = require('path');

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

function merge() {
  const sanotechProducts = JSON.parse(fs.readFileSync('scripts/raw_scraped_products.json', 'utf8'));
  const intellcomProducts = JSON.parse(fs.readFileSync('scripts/intellcom_products.json', 'utf8'));

  console.log(`Sanotech products: ${sanotechProducts.length}`);
  console.log(`Intellcom products: ${intellcomProducts.length}`);

  // Clean html entities in descriptions if any
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

  sanotechProducts.forEach(p => {
    p.description = decodeEntities(p.description);
  });

  intellcomProducts.forEach(p => {
    p.description = decodeEntities(p.description);
  });

  // Combine products
  const combinedProducts = [...sanotechProducts, ...intellcomProducts];
  console.log(`Combined total products: ${combinedProducts.length}`);

  // Extract all categories
  const categoriesMap = new Map();

  for (const prod of combinedProducts) {
    if (prod.categoryPath && Array.isArray(prod.categoryPath)) {
      let parentId = undefined;
      for (let i = 0; i < prod.categoryPath.length; i++) {
        const cp = prod.categoryPath[i];
        if (!categoriesMap.has(cp.id)) {
          categoriesMap.set(cp.id, {
            id: cp.id,
            name: cp.name,
            slug: cp.slug || slugify(cp.name),
            parentId,
            level: i + 1,
            icon: i === 0 ? 'Camera' : undefined,
          });
        }
        parentId = cp.id;
      }
    }
  }

  // Calculate productCount for each category (including descendants)
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
    for (const prod of combinedProducts) {
      if (descendantIds.has(prod.categoryId)) {
        count++;
      } else if (prod.categoryPath && prod.categoryPath.some(cp => descendantIds.has(cp.id))) {
        count++;
      }
    }
    cat.productCount = count;
  });

  // Filter out categories with 0 products
  const populatedCategories = allCategories.filter(c => c.productCount > 0);
  console.log(`Populated categories count: ${populatedCategories.length}`);

  // Extract all brands
  const brandsMap = new Map();
  for (const prod of combinedProducts) {
    const brandName = (prod.brand || 'Other').trim();
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
  console.log(`All unique brands count: ${allBrands.length}`);
  console.log('Top brands:', allBrands.slice(0, 15));

  // Write out updated seedData.ts
  const seedContent = `import { Product, Category, Brand, BlogPost } from '@/types';

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(populatedCategories, null, 2)};

export const INITIAL_BRANDS: Brand[] = ${JSON.stringify(allBrands, null, 2)};

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(combinedProducts, null, 2)};

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

  fs.writeFileSync('src/data/seedData.ts', seedContent, 'utf8');
  console.log('Successfully updated src/data/seedData.ts!');
}

merge();
