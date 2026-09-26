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

async function run() {
  const mainCatHtml = await get('https://www.intellcom.ge/ka/catalog/50/%E1%83%95%E1%83%98%E1%83%93%E1%83%94%E1%83%9D-%E1%83%9B%E1%83%94%E1%83%97%E1%83%95%E1%83%90%E1%83%9A%E1%83%A7%E1%83%A3%E1%83%A0%E1%83%94%E1%83%9D%E1%83%91%E1%83%90/');
  
  // Find all category links in the page
  const catMatches = [...mainCatHtml.matchAll(/href=["'](\/ka\/catalog\/\d+\/[^"']+)["']/g)].map(m => m[1]);
  const uniqueCats = [...new Set(catMatches)];
  console.log('Total catalog URLs found in main page:', uniqueCats.length);

  // Let's also check if there is an ajax endpoint or pagination parameter like ?page=1 or ?p=1 or /50/?page=2
  console.log('Testing page 2...');
  const page2Html = await get('https://www.intellcom.ge/ka/catalog/50/%E1%83%95%E1%83%98%E1%83%93%E1%83%94%E1%83%9D-%E1%83%9B%E1%83%94%E1%83%97%E1%83%95%E1%83%90%E1%83%9A%E1%83%A7%E1%83%A3%E1%83%A0%E1%83%94%E1%83%9D%E1%83%91%E1%83%90/?page=2');
  console.log('Page 2 length:', page2Html.length);
  
  const p1Prods = [...mainCatHtml.matchAll(/href=["'](\/ka\/product\/[^"']+)["']/g)].map(m => m[1]);
  const p2Prods = [...page2Html.matchAll(/href=["'](\/ka\/product\/[^"']+)["']/g)].map(m => m[1]);
  
  console.log('P1 products:', [...new Set(p1Prods)].length);
  console.log('P2 products:', [...new Set(p2Prods)].length);
  console.log('Overlap:', p1Prods.filter(x => p2Prods.includes(x)).length);
  console.log('Sample P2:', [...new Set(p2Prods)].slice(0, 3));
}

run().catch(console.error);
