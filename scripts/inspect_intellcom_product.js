const fs = require('fs');

const catHtml = fs.readFileSync('scripts/intellcom_test.html', 'utf8');
const prodHtml = fs.readFileSync('scripts/intellcom_product_sample.html', 'utf8');

console.log('=== PRODUCT PAGE INSPECTION ===');
// Title
const titleMatch = prodHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('Title:', titleMatch ? titleMatch[1].trim() : 'NOT FOUND');

// Price
const priceMatches = prodHtml.match(/([0-9.,]+)\s*₾|([0-9.,]+)\s*GEL|price[^>]*>([\s\S]*?)<\//gi);
console.log('Price matches:', priceMatches);

// Images
const imgMatches = [...prodHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Images:', imgMatches.filter(i => i.includes('product') || i.includes('upload') || i.includes('media') || i.includes('image')));

// Breadcrumb
const breadcrumb = [...prodHtml.matchAll(/<a[^>]+href=["'](\/ka\/catalog\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
  href: m[1],
  name: m[2].replace(/<[^>]+>/g, '').trim()
}));
console.log('Breadcrumb:', breadcrumb);

// Specs / Description
const descMatches = prodHtml.match(/<div[^>]+class=["'][^"']*(description|spec|characteristic|tab|content)[^"']*["'][\s\S]*?<\/div>/gi);
console.log('Desc blocks found:', descMatches ? descMatches.length : 0);

// Find subcategories of 50 in category page
console.log('\n=== CATEGORIES IN MENU ===');
const catLinks = [...catHtml.matchAll(/<a[^>]+href=["'](\/ka\/catalog\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
  url: m[1],
  id: m[2],
  slug: m[3],
  text: m[4].replace(/<[^>]+>/g, '').trim()
}));

const uniqueMenu = [];
const seen = new Set();
for (const c of catLinks) {
  if (c.text && !seen.has(c.url)) {
    seen.add(c.url);
    uniqueMenu.push(c);
  }
}
console.log('Menu categories total:', uniqueMenu.length);
console.log('Sample:', uniqueMenu.slice(0, 25));
