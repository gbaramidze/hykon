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

async function main() {
  const html = fs.readFileSync('scripts/intellcom_test.html', 'utf8');

  // Let's find pagination or script tags with products
  console.log('Finding scripts with products or pagination...');
  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  for (const s of scripts) {
    if (s.includes('page') || s.includes('catalog') || s.includes('product') || s.includes('ajax') || s.includes('load')) {
      console.log('Script snippet:', s.substring(0, 300));
    }
  }

  // Let's find subcategories of category 50 or video surveillance
  const catMatches = [...html.matchAll(/href=["'](\/ka\/catalog\/\d+\/[^"']+)["']/g)].map(m => m[1]);
  const uniqueCats = [...new Set(catMatches)];
  console.log('Total ka catalog URLs found:', uniqueCats.length);
  console.log(uniqueCats.slice(0, 30));

  // Let's fetch one product page
  const prodUrl = 'https://www.intellcom.ge/ka/product/02283/50/ანალოგური-კამერა-2მპ-2.8მმ-Dome-მიკროფონით-Turbo-HD-HiLook/';
  const prodHtml = await get(prodUrl);
  fs.writeFileSync('scripts/intellcom_product_sample.html', prodHtml);
  console.log('Fetched sample product, saved length:', prodHtml.length);
}

main().catch(console.error);
