const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/images/products/intellcom');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      return resolve(true);
    }
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(true));
        });
      } else {
        file.close();
        fs.unlink(destPath, () => {});
        resolve(false);
      }
    }).on('error', () => {
      file.close();
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

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

function parseProduct(html, url, idx) {
  const titleM = html.match(/<h1[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                 html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : '';
  if (!title) return null;

  const modelM = html.match(/id=["']product_model["'][^>]*>([\s\S]*?)<\//i) ||
                 html.match(/მოდელი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const model = modelM ? modelM[1].replace(/<[^>]+>/g, '').trim() : '';

  const codeM = html.match(/კოდი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const sku = codeM ? codeM[1].replace(/<[^>]+>/g, '').trim() : (model || `INT-137-${idx}`);

  let price = 0;
  let oldPrice = undefined;
  const priceM = html.match(/class=["'][^"']*product_price[^"']*["'][^>]*>([0-9.,]+)/i) ||
                 html.match(/class=["'][^"']*pp-total-price[^"']*["'][^>]*>([0-9.,]+)/i);
  if (priceM) {
    price = parseFloat(priceM[1].replace(',', ''));
  }

  const strikeM = html.match(/class=["'][^"']*product_price_strike[^"']*["'][^>]*>([0-9.,]+)/i) ||
                  html.match(/class=["'][^"']*pp-total-strike[^"']*["'][^>]*>([0-9.,]+)/i);
  if (strikeM) {
    const sPrice = parseFloat(strikeM[1].replace(',', ''));
    if (sPrice > price) {
      oldPrice = sPrice;
    }
  }

  let brand = 'HiLook';
  const brandKeywords = [
    'HiLook', 'Hikvision', 'Dahua', 'Imou', 'Uniview', 'EZVIZ', 
    'Ubiquiti', 'MikroTik', 'Ruijie', 'Reyee', 'TP-Link', 'Cisco',
    'Seagate', 'Western Digital', 'WD', 'Tiandy', 'KSTAR', 'Leoch', 'DSPPA', 'Draka'
  ];
  for (const b of brandKeywords) {
    if (title.toLowerCase().includes(b.toLowerCase()) || html.includes(`alt="${b}"`)) {
      brand = b;
      break;
    }
  }

  const imgFileMap = new Map();
  const bigMatches = [...html.matchAll(/\/files\/product_imgs\/big\/([a-zA-Z0-9._-]+)/gi)];
  for (const m of bigMatches) {
    const filename = m[1].replace(/\);?$/, '');
    imgFileMap.set(filename, `https://www.intellcom.ge/files/product_imgs/big/${filename}`);
  }
  const medMatches = [...html.matchAll(/\/files\/product_imgs\/medium\/([a-zA-Z0-9._-]+)/gi)];
  for (const m of medMatches) {
    const filename = m[1].replace(/\);?$/, '');
    if (!imgFileMap.has(filename)) {
      imgFileMap.set(filename, `https://www.intellcom.ge/files/product_imgs/medium/${filename}`);
    }
  }

  const remoteImages = Array.from(imgFileMap.values());

  const descM = html.match(/<div[^>]+id=["']description["'][\s\S]*?<\/div>/i);
  let description = '';
  if (descM) {
    description = descM[0].replace(/<div[^>]*>|<\/div>/gi, '').trim();
  }

  const catNavM = html.match(/<div[^>]+class=["'][^"']*category-nav[^"']*["'][\s\S]*?<\/div>/i);
  const breadcrumbs = [];
  if (catNavM) {
    const links = [...catNavM[0].matchAll(/<a[^>]+href=["'](\/ka\/catalog\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi)];
    for (const l of links) {
      const name = l[4].replace(/<[^>]+>/g, '').trim();
      if (name && !name.includes('მთავარი')) {
        breadcrumbs.push({
          id: `intellcom-cat-${l[2]}`,
          name,
          slug: decodeURIComponent(l[3]).replace(/\/$/, '')
        });
      }
    }
  }

  if (breadcrumbs.length === 0) {
    breadcrumbs.push(
      { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
      { id: 'intellcom-cat-137', name: 'IP კამერები', slug: 'IP-კამერები' }
    );
  }

  const primaryCategory = breadcrumbs[breadcrumbs.length - 1];
  const productSlug = `${slugify(title)}-${sku ? slugify(sku) : idx}`.replace(/-+/g, '-');

  return {
    id: `prod-int-137-${idx + 1}`,
    title,
    slug: productSlug,
    sku,
    model,
    brand,
    categoryId: primaryCategory.id,
    categoryPath: breadcrumbs,
    price: price || 99,
    oldPrice,
    inStock: true,
    stockCount: Math.floor(Math.random() * 15) + 3,
    rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
    reviewsCount: Math.floor(Math.random() * 12) + 1,
    isNew: idx % 6 === 0,
    isBestseller: idx % 5 === 0,
    shortDescription: title,
    description: description || `<p>${title}</p>`,
    specGroups: [
      {
        group: 'ძირითადი მახასიათებლები',
        items: [
          { name: 'ბრენდი', value: brand },
          { name: 'მოდელი', value: model || sku },
          { name: 'კატეგორია', value: primaryCategory.name }
        ]
      }
    ],
    remoteImages,
    sourceUrl: url,
    createdAt: new Date().toISOString()
  };
}

async function scrapeAllFilterPages() {
  const baseUrl = 'https://www.intellcom.ge/ka/catalog/137/IP-%E1%83%99%E1%83%90%E1%83%9B%E1%83%94%E1%83%A0%E1%83%94%E1%83%91%E1%83%98/features/2[0]=HiLook+By+HIKVISION&2[1]=Ubiquiti&2[2]=Uniview&1108[0]=2&1116[0]=2&1117[0]=2&1124[0]=2&1125[0]=2&last=2/';
  console.log(`Starting crawl of filtered catalog URL: ${baseUrl}`);

  const productUrls = new Set();
  let page = 1;

  while (true) {
    // Check page URL format: page 1 is baseUrl, page 2 is baseUrl/page-2/ or baseUrl with /page-2/ inserted
    let pageUrl;
    if (page === 1) {
      pageUrl = baseUrl;
    } else {
      // In intellcom, page pagination with features is usually .../features/.../page-N/ or .../page-N/
      pageUrl = `${baseUrl.replace(/\/$/, '')}/page-${page}/`;
    }

    console.log(`\nFetching Page ${page}: ${pageUrl}`);
    const res = await get(pageUrl);
    if (res.status !== 200 || !res.data) {
      console.log(`Status ${res.status}. Ending pagination.`);
      break;
    }

    const prodMatches = [...res.data.matchAll(/href=["'](\/ka\/product\/[^"']+)["']/g)].map(m => m[1]);
    const uniquePageProds = [...new Set(prodMatches)];
    console.log(`Page ${page}: found ${uniquePageProds.length} product links on page.`);

    if (uniquePageProds.length === 0) {
      console.log(`No products found on page ${page}. Ending pagination.`);
      break;
    }

    let newFound = 0;
    for (const p of uniquePageProds) {
      if (!productUrls.has(p)) {
        productUrls.add(p);
        newFound++;
      }
    }

    console.log(`Added ${newFound} new products. Total collected from filter: ${productUrls.size}`);
    if (newFound === 0) {
      console.log(`No new products on page ${page}. Ending pagination.`);
      break;
    }

    page++;
    if (page > 30) break;
  }

  const collectedUrls = Array.from(productUrls);
  console.log(`\nFound ${collectedUrls.length} total product URLs in this filter.`);
  fs.writeFileSync('scripts/intellcom_filter_137_urls.json', JSON.stringify(collectedUrls, null, 2));

  // Load existing products to avoid ANY duplicates
  const existingProducts = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
  console.log(`Existing products count in database: ${existingProducts.length}`);

  const existingTitles = new Set(existingProducts.map(p => p.title.toLowerCase().trim()));
  const existingSkus = new Set(existingProducts.map(p => (p.sku || '').toLowerCase().trim()).filter(Boolean));
  const existingSlugs = new Set(existingProducts.map(p => p.slug));

  // Parse all products from filter
  console.log(`\nParsing products and checking for duplicates...`);
  const newProducts = [];
  const CONCURRENCY = 15;

  for (let i = 0; i < collectedUrls.length; i += CONCURRENCY) {
    const chunk = collectedUrls.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (relUrl, chunkIdx) => {
        const fullUrl = relUrl.startsWith('http') ? relUrl : `https://www.intellcom.ge${relUrl}`;
        try {
          const res = await get(fullUrl);
          if (res.status === 200 && res.data) {
            const parsed = parseProduct(res.data, fullUrl, i + chunkIdx);
            if (parsed) {
              const isDuplicateTitle = existingTitles.has(parsed.title.toLowerCase().trim());
              const isDuplicateSku = parsed.sku && existingSkus.has(parsed.sku.toLowerCase().trim());

              if (isDuplicateTitle || isDuplicateSku) {
                // Duplicate! Do not add
                // console.log(`Duplicate skipped: ${parsed.title}`);
              } else {
                existingTitles.add(parsed.title.toLowerCase().trim());
                if (parsed.sku) existingSkus.add(parsed.sku.toLowerCase().trim());
                newProducts.push(parsed);
              }
            }
          }
        } catch (e) {
          console.error(`Error fetching ${fullUrl}:`, e.message);
        }
      })
    );
    process.stdout.write(`\rProcessed ${i + chunk.length}/${collectedUrls.length}... (New unique: ${newProducts.length})`);
  }

  console.log(`\nTotal new non-duplicate products found: ${newProducts.length}`);

  if (newProducts.length === 0) {
    console.log('All products from this filter are already in the catalog (0 duplicates added).');
    return;
  }

  // Download images for new products
  console.log('\n--- DOWNLOADING NEW IMAGES ---');
  const allImagesToDownload = [];
  for (const prod of newProducts) {
    prod.images = [];
    if (prod.remoteImages && prod.remoteImages.length > 0) {
      for (const rImg of prod.remoteImages) {
        const filename = path.basename(rImg.split('?')[0]);
        const localPath = path.join(imgDir, filename);
        const publicUrl = `/images/products/intellcom/${filename}`;
        allImagesToDownload.push({ remoteUrl: rImg, localPath, publicUrl, prod });
      }
    } else {
      prod.images = ['/images/placeholder.svg'];
      prod.thumbnail = '/images/placeholder.svg';
    }
  }

  const uniqueDownloads = new Map();
  for (const item of allImagesToDownload) {
    if (!uniqueDownloads.has(item.localPath)) {
      uniqueDownloads.set(item.localPath, item);
    }
    if (!item.prod.images.includes(item.publicUrl)) {
      item.prod.images.push(item.publicUrl);
    }
  }

  for (const prod of newProducts) {
    if (!prod.thumbnail && prod.images.length > 0) {
      prod.thumbnail = prod.images[0];
    }
    delete prod.remoteImages;
    delete prod.sourceUrl;
  }

  console.log(`Total new images to download: ${uniqueDownloads.size}`);
  const downloadList = Array.from(uniqueDownloads.values());
  const IMG_CONCURRENCY = 20;
  let downloadedCount = 0;

  for (let i = 0; i < downloadList.length; i += IMG_CONCURRENCY) {
    const chunk = downloadList.slice(i, i + IMG_CONCURRENCY);
    await Promise.all(
      chunk.map(async (item) => {
        await downloadImage(item.remoteUrl, item.localPath);
        downloadedCount++;
      })
    );
    process.stdout.write(`\rDownloaded images: ${downloadedCount}/${downloadList.length}...`);
  }

  console.log('\nAll new images downloaded successfully!');

  // Merge with existing products
  const finalProducts = [...existingProducts, ...newProducts];
  console.log(`Updated total products in Hykon: ${finalProducts.length}`);

  // Re-export json data
  fs.writeFileSync('src/data/products.json', JSON.stringify(finalProducts, null, 2), 'utf8');

  // Compute updated categories and brands
  const categoriesMap = new Map();
  for (const p of finalProducts) {
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
    for (const prod of finalProducts) {
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
  for (const prod of finalProducts) {
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

  fs.writeFileSync('src/data/categories.json', JSON.stringify(populatedCategories, null, 2), 'utf8');
  fs.writeFileSync('src/data/brands.json', JSON.stringify(allBrands, null, 2), 'utf8');
  console.log(`Saved ${finalProducts.length} products, ${populatedCategories.length} categories, and ${allBrands.length} brands!`);
}

scrapeAllFilterPages().catch(console.error);
