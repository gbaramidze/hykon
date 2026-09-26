const fs = require('fs');
const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseProduct(html, url) {
  // Title
  const titleM = html.match(/<h1[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                 html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : '';

  // Model
  const modelM = html.match(/id=["']product_model["'][^>]*>([\s\S]*?)<\//i) ||
                 html.match(/მოდელი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const model = modelM ? modelM[1].replace(/<[^>]+>/g, '').trim() : '';

  // Code / SKU
  const codeM = html.match(/კოდი:?<\/span>\s*<span[^>]*class=["']value["'][^>]*>([\s\S]*?)<\//i);
  const sku = codeM ? codeM[1].replace(/<[^>]+>/g, '').trim() : (model || 'INT-' + Math.floor(Math.random()*100000));

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

  // Brand
  let brand = 'Intellcom';
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

  // Images
  const bigImgs = [...html.matchAll(/\/files\/product_imgs\/big\/[a-zA-Z0-9._-]+/gi)].map(m => m[0]);
  const mediumImgs = [...html.matchAll(/\/files\/product_imgs\/medium\/[a-zA-Z0-9._-]+/gi)].map(m => m[0]);
  const allImgs = [...bigImgs, ...mediumImgs].map(i => `https://www.intellcom.ge${i.replace(/\);?$/, '')}`);
  const uniqueImgs = [...new Set(allImgs)];

  // Description
  const descM = html.match(/<div[^>]+id=["']description["'][\s\S]*?<\/div>/i);
  let description = '';
  if (descM) {
    description = descM[0].replace(/<div[^>]*>|<\/div>/gi, '').trim();
  }

  // Breadcrumbs / Categories
  const catNavM = html.match(/<div[^>]+class=["'][^"']*category-nav[^"']*["'][\s\S]*?<\/div>/i);
  const breadcrumbs = [];
  if (catNavM) {
    const links = [...catNavM[0].matchAll(/<a[^>]+href=["'](\/ka\/catalog\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi)];
    for (const l of links) {
      const name = l[4].replace(/<[^>]+>/g, '').trim();
      if (name && !name.includes('მთავარი')) {
        breadcrumbs.push({
          id: `intellcom-${l[2]}`,
          name,
          slug: decodeURIComponent(l[3]).replace(/\/$/, '')
        });
      }
    }
  }

  return {
    url,
    title,
    model,
    sku,
    price,
    oldPrice,
    brand,
    images: uniqueImgs,
    breadcrumbs,
    descriptionLength: description.length,
    descriptionPreview: description.substring(0, 150)
  };
}

async function run() {
  const prods = JSON.parse(fs.readFileSync('scripts/intellcom_cat50_products.json', 'utf8'));
  for (let i of [0, 50, 100, 200, 350]) {
    const url = `https://www.intellcom.ge${prods[i]}`;
    const html = await get(url);
    const p = parseProduct(html, url);
    console.log(JSON.stringify(p, null, 2));
  }
}

run().catch(console.error);
