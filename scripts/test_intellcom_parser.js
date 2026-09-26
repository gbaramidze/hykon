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
  const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : '';

  // SKU / Code
  const skuM = html.match(/(?:კოდი|Model|SKU|არტიკული)[:\s]*<[^>]*>([\s\S]*?)<\/[^>]*>/i) ||
               html.match(/class=["'][^"']*sku[^"']*["'][^>]*>([\s\S]*?)<\//i) ||
               html.match(/class=["'][^"']*code[^"']*["'][^>]*>([\s\S]*?)<\//i);
  const sku = skuM ? skuM[1].replace(/<[^>]+>/g, '').trim() : '';

  // Price
  let price = 0;
  let oldPrice = 0;
  
  // Look for price block
  const priceBlock = html.match(/<div[^>]+class=["'][^"']*product[_-]?price[^"']*["'][\s\S]*?<\/div>/i) ||
                     html.match(/<div[^>]+class=["'][^"']*price[^"']*["'][\s\S]*?<\/div>/i);
  
  const priceMatches = [...html.matchAll(/([0-9.,]+)\s*₾/g)].map(m => parseFloat(m[1].replace(',', '')));
  if (priceMatches.length > 0) {
    price = priceMatches[0];
    if (priceMatches.length > 1 && priceMatches[1] > price) {
      oldPrice = priceMatches[1];
    }
  }

  // Brand
  let brand = 'HiLook';
  if (title.toLowerCase().includes('hilook')) brand = 'HiLook';
  else if (title.toLowerCase().includes('hikvision')) brand = 'Hikvision';
  else if (title.toLowerCase().includes('dahua')) brand = 'Dahua';
  else if (title.toLowerCase().includes('imou')) brand = 'Imou';
  else if (title.toLowerCase().includes('uniview') || title.toLowerCase().includes('unv')) brand = 'Uniview';
  else if (title.toLowerCase().includes('ezviz')) brand = 'EZVIZ';
  else if (title.toLowerCase().includes('seagate')) brand = 'Seagate';
  else if (title.toLowerCase().includes('western digital') || title.toLowerCase().includes('wd')) brand = 'Western Digital';
  else if (title.toLowerCase().includes('tiandy')) brand = 'Tiandy';

  // Images
  const imgMatches = [...html.matchAll(/<(?:img|a)[^>]+(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi)].map(m => m[1]);
  const productImgs = imgMatches.filter(i => 
    (i.includes('/products/') || i.includes('/upload/') || i.includes('/media/') || i.includes('/gallery/')) &&
    !i.includes('logo') && !i.includes('banner') && !i.includes('icon')
  );
  const uniqueImgs = [...new Set(productImgs)].map(i => i.startsWith('http') ? i : `https://www.intellcom.ge${i.startsWith('/') ? '' : '/'}${i}`);

  // Description & Specs
  const descMatch = html.match(/<div[^>]+id=["']tab-description["'][\s\S]*?<\/div>/i) ||
                    html.match(/<div[^>]+class=["'][^"']*description[^"']*["'][\s\S]*?<\/div>/i);
  const description = descMatch ? descMatch[0] : '';

  // Breadcrumbs
  const breadcrumbs = [...html.matchAll(/<a[^>]+href=["'](\/ka\/catalog\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
    href: m[1],
    name: m[2].replace(/<[^>]+>/g, '').trim()
  })).filter(b => b.name && !b.name.includes('ქართული') && !b.name.includes('კატალოგი'));

  return {
    url,
    title,
    sku,
    price,
    oldPrice,
    brand,
    images: uniqueImgs,
    breadcrumbs,
    hasDescription: description.length > 0
  };
}

async function testSample() {
  const prods = JSON.parse(fs.readFileSync('scripts/intellcom_cat50_products.json', 'utf8'));
  console.log(`Testing 5 products out of ${prods.length}...`);
  
  for (let i = 0; i < 5; i++) {
    const pUrl = prods[i].startsWith('http') ? prods[i] : `https://www.intellcom.ge${prods[i]}`;
    const html = await get(pUrl);
    const parsed = parseProduct(html, pUrl);
    console.log(`\nProduct ${i+1}:`, parsed);
  }
}

testSample().catch(console.error);
