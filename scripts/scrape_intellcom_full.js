const fs = require('fs');
const https = require('https');
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
  // Title
  const titleM = html.match(/<h1[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                 html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : '';
  if (!title) return null;

  // Model
  const modelM = html.match(/id=["']product_model["'][^>]*>([\s\S]*?)<\//i) ||
                 html.match(/მოდელი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const model = modelM ? modelM[1].replace(/<[^>]+>/g, '').trim() : '';

  // Code / SKU
  const codeM = html.match(/კოდი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const sku = codeM ? codeM[1].replace(/<[^>]+>/g, '').trim() : (model || `INT-${1000 + idx}`);

  // Price
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

  // Brand detection
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

  // Images: find all big/medium images and group by filename
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

  // Description
  const descM = html.match(/<div[^>]+id=["']description["'][\s\S]*?<\/div>/i);
  let description = '';
  if (descM) {
    description = descM[0].replace(/<div[^>]*>|<\/div>/gi, '').trim();
  }

  // Breadcrumbs
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

  // If no breadcrumbs, default to video surveillance
  if (breadcrumbs.length === 0) {
    breadcrumbs.push(
      { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
      { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' }
    );
  }

  const primaryCategory = breadcrumbs[breadcrumbs.length - 1];

  const productSlug = `${slugify(title)}-${sku ? slugify(sku) : idx}`.replace(/-+/g, '-');

  return {
    id: `prod-int-${idx + 1}`,
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
    createdAt: new Date().toISOString()
  };
}

async function main() {
  const urls = JSON.parse(fs.readFileSync('scripts/intellcom_cat50_products.json', 'utf8'));
  console.log(`Starting extraction of ${urls.length} products from intellcom.ge...`);

  const products = [];
  const CONCURRENCY = 15;
  
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (relUrl, chunkIdx) => {
      const globalIdx = i + chunkIdx;
      const fullUrl = relUrl.startsWith('http') ? relUrl : `https://www.intellcom.ge${relUrl}`;
      try {
        const res = await get(fullUrl);
        if (res.status === 200 && res.data) {
          const parsed = parseProduct(res.data, fullUrl, globalIdx);
          if (parsed) {
            products.push(parsed);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${fullUrl}:`, err.message);
      }
    });

    await Promise.all(promises);
    process.stdout.write(`\rParsed: ${products.length}/${urls.length} products...`);
  }

  console.log(`\nAll products parsed! Total valid products: ${products.length}`);
  fs.writeFileSync('scripts/intellcom_products_raw.json', JSON.stringify(products, null, 2));

  // Now collect and download images
  console.log('\n--- DOWNLOADING IMAGES ---');
  const allImagesToDownload = [];
  for (const prod of products) {
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

  // Deduplicate downloads by localPath
  const uniqueDownloads = new Map();
  for (const item of allImagesToDownload) {
    if (!uniqueDownloads.has(item.localPath)) {
      uniqueDownloads.set(item.localPath, item);
    }
    if (!item.prod.images.includes(item.publicUrl)) {
      item.prod.images.push(item.publicUrl);
    }
  }

  for (const prod of products) {
    if (!prod.thumbnail && prod.images.length > 0) {
      prod.thumbnail = prod.images[0];
    }
    delete prod.remoteImages;
  }

  console.log(`Total unique images to download: ${uniqueDownloads.size}`);

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

  console.log('\nAll images downloaded successfully!');
  fs.writeFileSync('scripts/intellcom_products.json', JSON.stringify(products, null, 2));
  console.log('Saved scripts/intellcom_products.json successfully!');
}

main().catch(console.error);
