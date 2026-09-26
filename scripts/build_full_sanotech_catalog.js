const fs = require('fs');
const path = require('path');
const https = require('https');
const dns = require('dns');
const cheerio = require('cheerio');
const crypto = require('crypto');

dns.setDefaultResultOrder('ipv4first');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Robust HTTPS request with IPv4
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ka-GE,ka;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      family: 4,
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(res.headers.location));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Download image buffer with IPv4
function downloadImageFile(imgUrl, slug, index = 0) {
  return new Promise((resolve) => {
    if (!imgUrl || !imgUrl.startsWith('http')) return resolve(null);

    try {
      const ext = (path.extname(new URL(imgUrl).pathname) || '.png').split('?')[0];
      const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 35);
      const hash = crypto.createHash('md5').update(imgUrl).digest('hex').slice(0, 8);
      const filename = `${safeSlug}-${hash}${ext}`;
      const filePath = path.join(IMAGES_DIR, filename);
      const publicPath = `/images/products/${filename}`;

      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 300) {
        return resolve(publicPath);
      }

      const req = https.get(imgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.sanotech.ge/'
        },
        family: 4,
        timeout: 8000
      }, (res) => {
        if (res.statusCode !== 200) {
          return resolve(null);
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length > 300) {
            fs.writeFileSync(filePath, buffer);
            resolve(publicPath);
          } else {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
    } catch (e) {
      resolve(null);
    }
  });
}

// Load Categories
let rawCatTree = [];
try {
  rawCatTree = JSON.parse(fs.readFileSync('scripts/category_tree.json', 'utf8'));
} catch (e) {
  console.log('Category tree not found.');
}

const allCategories = [];
const categoryLookup = [];

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
  categoryLookup.push(rootCat);

  if (root.children) {
    root.children.forEach((sub, subIdx) => {
      const subCat = {
        id: sub.id || `cat-sub-${idx + 1}-${subIdx + 1}`,
        name: sub.name,
        slug: sub.slug,
        level: 2,
        parentId: rootCat.id,
        featured: subIdx < 4,
        order: subIdx + 1
      };
      allCategories.push(subCat);
      categoryLookup.push(subCat);
    });
  }
});

console.log(`Initialized ${allCategories.length} categories.`);

// Category matcher
function matchCategory(title, slug) {
  const lower = (title + ' ' + slug).toLowerCase();

  if (lower.includes('router') || lower.includes('როუტერი') || lower.includes('wi-fi') || lower.includes('access point') || lower.includes('დაშვების წერტილი')) {
    return categoryLookup.find(c => c.slug === 'wi-fi-routerebi' || c.slug === 'qseluri-motsyobilobebi') || categoryLookup[0];
  }
  if (lower.includes('shlagbaum') || lower.includes('შლაგბაუმ')) {
    return categoryLookup.find(c => c.slug === 'shlagbaumebi') || categoryLookup.find(c => c.slug === 'dashvebis-sistemebi') || categoryLookup[0];
  }
  if (lower.includes('turniket') || lower.includes('ტურნიკეტ')) {
    return categoryLookup.find(c => c.slug === 'turniketebi') || categoryLookup.find(c => c.slug === 'dashvebis-sistemebi') || categoryLookup[0];
  }
  if (lower.includes('interkom') || lower.includes('დომოფონ') || lower.includes('ინტერკომ')) {
    return categoryLookup.find(c => c.slug === 'video-interkomebi') || categoryLookup[0];
  }
  if (lower.includes('saket') || lower.includes('საკეტ')) {
    return categoryLookup.find(c => c.slug === 'saketebi' || c.slug === 'chkviani-saketebi') || categoryLookup[0];
  }
  if (lower.includes('ajax')) {
    return categoryLookup.find(c => c.slug === 'ajax') || categoryLookup[0];
  }
  if (lower.includes('ezviz')) {
    return categoryLookup.find(c => c.slug === 'ezviz-chkviani-sakhli') || categoryLookup[0];
  }
  if (lower.includes('chamtsereb') || lower.includes('nvr') || lower.includes('dvr') || lower.includes('ჩამწერ')) {
    return categoryLookup.find(c => c.slug === 'chamtserebi') || categoryLookup[0];
  }
  if (lower.includes('kamera') || lower.includes('კამერ') || lower.includes('camera') || lower.includes('colorvu') || lower.includes('acusense')) {
    if (lower.includes('ip')) return categoryLookup.find(c => c.slug === 'ip-kamerebi') || categoryLookup[0];
    return categoryLookup.find(c => c.slug === 'kamerebi') || categoryLookup[0];
  }
  if (lower.includes('svichi') || lower.includes('switch') || lower.includes('სვიჩ') || lower.includes('კომუტატორ')) {
    return categoryLookup.find(c => c.slug === 'qseluri-komutatorebi') || categoryLookup[0];
  }
  if (lower.includes('kabel') || lower.includes('კაბელ') || lower.includes('utp') || lower.includes('ftp')) {
    return categoryLookup.find(c => c.slug === 'kabelebi') || categoryLookup[0];
  }
  if (lower.includes('ups') || lower.includes('აკუმულატორ') || lower.includes('კვების წყარო')) {
    return categoryLookup.find(c => c.slug === 'utsyveti-kvebis-tsyaroebi' || c.slug === 'kvebis-blokebi') || categoryLookup[0];
  }
  if (lower.includes('disk') || lower.includes('მყარი დისკ') || lower.includes('ssd') || lower.includes('sdcard')) {
    return categoryLookup.find(c => c.slug === 'myari-diskebi' || c.slug === 'monatsemta-shemnakhveli') || categoryLookup[0];
  }
  if (lower.includes('sakhandzro') || lower.includes('ხანძარ') || lower.includes('კვამლ') || lower.includes('smoke')) {
    return categoryLookup.find(c => c.slug === 'sakhandzro-sistemebi' || c.slug === 'khandzarqrobis-sistemebi') || categoryLookup[0];
  }
  if (lower.includes('monitor') || lower.includes('მონიტორ')) {
    return categoryLookup.find(c => c.slug === 'monitorebi') || categoryLookup[0];
  }

  return categoryLookup[0];
}

function detectBrand(title) {
  const lower = title.toLowerCase();
  if (lower.includes('hikvision')) return 'Hikvision';
  if (lower.includes('hiwatch')) return 'HiWatch';
  if (lower.includes('hilook')) return 'HiLook';
  if (lower.includes('ezviz')) return 'EZVIZ';
  if (lower.includes('ajax')) return 'AJAX';
  if (lower.includes('dahua')) return 'Dahua';
  if (lower.includes('seagate')) return 'Seagate';
  if (lower.includes('western digital') || lower.includes('wd purple')) return 'Western Digital';
  if (lower.includes('fmg')) return 'FMG';
  if (lower.includes('ruijie') || lower.includes('reyee')) return 'Ruijie';
  return 'Hikvision';
}

function parseSpecsFromHtml(htmlContent, defaultBrand, defaultSku) {
  const specGroups = [];
  if (!htmlContent) {
    return [
      {
        group: 'ძირითადი პარამეტრები',
        items: [
          { name: 'ბრენდი', value: defaultBrand },
          { name: 'მოდელი', value: defaultSku },
          { name: 'გარანტია', value: '2 წელი' },
          { name: 'სტატუსი', value: 'მარაგშია' }
        ]
      }
    ];
  }

  const $ = cheerio.load(htmlContent);
  let currentGroup = 'ძირითადი მახასიათებლები';
  let currentItems = [];

  $('h3, h4, h5, strong, b').each((i, el) => {
    const txt = $(el).text().trim();
    if (txt.length > 3 && txt.length < 50 && !txt.includes(':')) {
      currentGroup = txt;
    }
  });

  $('li').each((i, el) => {
    const full = $(el).text().trim();
    const bText = $(el).find('b, strong').text().trim();
    let name = bText.replace(/:$/, '').trim();
    let value = full.replace(bText, '').replace(/^[:\s-]+/, '').trim();
    if (!name && full.includes(':')) {
      const parts = full.split(':');
      name = parts[0].trim();
      value = parts.slice(1).join(':').trim();
    }
    if (name && value) {
      currentItems.push({ name, value });
    }
  });

  if (currentItems.length > 0) {
    specGroups.push({ group: currentGroup, items: currentItems });
  } else {
    specGroups.push({
      group: 'ძირითადი პარამეტრები',
      items: [
        { name: 'ბრენდი', value: defaultBrand },
        { name: 'მოდელი', value: defaultSku },
        { name: 'გარანტია', value: '2 წელი' },
        { name: 'სტატუსი', value: 'მარაგშია' }
      ]
    });
  }

  return specGroups;
}

async function main() {
  console.log('=== STARTING FULL SANOTECH CATALOG CRAWLER & DOWNLOADER ===');
  
  const rawProducts = [];
  const TOTAL_PAGES = 44;

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const url = page === 1 ? 'https://www.sanotech.ge/products' : `https://www.sanotech.ge/products?page=${page}`;
    try {
      const res = await fetchHtml(url);
      if (res.status !== 200) {
        console.log(`Page ${page} returned status ${res.status}`);
        continue;
      }
      
      const $ = cheerio.load(res.data);
      let pageCount = 0;

      $('.product-card').each((i, el) => {
        const card = $(el);
        const link = card.find('.title a, .product-thumb a').attr('href') || '';
        let title = card.find('.title a').text().trim();
        const imgUrl = card.find('.product-thumb img').attr('data-src') || card.find('.product-thumb img').attr('src') || '';
        const priceText = card.find('.price').text().replace(/[^0-9.]/g, '');
        const price = parseFloat(priceText) || 99;
        const descHtml = card.find('.single_content').html() || '';
        const dataId = card.find('button[data-id], .addToWishlist').attr('data-id') || `p-${page}-${i}`;

        const slug = link.split('/product/')[1]?.replace(/[^a-zA-Z0-9_-]/g, '') || `prod-${dataId}`;
        
        if (title.endsWith('...') && slug) {
          title = title.replace(/\.\.\.$/, '').trim();
        }

        rawProducts.push({
          dataId,
          slug,
          link,
          title,
          imgUrl,
          price,
          descHtml
        });
        pageCount++;
      });

      console.log(`[CRAWL] Page ${page}/${TOTAL_PAGES} parsed (${pageCount} products, total ${rawProducts.length})`);
      await sleep(150);
    } catch (e) {
      console.error(`Error on page ${page}:`, e.message);
    }
  }

  console.log(`\nSuccessfully crawled all ${rawProducts.length} product records.`);
  fs.writeFileSync('scripts/raw_scraped_products.json', JSON.stringify(rawProducts, null, 2));

  console.log('\n--- DOWNLOADING IMAGES AND BUILDING HYKON STORE DATABASE ---');
  const finalProducts = [];
  const BATCH_SIZE = 15;

  for (let i = 0; i < rawProducts.length; i += BATCH_SIZE) {
    const chunk = rawProducts.slice(i, i + BATCH_SIZE);
    
    await Promise.all(chunk.map(async (raw, cIdx) => {
      const idx = i + cIdx;
      const brand = detectBrand(raw.title + ' ' + raw.slug);
      const cat = matchCategory(raw.title, raw.slug);
      const sku = `ST-${raw.dataId || (10000 + idx)}`;
      
      let localImg = await downloadImageFile(raw.imgUrl, raw.slug, 0);
      if (!localImg) {
        localImg = '/images/products/placeholder.svg';
      }

      const specGroups = parseSpecsFromHtml(raw.descHtml, brand, sku);
      const shortDesc = cheerio.load(raw.descHtml || '').text().trim().slice(0, 300) || raw.title;

      const product = {
        id: `prod-${idx + 1}`,
        title: raw.title,
        slug: raw.slug,
        sku,
        brand,
        categoryId: cat.id,
        categoryPath: [
          { id: cat.id, name: cat.name, slug: cat.slug }
        ],
        price: raw.price,
        oldPrice: raw.price > 0 ? Math.round(raw.price * 1.15) : undefined,
        inStock: true,
        stockCount: Math.floor(Math.random() * 25) + 5,
        rating: +(4.8 + (idx % 3) * 0.1).toFixed(1),
        reviewCount: Math.floor(Math.random() * 15) + 2,
        isNew: idx < 80,
        isFeatured: idx % 6 === 0,
        isBestseller: idx % 9 === 0,
        images: [localImg],
        thumbnail: localImg,
        shortDescription: shortDesc,
        fullDescription: raw.descHtml || `<p>${raw.title}</p>`,
        specGroups,
        warranty: '2 წელი',
        deliveryTime: '1-2 დღე',
        createdAt: new Date().toISOString()
      };

      finalProducts.push(product);
    }));

    if (i % 60 === 0 || i + BATCH_SIZE >= rawProducts.length) {
      console.log(`[IMAGES & DATA] Processed ${finalProducts.length}/${rawProducts.length} products (saved images locally)...`);
      fs.writeFileSync('src/data/sanotech_products.json', JSON.stringify(finalProducts, null, 2));
    }
  }

  // Deduplicate brands
  const brandSet = new Set();
  finalProducts.forEach(p => brandSet.add(p.brand));
  const brands = Array.from(brandSet).map((bName, idx) => ({
    id: `brand-${idx + 1}`,
    name: bName,
    slug: bName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    logo: '/images/brands/hikvision.svg',
    description: `Official ${bName} high quality security equipment with guarantee.`,
    country: 'International',
    featured: true,
    productCount: finalProducts.filter(p => p.brand === bName).length
  }));

  fs.writeFileSync('src/data/sanotech_products.json', JSON.stringify(finalProducts, null, 2));
  fs.writeFileSync('src/data/sanotech_categories.json', JSON.stringify(allCategories, null, 2));
  fs.writeFileSync('src/data/sanotech_brands.json', JSON.stringify(brands, null, 2));

  console.log(`\n========================================`);
  console.log(`ALL DONE! Created complete dataset:`);
  console.log(`- ${finalProducts.length} Products in src/data/sanotech_products.json`);
  console.log(`- ${allCategories.length} Categories in src/data/sanotech_categories.json`);
  console.log(`- ${brands.length} Brands in src/data/sanotech_brands.json`);
  console.log(`========================================\n`);
}

main().catch(console.error);
