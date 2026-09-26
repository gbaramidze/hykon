const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function scrapeCategoryPages(baseCatUrl) {
  console.log(`Scraping pages for: ${baseCatUrl}`);
  let page = 1;
  const allProductUrls = new Set();
  
  while (true) {
    const pageUrl = page === 1 ? baseCatUrl : `${baseCatUrl.replace(/\/$/, '')}/page-${page}/`;
    console.log(`Fetching page ${page}: ${pageUrl}`);
    const res = await get(pageUrl);
    if (res.status !== 200 || !res.data) {
      console.log(`Page ${page} returned status ${res.status}. Ending.`);
      break;
    }
    
    const prodMatches = [...res.data.matchAll(/href=["'](\/ka\/product\/[^"']+)["']/g)].map(m => m[1]);
    const uniqueProdsOnPage = [...new Set(prodMatches)];
    
    if (uniqueProdsOnPage.length === 0) {
      console.log(`No products found on page ${page}. Ending.`);
      break;
    }
    
    let newCount = 0;
    for (const p of uniqueProdsOnPage) {
      if (!allProductUrls.has(p)) {
        allProductUrls.add(p);
        newCount++;
      }
    }
    
    console.log(`Page ${page}: found ${uniqueProdsOnPage.length} links (${newCount} new). Total collected: ${allProductUrls.size}`);
    
    if (newCount === 0) {
      console.log(`No new products on page ${page}. Ending.`);
      break;
    }
    
    page++;
    if (page > 50) break; // safety limit
  }
  
  return [...allProductUrls];
}

async function main() {
  const cat50Url = 'https://www.intellcom.ge/ka/catalog/50/%E1%83%95%E1%83%98%E1%83%93%E1%83%94%E1%83%9D-%E1%83%9B%E1%83%94%E1%83%97%E1%83%95%E1%83%90%E1%83%9A%E1%83%A7%E1%83%A3%E1%83%A0%E1%83%94%E1%83%9D%E1%83%91%E1%83%90/';
  const prods = await scrapeCategoryPages(cat50Url);
  console.log(`\nDONE! Total unique products for Category 50: ${prods.length}`);
  fs.writeFileSync('scripts/intellcom_cat50_products.json', JSON.stringify(prods, null, 2));
}

main().catch(console.error);
