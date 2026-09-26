const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const crypto = require('crypto');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Load Category Tree
let rawCatTree = [];
try {
  rawCatTree = JSON.parse(fs.readFileSync('scripts/category_tree.json', 'utf8'));
} catch (e) {
  console.log('Category tree not found.');
}

const allCategories = [];
const categorySlugMap = new Map();

rawCatTree.forEach((root, idx) => {
  const rootCat = {
    id: root.id || `cat-root-${idx + 1}`,
    name: root.name,
    slug: root.slug,
    level: 1,
    parentId: null,
    featured: idx < 8,
    order: idx + 1
  };
  allCategories.push(rootCat);
  categorySlugMap.set(root.slug, rootCat);

  if (root.children) {
    root.children.forEach((sub, subIdx) => {
      const subCat = {
        id: sub.id || `cat-sub-${idx + 1}-${subIdx + 1}`,
        name: sub.name,
        slug: sub.slug,
        level: 2,
        parentId: rootCat.id,
        featured: subIdx < 3,
        order: subIdx + 1
      };
      allCategories.push(subCat);
      categorySlugMap.set(sub.slug, subCat);
    });
  }
});

console.log(`Loaded ${allCategories.length} categories into lookup map.`);

// Helper: Download single image with timeout
async function downloadImage(imgUrl, slug, index = 0) {
  if (!imgUrl || !imgUrl.startsWith('http')) return null;

  try {
    const ext = (path.extname(new URL(imgUrl).pathname) || '.jpg').split('?')[0];
    const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    const hash = crypto.createHash('md5').update(imgUrl).digest('hex').slice(0, 8);
    const filename = `${safeSlug}-${index}-${hash}${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);
    const publicPath = `/images/products/${filename}`;

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 500) {
      return publicPath;
    }

    const res = await fetch(imgUrl, {
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.sanotech.ge/'
      }
    });

    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 300) return null;
    fs.writeFileSync(filePath, buffer);
    return publicPath;
  } catch (err) {
    return null;
  }
}

// Scrape single product
async function scrapeProduct(url, index) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h3.product-title, h1.product-title, .product-title').first().text().trim().replace(/\s+/g, ' ');
    if (!title) return null;

    // Price
    let priceText = $('#productPrice, .product-price').first().text().replace(/[^0-9.]/g, '');
    let price = parseFloat(priceText) || 0;

    // Slug
    const urlParts = url.split('/product/');
    const slug = urlParts[1] ? urlParts[1].replace(/[^a-zA-Z0-9_-]/g, '') : `product-${index}`;

    // SKU
    let sku = '';
    $('.product-types span, .product-details span').each((i, el) => {
      const t = $(el).text().trim();
      if (t.startsWith('SKU:')) {
        sku = t.replace('SKU:', '').trim();
      }
    });
    if (!sku) {
      const dataPdi = $('.product-title').attr('data-pdi');
      sku = dataPdi ? `ST-${dataPdi}` : `SKU-${10000 + index}`;
    }

    // Brand
    let brand = 'Hikvision';
    $('.product-types a, .product-details a').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('/products') && !href.includes('/category/')) {
        const text = $(el).text().trim();
        if (text && text.length < 30 && !text.includes('კატეგორი')) {
          brand = text;
        }
      }
    });

    // Category matching
    let categorySlug = '';
    $('.product-types a').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('/products/')) {
        const catS = href.split('/products/')[1];
        if (catS && categorySlugMap.has(catS)) {
          categorySlug = catS;
        }
      }
    });

    let catObj = categorySlug ? categorySlugMap.get(categorySlug) : null;
    if (!catObj) {
      catObj = allCategories[0] || { id: 'cat-1', name: 'Security', slug: 'security' };
    }

    // Summary / Short description
    const summaryHtml = $('.product-summary').html() || '';
    const summaryText = $('.product-summary').text().trim().replace(/\s+/g, ' ');

    // Spec Groups
    const specGroups = [];
    $('.description-item').each((i, el) => {
      const groupTitle = $(el).find('h3, h4, h5, strong').first().text().trim().replace(/\s+/g, ' ') || `მახასიათებლები ${i + 1}`;
      const items = [];

      $(el).find('li').each((liI, liEl) => {
        const fullLi = $(liEl).text().trim();
        const bText = $(liEl).find('b, strong').text().trim();
        let name = bText.replace(/:$/, '').trim();
        let value = fullLi.replace(bText, '').replace(/^[:\s-]+/, '').trim();
        if (!name && fullLi.includes(':')) {
          const parts = fullLi.split(':');
          name = parts[0].trim();
          value = parts.slice(1).join(':').trim();
        }
        if (name && value) {
          items.push({ name, value });
        }
      });

      if (items.length > 0) {
        specGroups.push({ group: groupTitle, items });
      }
    });

    // Images
    const rawImageUrls = [];
    $('.product-gallery img, .xzoom-thumbs img, .quick-view-slider img, .xzoom-container img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('xoriginal');
      if (src && src.includes('sanotech.ge') && (src.includes('/storage/') || src.includes('/products/')) && !src.includes('default.png') && !src.includes('logo')) {
        rawImageUrls.push(src);
      }
    });

    const uniqueRawImgs = [...new Set(rawImageUrls)];

    // Download images locally
    const localImages = [];
    for (let imgIdx = 0; imgIdx < uniqueRawImgs.length; imgIdx++) {
      const localPath = await downloadImage(uniqueRawImgs[imgIdx], slug, imgIdx);
      if (localPath) {
        localImages.push(localPath);
      }
    }

    if (localImages.length === 0) {
      localImages.push('/images/products/placeholder.svg');
    }

    return {
      id: `prod-${index + 1}`,
      title,
      slug,
      sku,
      brand: brand || 'Hikvision',
      categoryId: catObj.id,
      categoryPath: [
        { id: catObj.id, name: catObj.name, slug: catObj.slug }
      ],
      price: price || 99,
      oldPrice: price > 0 ? Math.round(price * 1.15) : undefined,
      inStock: true,
      stockCount: Math.floor(Math.random() * 25) + 5,
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 18) + 2,
      isNew: index < 60,
      isFeatured: index % 5 === 0,
      isBestseller: index % 7 === 0,
      images: localImages,
      thumbnail: localImages[0],
      shortDescription: summaryText.slice(0, 300) || title,
      fullDescription: summaryHtml || `<p>${title}</p>`,
      specGroups: specGroups.length > 0 ? specGroups : [
        {
          group: 'ძირითადი პარამეტრები',
          items: [
            { name: 'ბრენდი', value: brand || 'Hikvision' },
            { name: 'მოდელი', value: sku || title.slice(0, 20) },
            { name: 'გარანტია', value: '2 წელი' },
            { name: 'სტატუსი', value: 'მარაგშია' }
          ]
        }
      ],
      warranty: '2 წელი',
      deliveryTime: '1-2 დღე',
      createdAt: new Date().toISOString()
    };
  } catch (err) {
    return null;
  }
}

async function runBatchScraper() {
  const urls = JSON.parse(fs.readFileSync('scripts/all_product_urls.json', 'utf8'));
  console.log(`Starting Batch Scraper for ${urls.length} products...`);

  const BATCH_SIZE = 15;
  const products = [];
  const startTime = Date.now();

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const chunk = urls.slice(i, i + BATCH_SIZE);
    const promises = chunk.map((url, cIdx) => scrapeProduct(url, i + cIdx));
    const results = await Promise.allSettled(promises);

    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        products.push(res.value);
      }
    });

    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const progressPct = (((i + chunk.length) / urls.length) * 100).toFixed(1);
    console.log(`[${progressPct}%] Scraped ${products.length}/${i + chunk.length} products (${elapsedSec}s elapsed)`);

    // Periodic save
    if (i % 60 === 0 || i + BATCH_SIZE >= urls.length) {
      fs.writeFileSync('src/data/sanotech_products.json', JSON.stringify(products, null, 2));
    }
  }

  console.log(`\nDONE! All ${products.length} products scraped & images saved.`);

  // Extract Brands
  const brandSet = new Set();
  products.forEach(p => {
    if (p.brand) brandSet.add(p.brand);
  });

  const brands = Array.from(brandSet).map((brandName, idx) => ({
    id: `brand-${idx + 1}`,
    name: brandName,
    slug: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    logo: '/images/brands/hikvision.svg',
    description: `Official ${brandName} warranty and support.`,
    country: 'International',
    featured: true,
    productCount: products.filter(p => p.brand === brandName).length
  }));

  fs.writeFileSync('src/data/sanotech_products.json', JSON.stringify(products, null, 2));
  fs.writeFileSync('src/data/sanotech_categories.json', JSON.stringify(allCategories, null, 2));
  fs.writeFileSync('src/data/sanotech_brands.json', JSON.stringify(brands, null, 2));

  console.log('Saved final datasets to src/data/');
}

runBatchScraper().catch(console.error);
